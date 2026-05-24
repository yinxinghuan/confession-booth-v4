import { useEffect, useState } from 'react';
import Pill from './Pill';
import NumberDot from './NumberDot';
import Sunburst from './patterns/Sunburst';
import { t, getLocale } from '../i18n';
import type { ProcessingStage } from '../types';

interface Props {
  stage: ProcessingStage | '';
}

const STAGE_ORDER: ProcessingStage[] = ['ringing', 'hold', 'connected', 'cross-ref', 'stamping'];

// Big crash word per stage per locale (lives inside the big status pill).
const STAGE_WORD: Record<ProcessingStage, Record<string, string>> = {
  ringing:   { en: 'RINGING',   zh: '振铃',   es: 'LLAMANDO', pt: 'CHAMANDO', ru: 'ВЫЗОВ',     ja: '発信',   ko: '연결중', fr: 'SONNERIE' },
  hold:      { en: 'HOLD',      zh: '请稍候', es: 'EN ESPERA', pt: 'AGUARDE',  ru: 'ОЖИДАНИЕ', ja: '保留',   ko: '대기중', fr: 'EN ATTENTE' },
  connected: { en: 'CONNECTED', zh: '已接通', es: 'CONECTADO', pt: 'CONECTADO', ru: 'НА СВЯЗИ', ja: '応答',   ko: '연결됨', fr: 'CONNECTÉ' },
  'cross-ref': { en: 'CROSSREF', zh: '检索',   es: 'COTEJANDO', pt: 'COTEJANDO', ru: 'СВЕРКА',   ja: '照合',   ko: '대조중', fr: 'RECOUPE' },
  stamping:  { en: 'STAMPING',  zh: '盖戳',   es: 'SELLANDO',  pt: 'SELANDO',   ru: 'ШТАМП',    ja: '捺印',   ko: '도장',   fr: 'TAMPON' },
};

const STAGE_COLOR: Record<ProcessingStage, 'pink' | 'coral' | 'teal' | 'lavender' | 'yellow'> = {
  ringing: 'pink',
  hold: 'coral',
  connected: 'teal',
  'cross-ref': 'lavender',
  stamping: 'yellow',
};

// Processing = Wolność Panel 3: multi-color sunburst + a center logo dot +
// one big colored pill. We map it as:
//   - Sunburst = full bg, slowly rotates so the on-hold feel is alive
//   - Center logo dot = a phone-icon dot that shakes during the "ringing"
//     stage
//   - Big pill = the stage word, swaps text + color per stage
//   - Caller-ID strip at the bottom edge as a small black pill (ticket# +
//     line + status code)
export default function ProcessingScreenV4({ stage }: Props) {
  const loc = getLocale();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 4), 600);
    return () => clearInterval(id);
  }, []);
  const dots = '·'.repeat(tick + 1) + ' '.repeat(3 - tick);

  const currentStage = stage || 'ringing';
  const idx = STAGE_ORDER.indexOf(currentStage);
  const word = STAGE_WORD[currentStage][loc] ?? STAGE_WORD[currentStage].en;
  const color = STAGE_COLOR[currentStage];
  const isRinging = currentStage === 'ringing';

  return (
    <div className="cb4-proc">
      <Sunburst
        bg="#0a0a0a"
        colors={['#ff4d8e', '#a888ff', '#ff7a4a', '#ffd24a']}
        rays={20}
        origin={{ x: 0.5, y: 0.4 }}
        className="cb4-proc__pattern"
      />

      <header className="cb4-proc__head">
        <span className="cb4-proc__head-dot" />
        <span className="cb4-proc__head-text">{t('meta_call')}</span>
      </header>

      {/* Center logo dot — a phone icon. Wobbles during "ringing". */}
      <div className={`cb4-proc__logo ${isRinging ? 'cb4-proc__logo--ring' : ''}`}>
        <svg viewBox="0 0 60 60" width="78" height="78" aria-hidden>
          <circle cx="30" cy="30" r="28" fill="#ff9a3c" stroke="#0a0a0a" strokeWidth="3" />
          {/* Handset */}
          <path
            d="M 16 36 Q 16 24 22 22 Q 26 21 28 25 L 30 30 Q 32 33 30 35 L 27 38 Q 31 44 38 47 L 41 44 Q 43 42 46 44 L 50 47 Q 53 50 51 53 Q 49 58 39 56 Q 28 53 21 46 Q 14 39 16 36 Z"
            fill="#0a0a0a"
          />
        </svg>
      </div>

      {/* The big status pill — swaps text + color per stage */}
      <div className="cb4-proc__status-wrap">
        <Pill variant={color} size="xl" className="cb4-proc__status">
          {word}
          <span className="cb4-proc__status-dots">{dots}</span>
        </Pill>
      </div>

      {/* Progress dots — 5 small pills along the bottom of the status area */}
      <div className="cb4-proc__steps">
        {STAGE_ORDER.map((s, i) => (
          <span
            key={s}
            className={`cb4-proc__step ${i < idx ? 'cb4-proc__step--done' : ''} ${i === idx ? 'cb4-proc__step--now' : ''}`}
          />
        ))}
      </div>

      {/* Caller ID at the bottom */}
      <div className="cb4-proc__caller">
        <NumberDot value="4827" color="orange" size="sm" />
        <span className="cb4-proc__caller-sep" />
        <span className="cb4-proc__caller-key">LINE</span>
        <span className="cb4-proc__caller-val">7</span>
        <span className="cb4-proc__caller-sep" />
        <span className="cb4-proc__caller-fineprint">1-800-CONFESS</span>
      </div>
    </div>
  );
}
