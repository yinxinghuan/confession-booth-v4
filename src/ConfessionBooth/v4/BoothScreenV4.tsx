import Pill from './Pill';
import NumberDot from './NumberDot';
import Zigzag from './patterns/Zigzag';
import HexTile from './patterns/HexTile';
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

// Subtitle in each locale — "festiwal teatralny" energy. Below the wordmark.
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

// Slogan broken into 4 short chips (alternating color stacks like the
// Wolność "OGÓLNOPOLSKI / FESTIWAL / NAJLEPSZYCH / SPEKTAKLI" block)
const SLOGAN_CHIPS: Record<string, string[]> = {
  en: ['CONFESS', '·', 'BE', '(MOSTLY)', 'ABSOLVED'],
  zh: ['忏悔', '·', '被', '(基本上)', '赦免'],
  es: ['CONFIESA', '·', 'SÉ', '(CASI)', 'ABSUELTO'],
  pt: ['CONFESSE', '·', 'SEJA', '(QUASE)', 'ABSOLVIDO'],
  ru: ['ИСПОВЕДУЙСЯ', '·', '(ПОЧТИ)', 'ПРОЩЁН'],
  ja: ['告解', '·', '(ほぼ)', '赦される'],
  ko: ['고백하라', '·', '(거의)', '사함받는다'],
  fr: ['CONFESSE', '·', 'SOIS', '(PRESQUE)', 'ABSOUS'],
};

export default function BoothScreenV4({ weekCount, onEnter, onWall }: Props) {
  const loc = getLocale();
  const word = WORDMARK[loc] ?? WORDMARK.en;
  const sub = SUB[loc] ?? SUB.en;
  const sloganChips = SLOGAN_CHIPS[loc] ?? SLOGAN_CHIPS.en;

  return (
    <div className="cb4-booth">
      {/* Top meta line */}
      <header className="cb4-booth__head">
        <span className="cb4-booth__head-line">
          <span className="cb4-booth__head-dot" />
          ALTERU · 1-800-CONFESS
        </span>
      </header>

      {/* Hero band — patterned backdrop with the wordmark plate centered */}
      <section className="cb4-booth__hero">
        <Zigzag color="#a888ff" accent="#ff4d8e" bg="#0a0a0a" cols={9} withUp className="cb4-booth__hero-pattern" />
        <Confetti
          width={400}
          height={400}
          count={10}
          colors={['#ff9a3c', '#fce8c8', '#3ed9b9', '#ff4d8e']}
          rRange={[2.5, 6]}
          seed={11}
          className="cb4-booth__confetti"
        />

        <div className="cb4-booth__hero-content">
          <div className="cb4-booth__plate">
            {/* Decorative sparkle top-left of plate */}
            <span className="cb4-booth__plate-spark cb4-booth__plate-spark--tl">✦</span>
            <span className="cb4-booth__plate-spark cb4-booth__plate-spark--br">✦</span>

            <span className="cb4-booth__wordmark">{word}</span>

            {/* Sub-pill ("festiwal teatralny" style) */}
            <span className="cb4-booth__sub">{sub}</span>
          </div>

          {/* Edition dot floats over the top-right corner of the plate */}
          <NumberDot value="7" color="orange" size="lg" className="cb4-booth__edition" />
        </div>
      </section>

      {/* Hex tile divider band */}
      <div className="cb4-booth__hex">
        <HexTile color="#ffd24a" altColor="#ff7a4a" bg="#0a0a0a" r={14} className="cb4-booth__hex-tile" />
        {/* week-count chip overlays the hex band */}
        <div className="cb4-booth__count">
          <NumberDot value={weekCount.toLocaleString()} color="orange" size="md" />
          <span className="cb4-booth__count-label">{t('booth_count', { n: '' }).replace(/\{?\s*n?\s*\}?/, '').trim().toUpperCase()}</span>
        </div>
      </div>

      {/* Slogan chip stack — alternating pink + cream + teal pills */}
      <section className="cb4-booth__slogan">
        {sloganChips.map((chip, i) => {
          const variant = i % 4 === 0 ? 'pink' : i % 4 === 1 ? 'cream' : i % 4 === 2 ? 'teal' : 'cream';
          return (
            <Pill key={i} variant={variant as any} size="sm" className="cb4-booth__slogan-chip">
              {chip}
            </Pill>
          );
        })}
      </section>

      {/* CTA — primary with nested arrow chip + secondary outlined */}
      <section className="cb4-booth__cta">
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
