import { useState } from 'react';
import Pill from './Pill';
import NumberDot from './NumberDot';
import Sunburst from './patterns/Sunburst';
import Confetti from './Confetti';
import { t, getLocale } from '../i18n';
import type { Confession, Verdict } from '../types';

interface Props {
  entries: Confession[];
  loaded: boolean;
  onBack: () => void;
  onConfess: () => void;
}

const TITLE: Record<string, string> = {
  en: 'MOSTLY FORGIVEN', zh: '基本上已被赦免', es: 'CASI PERDONADOS',
  pt: 'QUASE PERDOADOS', ru: 'ПОЧТИ ПРОЩЕНЫ', ja: 'ほぼ赦された',
  ko: '거의 사함받음', fr: 'PRESQUE PARDONNÉS',
};
const BACK: Record<string, string> = {
  en: 'BACK', zh: '返回', es: 'ATRÁS', pt: 'VOLTAR',
  ru: 'НАЗАД', ja: '戻る', ko: '뒤로', fr: 'RETOUR',
};
const CONFESS_NOW: Record<string, string> = {
  en: 'CONFESS', zh: '现在忏悔', es: 'CONFESARSE', pt: 'CONFESSAR',
  ru: 'ИСПОВЕДЬ', ja: '告解する', ko: '고백하기', fr: 'CONFESSE',
};

// Per-card sunburst palettes — each medallion gets its own color combo
// (the Wolność portraits do this — each has a different multi-color burst
// behind it).
const SUNBURST_PALETTES: string[][] = [
  ['#ff4d8e', '#ffd24a'],
  ['#a888ff', '#3ed9b9'],
  ['#ff7a4a', '#fce8c8'],
  ['#3ed9b9', '#ff4d8e'],
  ['#ffd24a', '#a888ff'],
  ['#ff7a4a', '#ff4d8e'],
];

const VERDICT_COLOR: Record<Verdict, 'pink' | 'coral' | 'lavender'> = {
  ABSOLVED: 'pink',
  DENIED: 'coral',
  DEFERRED: 'lavender',
};

// Wall = Wolność Panel 7: irregular grid of "portraits" with mini sunbursts.
// Each confession card adapts the portrait medallion structure:
//   - mini sunburst behind the card
//   - center "verdict dot" replaces the B&W portrait (anonymous)
//   - ticket# pill on top
//   - short sin chip below
//   - tap to expand → shows operator reply
export default function WallScreenV4({ entries, loaded, onBack, onConfess }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const loc = getLocale();
  const title = TITLE[loc] ?? TITLE.en;
  const backLabel = BACK[loc] ?? BACK.en;
  const confessLabel = CONFESS_NOW[loc] ?? CONFESS_NOW.en;

  return (
    <div className="cb4-wall">
      <Confetti
        width={400}
        height={1200}
        count={20}
        colors={['#ff9a3c', '#fce8c8']}
        rRange={[2.5, 5]}
        seed={31}
        className="cb4-wall__confetti"
      />

      <header className="cb4-wall__head">
        <button type="button" className="cb4-wall__back" onPointerDown={(e) => { e.preventDefault(); onBack(); }}>
          ↖ {backLabel}
        </button>
        <h1 className="cb4-wall__title">{title}</h1>
      </header>

      {!loaded ? (
        <div className="cb4-wall__empty">…</div>
      ) : entries.length === 0 ? (
        <div className="cb4-wall__empty">
          <p>{t('wall_empty')}</p>
        </div>
      ) : (
        <ol className="cb4-wall__grid">
          {entries.map((c, i) => {
            const open = openId === c.id;
            const palette = SUNBURST_PALETTES[i % SUNBURST_PALETTES.length];
            const dotColor = VERDICT_COLOR[c.verdict];

            return (
              <li
                key={c.id}
                className={`cb4-wall__card ${open ? 'cb4-wall__card--open' : ''}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  setOpenId(open ? null : c.id);
                }}
              >
                <div className="cb4-wall__medallion">
                  <Sunburst
                    colors={palette}
                    bg="#0a0a0a"
                    rays={12}
                    className="cb4-wall__medallion-burst"
                  />
                  <span className={`cb4-wall__verdict-dot cb4-wall__verdict-dot--${dotColor}`}>
                    {c.verdict.charAt(0)}
                  </span>
                </div>

                <div className="cb4-wall__card-body">
                  <div className="cb4-wall__card-meta">
                    <NumberDot value={c.ticketNumber.replace('#', '').split('-')[0]} color="orange" size="sm" />
                    <span className="cb4-wall__card-anon">{t('wall_anon')}</span>
                    {i === 0 && <span className="cb4-wall__new-tag">NEW</span>}
                  </div>
                  <div className="cb4-wall__sin-chip">
                    &ldquo;{c.sin}&rdquo;
                  </div>
                  <span className="cb4-wall__expand-hint">
                    {open ? '↑ TAP TO CLOSE' : '↓ TAP TO READ MORE'}
                  </span>
                </div>

                {open && (
                  <div className="cb4-wall__expand">
                    {c.operatorReply
                      .split('\n')
                      .filter((l) => l.trim().length > 0)
                      .map((line, j) => (
                        <Pill key={j} variant={j % 2 === 0 ? 'yellow' : 'cream'} size="sm" className="cb4-wall__expand-line">
                          {line}
                        </Pill>
                      ))}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <div className="cb4-wall__dock">
        <button type="button" className="cb4-wall__dock-primary" onPointerDown={(e) => { e.preventDefault(); onConfess(); }}>
          <span className="cb4-wall__dock-arrow">→</span>
          <span className="cb4-wall__dock-label">{confessLabel}</span>
        </button>
      </div>
    </div>
  );
}
