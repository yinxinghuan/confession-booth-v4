import { useState, useMemo } from 'react';
import Stamp from './Stamp';
import Chip from './Chip';
import Receipt from './Receipt';
import MetaStrip from './MetaStrip';
import CardPin, { type CardPinKind } from './CardPin';
import CardStain, { type CardStainKind } from './CardStain';
import { t, getLocale } from '../i18n';
import type { Confession } from '../types';

interface Props {
  entries: Confession[];
  loaded: boolean;
  onBack: () => void;
  onConfess: () => void;
}

// Crash-type variant for the hero on the wall page. Localized inline so
// each language gets its own visually-strong word pair.
const CRASH: Record<string, { line1: string; line2: string }> = {
  en: { line1: 'MOSTLY', line2: 'forgiven' },
  zh: { line1: '大致', line2: '已被赦免' },
  es: { line1: 'CASI', line2: 'perdonados' },
  pt: { line1: 'QUASE', line2: 'perdoados' },
  ru: { line1: 'ПОЧТИ', line2: 'прощены' },
  ja: { line1: 'ほぼ', line2: '赦された' },
  ko: { line1: '거의', line2: '사함받음' },
  fr: { line1: 'PRESQUE', line2: 'pardonnés' },
};

const PIN_KINDS: CardPinKind[] = ['pushpin', 'staple', 'tape', 'pushpin', 'punch', 'staple'];
const STAIN_KINDS: CardStainKind[] = ['coffee', 'margin', 'ink', 'none', 'fold', 'margin'];
const MARGIN_NOTES = ['✓ JL', '?? KS', '!! JL', 'lol', '— mavis', 'tues.'];

export default function WallScreen({ entries, loaded, onBack, onConfess }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const loc = getLocale();
  const crash = CRASH[loc] ?? CRASH.en;

  const decor = useMemo(
    () =>
      entries.map((_, i) => ({
        pin: PIN_KINDS[i % PIN_KINDS.length],
        stain: STAIN_KINDS[i % STAIN_KINDS.length],
        note: MARGIN_NOTES[i % MARGIN_NOTES.length],
        tilt: ((i % 2 === 0 ? 1 : -1) * (2.4 + (i * 1.7) % 2.6)),
      })),
    [entries.length],
  );

  return (
    <div className="cb-wall-v2">
      <MetaStrip>{t('meta_wall')}</MetaStrip>

      <header className="cb-wall-v2__hero">
        <span className="cb-crash__rule cb-crash__rule--h" aria-hidden />
        <h1 className="cb-crash cb-crash--wall">
          <span className="cb-crash__word">{crash.line1}</span>
          <span className="cb-crash__word cb-crash__word--script">{crash.line2}</span>
        </h1>
      </header>

      {!loaded ? (
        <div className="cb-wall-v2__empty">…</div>
      ) : entries.length === 0 ? (
        <div className="cb-wall-v2__empty">
          <p>{t('wall_empty')}</p>
        </div>
      ) : (
        <ol className="cb-wall-v2__board">
          {entries.map((c, i) => {
            const open = openId === c.id;
            const d = decor[i];
            return (
              <li
                key={c.id}
                className={`cb-wall-v2__item cb-wall-v2__item--${d.pin} ${open ? 'cb-wall-v2__item--open' : ''}`}
                style={{ transform: `rotate(${d.tilt}deg)` }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  setOpenId(open ? null : c.id);
                }}
              >
                {/* Pin decoration goes ABOVE the card (top center) for pushpin,
                    top-left/right for staple, full-width for tape, corner for punch */}
                <span className={`cb-wall-v2__attach cb-wall-v2__attach--${d.pin}`}>
                  <CardPin kind={d.pin} rotate={d.pin === 'staple' ? (i % 2 ? -8 : 6) : 0} />
                </span>

                <Receipt small>
                  <div className="cb-wall-v2__row">
                    <div className="cb-wall-v2__body">
                      <p className="cb-wall-v2__sin">&ldquo;{c.sin}&rdquo;</p>
                      <p className="cb-wall-v2__quip">— {c.quip}</p>
                      <p className="cb-wall-v2__anon">{t('wall_anon')} · {c.ticketNumber}</p>
                    </div>
                    <div className="cb-wall-v2__stamp">
                      <Stamp verdict={c.verdict} size={62} />
                    </div>
                  </div>

                  {/* per-card stain treatment */}
                  {d.stain === 'coffee' && (
                    <span className="cb-wall-v2__stain cb-wall-v2__stain--coffee">
                      <CardStain kind="coffee" />
                    </span>
                  )}
                  {d.stain === 'ink' && (
                    <span className="cb-wall-v2__stain cb-wall-v2__stain--ink">
                      <CardStain kind="ink" />
                    </span>
                  )}
                  {d.stain === 'fold' && (
                    <span className="cb-wall-v2__stain cb-wall-v2__stain--fold">
                      <CardStain kind="fold" />
                    </span>
                  )}
                  {d.stain === 'margin' && (
                    <span className="cb-wall-v2__stain cb-wall-v2__stain--margin">
                      <CardStain kind="margin" note={d.note} />
                    </span>
                  )}

                  {open && (
                    <div className="cb-wall-v2__expand">
                      <hr className="cb-abs__rule" />
                      {c.operatorReply.split('\n').map((line, j) => (
                        <p key={j} className="cb-abs__reply-line cb-wall-v2__expand-line">{line}</p>
                      ))}
                      <p className="cb-wall-v2__expand-penance">
                        <span className="cb-abs__section-label cb-abs__section-label--inline">{t('abs_penance')}</span>{' '}
                        {c.penance}
                      </p>
                    </div>
                  )}
                </Receipt>
              </li>
            );
          })}
        </ol>
      )}

      <div className="cb-wall-v2__dock">
        <Chip variant="secondary" onClick={onBack}>
          {t('wall_back')}
        </Chip>
        <Chip variant="primary" onClick={onConfess} fullWidth>
          {t('wall_pray')} →
        </Chip>
      </div>
    </div>
  );
}
