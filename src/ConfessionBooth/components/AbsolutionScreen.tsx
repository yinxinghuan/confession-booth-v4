import { useEffect } from 'react';
import Stamp from './Stamp';
import Chip from './Chip';
import Receipt from './Receipt';
import MetaStrip from './MetaStrip';
import CardStain from './CardStain';
import CardPin from './CardPin';
import { t, getLocale } from '../i18n';
import { playStampThud } from '../utils/audio';
import type { Confession, Verdict } from '../types';

interface Props {
  confession: Confession;
  onAnother: () => void;
  onWall: () => void;
  /** when true, plays the stamp slam-down (used on first reveal, not on re-mount). */
  slam?: boolean;
}

// Localized verdict crash type — the headline word at the top of the receipt
const VERDICT_CRASH: Record<Verdict, Record<string, string>> = {
  ABSOLVED: {
    en: 'ABSOLVED', zh: '已赦免', es: 'ABSUELTO', pt: 'ABSOLVIDO', ru: 'ПРОЩЁН',
    ja: '赦免', ko: '사함받음', fr: 'ABSOUS',
  },
  DENIED: {
    en: 'DENIED', zh: '驳回', es: 'NEGADO', pt: 'NEGADO', ru: 'ОТКЛОНЕНО',
    ja: '却下', ko: '거부', fr: 'REFUSÉ',
  },
  DEFERRED: {
    en: 'DEFERRED', zh: '延审', es: 'APLAZADO', pt: 'ADIADO', ru: 'ОТЛОЖЕНО',
    ja: '保留', ko: '보류', fr: 'REPORTÉ',
  },
};

export default function AbsolutionScreen({ confession, onAnother, onWall, slam }: Props) {
  useEffect(() => {
    if (slam) {
      const id = setTimeout(() => playStampThud(), 240);
      return () => clearTimeout(id);
    }
  }, [slam]);

  const loc = getLocale();
  const verdictWord = VERDICT_CRASH[confession.verdict][loc] ?? VERDICT_CRASH[confession.verdict].en;

  return (
    <div className="cb-abs-v2" data-verdict={confession.verdict}>
      <MetaStrip>
        <span>{t('meta_receipt')}</span>
        <span className="cb-abs-v2__ticket">{confession.ticketNumber}</span>
      </MetaStrip>

      {/* The verdict moment — the headline payoff */}
      <div className="cb-abs-v2__verdict">
        <span className="cb-abs-v2__verdict-stamp">
          <Stamp verdict={confession.verdict} size={132} slam={slam} />
        </span>
        <h1 className="cb-crash cb-crash--verdict">
          <span className="cb-crash__word">{verdictWord}</span>
        </h1>
        <div className="cb-abs-v2__verdict-meta">
          <span className="cb-abs-v2__meta-key">{t('abs_ticket')}</span>
          <span className="cb-abs-v2__meta-val">{confession.ticketNumber}</span>
          <span className="cb-abs-v2__meta-sep" aria-hidden />
          <span className="cb-abs-v2__meta-key">{t('abs_duration')}</span>
          <span className="cb-abs-v2__meta-val">{confession.callDuration}</span>
        </div>
      </div>

      {/* The receipt — paper with the call transcript filed by the operator */}
      <div className="cb-abs-v2__receipt-wrap">
        {/* Pushpin attaches it to the bulletin board */}
        <span className="cb-abs-v2__pin" aria-hidden>
          <CardPin kind="pushpin" />
        </span>
        {/* Coffee ring (operator left her mug on the page) */}
        <span className="cb-abs-v2__coffee" aria-hidden>
          <CardStain kind="coffee" />
        </span>

        <Receipt tilt={-0.4}>
          <section className="cb-abs-v2__sin">
            <p className="cb-abs-v2__section-label">{t('abs_your')}</p>
            <p className="cb-abs-v2__sin-text">&ldquo;{confession.sin}&rdquo;</p>
          </section>

          <hr className="cb-abs__rule" />

          <section className="cb-abs-v2__reply">
            <p className="cb-abs-v2__section-label">{t('abs_reply')}</p>
            {confession.operatorReply.split('\n').map((line, i) => (
              <p
                key={i}
                className="cb-abs__reply-line"
                style={{ animationDelay: `${i * 0.18 + 0.4}s` }}
              >
                {line}
              </p>
            ))}
            {/* Operator's hand-scribbled signature at end of reply */}
            <p className="cb-abs-v2__sig">— JL · OP #7</p>
          </section>

          <section className="cb-abs-v2__penance">
            <p className="cb-abs-v2__section-label cb-abs-v2__section-label--inline">{t('abs_penance')}</p>
            <p className="cb-abs-v2__penance-text">{confession.penance}</p>
          </section>

          {/* "FILED" stamp small at bottom-right corner */}
          <span className="cb-abs-v2__filed" aria-hidden>
            FILED
          </span>
        </Receipt>
      </div>

      <div className="cb-abs-v2__dock">
        <Chip variant="secondary" onClick={onWall}>
          {t('abs_wall')}
        </Chip>
        <Chip variant="primary" onClick={onAnother} fullWidth>
          {t('abs_another')} →
        </Chip>
      </div>
    </div>
  );
}
