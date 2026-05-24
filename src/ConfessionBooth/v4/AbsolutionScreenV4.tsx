import { useEffect } from 'react';
import Pill from './Pill';
import NumberDot from './NumberDot';
import ArrowChip from './ArrowChip';
import RainbowArc from './patterns/RainbowArc';
import { t, getLocale } from '../i18n';
import { playStampThud } from '../utils/audio';
import type { Confession, Verdict } from '../types';

interface Props {
  confession: Confession;
  onAnother: () => void;
  onWall: () => void;
  slam?: boolean;
}

const VERDICT_WORD: Record<Verdict, Record<string, string>> = {
  ABSOLVED: { en: 'ABSOLVED', zh: '已赦免', es: 'ABSUELTO', pt: 'ABSOLVIDO', ru: 'ПРОЩЁН', ja: '赦免', ko: '사함받음', fr: 'ABSOUS' },
  DENIED: { en: 'DENIED', zh: '驳回', es: 'NEGADO', pt: 'NEGADO', ru: 'ОТКЛОНЕНО', ja: '却下', ko: '거부', fr: 'REFUSÉ' },
  DEFERRED: { en: 'DEFERRED', zh: '延审', es: 'APLAZADO', pt: 'ADIADO', ru: 'ОТЛОЖЕНО', ja: '保留', ko: '보류', fr: 'REPORTÉ' },
};

const VERDICT_COLOR: Record<Verdict, 'pink' | 'coral' | 'lavender'> = {
  ABSOLVED: 'pink',
  DENIED: 'coral',
  DEFERRED: 'lavender',
};

const ANOTHER: Record<string, string> = { en: 'ANOTHER', zh: '再来', es: 'OTRA', pt: 'OUTRA', ru: 'ЕЩЁ', ja: 'もう一度', ko: '한 번 더', fr: 'UNE AUTRE' };
const WALL: Record<string, string> = { en: 'WALL', zh: '墙', es: 'MURO', pt: 'MURO', ru: 'СТЕНА', ja: '壁', ko: '벽', fr: 'MUR' };

// Absolution = Wolność Panel 5: black bg + 5-stripe rainbow U-arc framing the
// content. Inside the arc:
//   - row 1: ticket# + call-time (small black pills)
//   - row 2: sin (one long cream pill)
//   - row 3: ← VERDICT → (verdict-colored pill flanked by arrow chips)
// Below the arc:
//   - operator reply broken into a short pill stack
//   - penance (cream pill)
//   - dock: ANOTHER + WALL pill buttons
export default function AbsolutionScreenV4({ confession, onAnother, onWall, slam }: Props) {
  useEffect(() => {
    if (slam) {
      const id = setTimeout(() => playStampThud(), 240);
      return () => clearTimeout(id);
    }
  }, [slam]);

  const loc = getLocale();
  const verdictWord = VERDICT_WORD[confession.verdict][loc] ?? VERDICT_WORD[confession.verdict].en;
  const verdictColor = VERDICT_COLOR[confession.verdict];
  const replyLines = confession.operatorReply.split('\n').filter((l) => l.trim().length > 0);

  return (
    <div className="cb4-abs" data-verdict={confession.verdict}>
      <header className="cb4-abs__head">
        <span className="cb4-abs__head-dot" />
        <span className="cb4-abs__head-text">{t('meta_receipt')}</span>
        <span className="cb4-abs__ticket">{confession.ticketNumber}</span>
      </header>

      {/* Arc frame + content */}
      <section className="cb4-abs__arc-wrap">
        <RainbowArc
          colors={[verdictColor === 'lavender' ? '#a888ff' : '#ff4d8e', '#ff7a4a', '#ffd24a', '#3ed9b9', verdictColor === 'lavender' ? '#ff4d8e' : '#a888ff']}
          bg="#0a0a0a"
          className="cb4-abs__arc"
        />
        <div className="cb4-abs__arc-content">
          {/* row 1: meta pills */}
          <div className="cb4-abs__meta-row">
            <Pill variant="cream" size="sm">
              <NumberDot value={confession.ticketNumber.replace('#', '')} color="orange" size="sm" />
              <span style={{ marginLeft: 2 }}>TICKET</span>
            </Pill>
            <Pill variant="cream" size="sm">
              {t('abs_duration')} {confession.callDuration}
            </Pill>
          </div>

          {/* row 2: sin */}
          <div className="cb4-abs__sin-row">
            <Pill variant="cream" size="md" className="cb4-abs__sin-pill">
              &ldquo;{confession.sin}&rdquo;
            </Pill>
          </div>

          {/* row 3: verdict with arrows */}
          <div className="cb4-abs__verdict-row">
            <ArrowChip direction="right" variant="orange" />
            <Pill variant={verdictColor} size="xl" className="cb4-abs__verdict-pill">
              {verdictWord}
            </Pill>
            <ArrowChip direction="left" variant="orange" />
          </div>
        </div>
      </section>

      {/* Below the arc: operator reply + penance */}
      <section className="cb4-abs__below">
        <div className="cb4-abs__reply">
          <span className="cb4-abs__section-label">{t('abs_reply')}</span>
          {replyLines.map((line, i) => (
            <Pill
              key={i}
              variant={i % 2 === 0 ? 'cream' : 'yellow'}
              size="sm"
              className="cb4-abs__reply-line"
            >
              {line}
            </Pill>
          ))}
        </div>

        <div className="cb4-abs__penance">
          <span className="cb4-abs__section-label">{t('abs_penance')}</span>
          <Pill variant="coral" size="md" className="cb4-abs__penance-pill">
            {confession.penance}
          </Pill>
        </div>
      </section>

      {/* Dock: ANOTHER + WALL */}
      <section className="cb4-abs__dock">
        <button type="button" className="cb4-abs__dock-secondary" onPointerDown={(e) => { e.preventDefault(); onWall(); }}>
          {WALL[loc] ?? WALL.en}
        </button>
        <button type="button" className="cb4-abs__dock-primary" onPointerDown={(e) => { e.preventDefault(); onAnother(); }}>
          <span className="cb4-abs__dock-arrow">↻</span>
          <span className="cb4-abs__dock-label">{ANOTHER[loc] ?? ANOTHER.en}</span>
        </button>
      </section>
    </div>
  );
}
