import { useState } from 'react';
import NumberDot from './NumberDot';
import TopNav from './TopNav';
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
const CLOSE: Record<string, string> = {
  en: 'CLOSE', zh: '关闭', es: 'CERRAR', pt: 'FECHAR',
  ru: 'ЗАКРЫТЬ', ja: '閉じる', ko: '닫기', fr: 'FERMER',
};

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

const VERDICT_WORD: Record<Verdict, Record<string, string>> = {
  ABSOLVED: { en: 'ABSOLVED', zh: '已赦免', es: 'ABSUELTO', pt: 'ABSOLVIDO', ru: 'ПРОЩЁН', ja: '赦免', ko: '사함받음', fr: 'ABSOUS' },
  DENIED: { en: 'DENIED', zh: '驳回', es: 'NEGADO', pt: 'NEGADO', ru: 'ОТКЛОНЕНО', ja: '却下', ko: '거부', fr: 'REFUSÉ' },
  DEFERRED: { en: 'DEFERRED', zh: '延审', es: 'APLAZADO', pt: 'ADIADO', ru: 'ОТЛОЖЕНО', ja: '保留', ko: '보류', fr: 'REPORTÉ' },
};

export default function WallScreenV4({ entries, loaded, onBack, onConfess }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const loc = getLocale();
  const title = TITLE[loc] ?? TITLE.en;
  const backLabel = BACK[loc] ?? BACK.en;
  const confessLabel = CONFESS_NOW[loc] ?? CONFESS_NOW.en;
  const closeLabel = CLOSE[loc] ?? CLOSE.en;

  const opened = entries.find((c) => c.id === openId);

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

      <TopNav left={{ kind: 'back', label: backLabel, onBack }} />

      <header className="cb4-wall__title-row">
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
            const palette = SUNBURST_PALETTES[i % SUNBURST_PALETTES.length];
            const dotColor = VERDICT_COLOR[c.verdict];

            return (
              <li
                key={c.id}
                className="cb4-wall__card"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setOpenId(c.id);
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
                  <span className="cb4-wall__expand-hint">↗ TAP TO OPEN</span>
                </div>
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

      {/* Modal overlay — full-screen view of one confession */}
      {opened && (
        <div className="cb4-modal" onPointerDown={(e) => { e.preventDefault(); setOpenId(null); }}>
          <div className="cb4-modal__head">
            <button
              type="button"
              className="cb4-modal__close"
              onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); setOpenId(null); }}
            >
              <span>←</span>
              <span>{closeLabel}</span>
            </button>
            <span className="cb4-modal__ticket">{opened.ticketNumber}</span>
          </div>

          <div className="cb4-modal__body" onPointerDown={(e) => e.stopPropagation()}>
            <div className="cb4-modal__medallion">
              <Sunburst
                colors={SUNBURST_PALETTES[entries.indexOf(opened) % SUNBURST_PALETTES.length]}
                bg="#0a0a0a"
                rays={12}
                className="cb4-wall__medallion-burst"
              />
              <span className={`cb4-wall__verdict-dot cb4-wall__verdict-dot--${VERDICT_COLOR[opened.verdict]}`}>
                {opened.verdict.charAt(0)}
              </span>
            </div>

            <div className={`cb4-pill cb4-pill--${VERDICT_COLOR[opened.verdict]} cb4-modal__verdict-pill`}>
              {VERDICT_WORD[opened.verdict][loc] ?? VERDICT_WORD[opened.verdict].en}
            </div>

            <div>
              <span className="cb4-modal__section-label">{t('abs_your')}</span>
              <div className="cb4-modal__sin-bubble">&ldquo;{opened.sin}&rdquo;</div>
            </div>

            <div>
              <span className="cb4-modal__section-label">{t('abs_reply')}</span>
              <div className="cb4-modal__reply-bubble">
                {opened.operatorReply
                  .split('\n')
                  .filter((l) => l.trim().length > 0)
                  .map((line, j) => (
                    <p key={j} className="cb4-modal__reply-line">{line}</p>
                  ))}
              </div>
            </div>

            <div>
              <span className="cb4-modal__section-label">{t('abs_penance')}</span>
              <div className="cb4-modal__penance-bubble">{opened.penance}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
