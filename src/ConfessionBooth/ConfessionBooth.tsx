import { useCallback, useEffect, useState } from 'react';
import './ConfessionBooth.less';
import './v4/v4.less';
import WoodPanel from './components/WoodPanel';
import SvgFilters from './components/SvgFilters';
import BoothScreen from './v4/BoothScreenV4';
import TypingScreen from './components/TypingScreen';
import ProcessingScreen from './components/ProcessingScreen';
import AbsolutionScreen from './components/AbsolutionScreen';
import WallScreen from './components/WallScreen';
import { useConfess } from './hooks/useConfess';
import { useWall } from './hooks/useWall';
import { useGameSave } from '@shared/save';
import type { Confession, Phase } from './types';
import type { ConfessionSave } from './hooks/useWall';
import { getDemoConfession, getDemoWall } from './utils/demo';
import { parseAbsolution } from './utils/prompts';
import { newConfessionId, newTicketNumber, fakeCallDuration } from './utils/ticket';
import {
  startOnHold,
  stopOnHold,
  startRing,
  stopRing,
  shutdownAudio,
} from './utils/audio';

const GAME_ID = 'confession-booth';

function demoFromUrl(): Phase | null {
  if (typeof window === 'undefined') return null;
  const u = new URL(window.location.href);
  const d = u.searchParams.get('demo');
  if (d === 'booth' || d === 'typing' || d === 'processing' || d === 'absolution' || d === 'wall') return d;
  return null;
}

export default function ConfessionBooth() {
  const demo = demoFromUrl();
  const [phase, setPhase] = useState<Phase>(demo ?? 'booth');
  const [confession, setConfession] = useState<Confession | null>(
    demo === 'absolution' ? getDemoConfession() : null,
  );
  const [touched, setTouched] = useState(false);

  const { generate, loading, stage, error } = useConfess();
  const { entries: cloudEntries, loaded: wallLoaded, refresh: refreshWall } = useWall();
  const save = useGameSave<ConfessionSave>(GAME_ID);

  // Local cache of confessions (newest first). Includes the player's own
  // history before it round-trips through the cloud.
  const [localHistory, setLocalHistory] = useState<Confession[]>([]);
  useEffect(() => {
    if (save.savedData?.confessions) setLocalHistory(save.savedData.confessions);
  }, [save.savedData]);

  // The wall blends the latest cloud entries with the player's own latest
  // confession at the top (until the cloud catches up).
  const wallEntries = (() => {
    if (demo === 'wall') return getDemoWall();
    const seen = new Set<string>();
    const merged: Confession[] = [];
    if (localHistory[0]) {
      merged.push(localHistory[0]);
      seen.add(localHistory[0].id);
    }
    for (const c of cloudEntries) {
      if (seen.has(c.id)) continue;
      merged.push(c);
      if (merged.length >= 6) break;
    }
    return merged.length > 0 ? merged : getDemoWall();
  })();

  // Audio plumbing: ring during ringing, on-hold during hold/connected/cross-ref
  useEffect(() => {
    if (!touched) return;
    if (stage === 'ringing') {
      startRing();
      stopOnHold();
    } else if (stage === 'hold' || stage === 'connected' || stage === 'cross-ref') {
      stopRing();
      startOnHold();
    } else {
      stopRing();
      stopOnHold();
    }
  }, [stage, touched]);

  useEffect(() => () => shutdownAudio(), []);

  // ---- Phase handlers -----------------------------------------------------

  const enterBooth = useCallback(() => {
    setTouched(true); // first user gesture — gates audio
    setPhase('typing');
  }, []);

  const submitSin = useCallback(
    async (text: string) => {
      setPhase('processing');
      try {
        const c = await generate(text);
        setConfession(c);
        // Persist to cloud + local: prepend the new confession (newest first)
        setLocalHistory((prev) => {
          const next = [c, ...prev].slice(0, 30);
          save.persist({ confessions: next });
          return next;
        });
        setPhase('absolution');
      } catch (e) {
        // On error: fall back to a deterministic absolution from the local
        // fallback pool so the user still gets a receipt.
        const fb = parseAbsolution('');
        const c: Confession = {
          id: newConfessionId(),
          sin: text,
          operatorReply: fb.reply,
          penance: fb.penance,
          quip: fb.quip,
          verdict: fb.verdictHint,
          ticketNumber: newTicketNumber(),
          callDuration: fakeCallDuration(),
          createdAt: Date.now(),
        };
        setConfession(c);
        setLocalHistory((prev) => {
          const next = [c, ...prev].slice(0, 30);
          save.persist({ confessions: next });
          return next;
        });
        setPhase('absolution');
      }
    },
    [generate, save],
  );

  const back = useCallback(() => {
    setPhase('booth');
  }, []);

  const goWall = useCallback(() => {
    refreshWall();
    setPhase('wall');
  }, [refreshWall]);

  const another = useCallback(() => {
    setPhase('typing');
  }, []);

  // ---- Cosmetic week count (deterministic-ish bump) ----------------------
  // Local approximation; not strictly accurate but reads as "alive". When in
  // Aigram + wall has entries, we add the wall size to a baseline.
  const weekCount = 4827 + (cloudEntries.length || 0) * 53 + (localHistory.length || 0);

  // ---- Render -------------------------------------------------------------

  return (
    <div className="cb-shell" data-phase={phase}>
      <WoodPanel />
      <SvgFilters />
      <div className="cb-stage">
        {phase === 'booth' && (
          <BoothScreen weekCount={weekCount} onEnter={enterBooth} onWall={goWall} />
        )}
        {phase === 'typing' && <TypingScreen onSubmit={submitSin} onBack={back} />}
        {phase === 'processing' && <ProcessingScreen stage={stage || 'ringing'} />}
        {phase === 'absolution' && confession && (
          <AbsolutionScreen
            confession={confession}
            onAnother={another}
            onWall={goWall}
            slam={!demo /* only slam on fresh result, not on demo route */}
          />
        )}
        {phase === 'wall' && (
          <WallScreen entries={wallEntries} loaded={wallLoaded || demo === 'wall'} onBack={back} onConfess={another} />
        )}
      </div>

      {error && phase !== 'absolution' && (
        <p className="cb-toast">Operator dropped the call.</p>
      )}

      {/* DEBUG: loading indicator is folded into the processing screen via stage */}
      {loading && phase !== 'processing' && <span className="cb-loading-hidden" aria-hidden />}
    </div>
  );
}
