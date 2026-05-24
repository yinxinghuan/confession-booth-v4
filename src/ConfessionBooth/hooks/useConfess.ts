// The core "submit sin → get absolution" pipeline.
//
// One LLM call (operator persona returns JSON of reply/penance/quip/verdict).
// Returns a fully-formed Confession.

import { useCallback, useRef, useState } from 'react';
import { buildOperatorSystem, parseAbsolution } from '../utils/prompts';
import { newConfessionId, newTicketNumber, fakeCallDuration } from '../utils/ticket';
import { getLocale, LOCALE_PROMPT_LABEL } from '../i18n';
import type { Confession, ProcessingStage } from '../types';

const CHAT_URL = 'https://chat.aiwaves.tech/aigram/api/game-chat';

async function chatOnce(system: string, user: string): Promise<string> {
  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`chat failed: HTTP ${res.status}`);
  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return json.choices?.[0]?.message?.content ?? '';
}

export interface UseConfess {
  generate: (sin: string) => Promise<Confession>;
  loading: boolean;
  stage: ProcessingStage | '';
  error: Error | null;
}

const STAGES: ProcessingStage[] = ['ringing', 'hold', 'connected', 'cross-ref', 'stamping'];

export function useConfess(): UseConfess {
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<ProcessingStage | ''>('');
  const [error, setError] = useState<Error | null>(null);
  const inFlight = useRef(false);

  const generate = useCallback(async (sin: string): Promise<Confession> => {
    if (inFlight.current) throw new Error('confess: already in flight');
    if (!sin.trim()) throw new Error('confess: empty sin');
    inFlight.current = true;
    setLoading(true);
    setError(null);
    setStage('ringing');

    // Walk through cosmetic stages while LLM is in flight.
    const advance = (() => {
      let i = 0;
      const tick = () => {
        i += 1;
        if (i < STAGES.length - 1) {
          setStage(STAGES[i]);
        }
      };
      // ~1.6s, 2.4s, 3.6s, 5.0s elapsed
      const t1 = setTimeout(tick, 1600);
      const t2 = setTimeout(tick, 2400);
      const t3 = setTimeout(tick, 3600);
      const t4 = setTimeout(tick, 5000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    })();

    try {
      const languageLabel = LOCALE_PROMPT_LABEL[getLocale()];
      const raw = await chatOnce(
        buildOperatorSystem(languageLabel),
        `Caller's confession (verbatim, do not echo it back): "${sin}"`,
      );
      const parsed = parseAbsolution(raw);
      advance();
      setStage('stamping');
      // Settling beat so the stamp animation reads
      await new Promise((r) => setTimeout(r, 650));

      const confession: Confession = {
        id: newConfessionId(),
        sin: sin.trim(),
        operatorReply: parsed.reply,
        penance: parsed.penance,
        quip: parsed.quip,
        verdict: parsed.verdictHint,
        ticketNumber: newTicketNumber(),
        callDuration: fakeCallDuration(),
        createdAt: Date.now(),
      };
      return confession;
    } catch (e) {
      advance();
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    } finally {
      inFlight.current = false;
      setLoading(false);
      setStage('');
    }
  }, []);

  return { generate, loading, stage, error };
}
