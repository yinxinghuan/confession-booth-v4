import Pill from './Pill';
import NumberDot from './NumberDot';
import Wordmark from './Wordmark';
import ArrowChip from './ArrowChip';
import Zigzag from './patterns/Zigzag';
import RainbowArc from './patterns/RainbowArc';
import Confetti from './Confetti';
import { t, getLocale } from '../i18n';

interface Props {
  weekCount: number;
  onEnter: () => void;
  onWall: () => void;
}

const WORDMARK: Record<string, string> = {
  en: 'CONFESS',
  zh: '忏悔',
  es: 'CONFIESA',
  pt: 'CONFESSE',
  ru: 'ИСПОВЕДЬ',
  ja: '告解',
  ko: '고백',
  fr: 'CONFESSE',
};

const SUB: Record<string, string> = {
  en: 'A 24/7 HOTLINE',
  zh: '24 小时热线',
  es: 'LÍNEA 24/7',
  pt: 'LINHA 24/7',
  ru: 'ЛИНИЯ 24/7',
  ja: '24時間ホットライン',
  ko: '24시간 상담',
  fr: 'LIGNE 24/7',
};

// Multi-row slogan layout — 4 rows of pills, with an arrow chip leading the
// 3rd row, mirroring the Wolność "→ TWORZONYCH / PRZEZ" reading flow.
interface SloganRow {
  arrow?: 'right' | 'left';
  chips: { text: string; variant: 'pink' | 'cream' | 'teal' | 'coral' | 'lavender' | 'yellow' }[];
}

const SLOGAN_ROWS: Record<string, SloganRow[]> = {
  en: [
    { chips: [{ text: 'WHISPER', variant: 'teal' }, { text: 'YOUR', variant: 'cream' }] },
    { chips: [{ text: 'SIN', variant: 'pink' }, { text: 'INTO', variant: 'cream' }, { text: 'A', variant: 'yellow' }] },
    { arrow: 'right', chips: [{ text: 'BORED', variant: 'cream' }, { text: 'OPERATOR', variant: 'lavender' }] },
    { chips: [{ text: 'BE', variant: 'cream' }, { text: '(MOSTLY)', variant: 'coral' }, { text: 'ABSOLVED', variant: 'pink' }] },
  ],
  zh: [
    { chips: [{ text: '把你', variant: 'teal' }, { text: '的', variant: 'cream' }] },
    { chips: [{ text: '罪', variant: 'pink' }, { text: '说给', variant: 'cream' }] },
    { arrow: 'right', chips: [{ text: '深夜', variant: 'cream' }, { text: '接线员', variant: 'lavender' }] },
    { chips: [{ text: '被', variant: 'cream' }, { text: '(基本上)', variant: 'coral' }, { text: '赦免', variant: 'pink' }] },
  ],
  es: [
    { chips: [{ text: 'SUSURRA', variant: 'teal' }, { text: 'TU', variant: 'cream' }] },
    { chips: [{ text: 'PECADO', variant: 'pink' }, { text: 'A UN', variant: 'cream' }] },
    { arrow: 'right', chips: [{ text: 'OPERADOR', variant: 'cream' }, { text: 'CANSADO', variant: 'lavender' }] },
    { chips: [{ text: 'SÉ', variant: 'cream' }, { text: '(CASI)', variant: 'coral' }, { text: 'ABSUELTO', variant: 'pink' }] },
  ],
  pt: [
    { chips: [{ text: 'SUSSURRE', variant: 'teal' }, { text: 'SEU', variant: 'cream' }] },
    { chips: [{ text: 'PECADO', variant: 'pink' }, { text: 'A UM', variant: 'cream' }] },
    { arrow: 'right', chips: [{ text: 'OPERADOR', variant: 'cream' }, { text: 'CANSADO', variant: 'lavender' }] },
    { chips: [{ text: 'SEJA', variant: 'cream' }, { text: '(QUASE)', variant: 'coral' }, { text: 'ABSOLVIDO', variant: 'pink' }] },
  ],
  ru: [
    { chips: [{ text: 'ШЕПНИ', variant: 'teal' }, { text: 'СВОЙ', variant: 'cream' }] },
    { chips: [{ text: 'ГРЕХ', variant: 'pink' }] },
    { arrow: 'right', chips: [{ text: 'УСТАЛОМУ', variant: 'cream' }, { text: 'ОПЕРАТОРУ', variant: 'lavender' }] },
    { chips: [{ text: 'БУДЬ', variant: 'cream' }, { text: '(ПОЧТИ)', variant: 'coral' }, { text: 'ПРОЩЁН', variant: 'pink' }] },
  ],
  ja: [
    { chips: [{ text: 'あなたの', variant: 'teal' }] },
    { chips: [{ text: '罪を', variant: 'pink' }, { text: 'ささやけ', variant: 'cream' }] },
    { arrow: 'right', chips: [{ text: '疲れた', variant: 'cream' }, { text: 'オペレーターへ', variant: 'lavender' }] },
    { chips: [{ text: '(ほぼ)', variant: 'coral' }, { text: '赦される', variant: 'pink' }] },
  ],
  ko: [
    { chips: [{ text: '당신의', variant: 'teal' }] },
    { chips: [{ text: '죄를', variant: 'pink' }, { text: '속삭여', variant: 'cream' }] },
    { arrow: 'right', chips: [{ text: '지친', variant: 'cream' }, { text: '상담원에게', variant: 'lavender' }] },
    { chips: [{ text: '(거의)', variant: 'coral' }, { text: '사함받는다', variant: 'pink' }] },
  ],
  fr: [
    { chips: [{ text: 'CHUCHOTE', variant: 'teal' }, { text: 'TON', variant: 'cream' }] },
    { chips: [{ text: 'PÉCHÉ', variant: 'pink' }, { text: 'À UN', variant: 'cream' }] },
    { arrow: 'right', chips: [{ text: 'OPÉRATEUR', variant: 'cream' }, { text: 'FATIGUÉ', variant: 'lavender' }] },
    { chips: [{ text: 'SOIS', variant: 'cream' }, { text: '(PRESQUE)', variant: 'coral' }, { text: 'ABSOUS', variant: 'pink' }] },
  ],
};

export default function BoothScreenV4({ weekCount, onEnter, onWall }: Props) {
  const loc = getLocale();
  const word = WORDMARK[loc] ?? WORDMARK.en;
  const sub = SUB[loc] ?? SUB.en;
  const slogan = SLOGAN_ROWS[loc] ?? SLOGAN_ROWS.en;
  // CJK locales use a smaller wordmark size (Bagel Fat One falls back to system
  // Asian font, and at huge sizes the bounding box gets messy)
  const isCJK = ['zh', 'ja', 'ko'].includes(loc);
  const wordSize = isCJK ? 44 : 56;

  return (
    <div className="cb4-booth">
      {/* Top meta */}
      <header className="cb4-booth__head">
        <span className="cb4-booth__head-dot" />
        <span className="cb4-booth__head-text">ALTERU · 1-800-CONFESS</span>
      </header>

      {/* Hero band — dense zigzag + curvy wordmark */}
      <section className="cb4-booth__hero">
        <Zigzag color="#a888ff" accent="#ff4d8e" bg="#0a0a0a" cols={14} className="cb4-booth__hero-pattern" />
        <Confetti width={400} height={420} count={14} colors={['#ff9a3c', '#fce8c8', '#3ed9b9', '#ffd24a']} rRange={[2.5, 6]} seed={11} className="cb4-booth__confetti" />

        <div className="cb4-booth__hero-stack">
          <Wordmark word={word} sub={sub} variant="teal" subVariant="pink" size={wordSize} />
          <NumberDot value="7" color="orange" size="lg" className="cb4-booth__edition" />
        </div>
      </section>

      {/* Rainbow U-arc band wrapping the slogan stack — Wolność key element */}
      <section className="cb4-booth__arc-section">
        <RainbowArc className="cb4-booth__arc" colors={['#ff4d8e', '#ff7a4a', '#ffd24a', '#3ed9b9', '#a888ff']} bg="#0a0a0a" />
        <div className="cb4-booth__arc-content">
          {slogan.map((row, ri) => (
            <div key={ri} className="cb4-booth__slogan-row">
              {row.arrow === 'right' && <ArrowChip direction="right" variant="orange" />}
              {row.chips.map((chip, ci) => (
                <Pill key={ci} variant={chip.variant} size="sm">
                  {chip.text}
                </Pill>
              ))}
              {row.arrow === 'left' && <ArrowChip direction="left" variant="orange" />}
            </div>
          ))}
        </div>
      </section>

      {/* Count chip + CTA stack */}
      <section className="cb4-booth__foot">
        <div className="cb4-booth__count">
          <NumberDot value={weekCount.toLocaleString()} color="orange" size="md" />
          <span className="cb4-booth__count-label">
            {t('booth_count', { n: '' }).replace(/\{?\s*n?\s*\}?/, '').trim().toUpperCase()}
          </span>
        </div>

        <button type="button" className="cb4-cta-primary" onPointerDown={(e) => { e.preventDefault(); onEnter(); }}>
          <span className="cb4-cta-primary__arrow">→</span>
          <span className="cb4-cta-primary__label">{t('booth_enter')}</span>
        </button>

        <Pill variant="outline-cream" size="lg" onClick={onWall} fullWidth>
          {t('booth_wall')}
        </Pill>
      </section>
    </div>
  );
}
