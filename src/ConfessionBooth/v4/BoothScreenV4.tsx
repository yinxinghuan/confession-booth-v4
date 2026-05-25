import NumberDot from './NumberDot';
import Wordmark from './Wordmark';
import TopNav from './TopNav';
import Zigzag from './patterns/Zigzag';
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
  en: 'TAP TO BEGIN',
  zh: '点击开始',
  es: 'TOCA PARA EMPEZAR',
  pt: 'TOQUE PARA INICIAR',
  ru: 'НАЖМИ ДЛЯ СТАРТА',
  ja: 'タップ',
  ko: '눌러서 시작',
  fr: 'APPUYE POUR COMMENCER',
};

const WALL_LABEL: Record<string, string> = {
  en: 'WALL',
  zh: '墙',
  es: 'MURO',
  pt: 'MURO',
  ru: 'СТЕНА',
  ja: '壁',
  ko: '벽',
  fr: 'MUR',
};

// Booth = Wolność Panel 1 layout. The whole screen IS one poster:
//   - Single full-bleed zigzag pattern
//   - Curvy CONFESS wordmark plate centered
//   - Edition NumberDot overlapping plate
//
// Functionality is folded INTO this composition, not stacked beside it:
//   - The plate ITSELF is the primary CTA (tap to enter booth)
//   - Wall navigation is a tiny corner chip — doesn't compete with the
//     poster
//   - Week count lives inside the edition dot context (small dot tucked
//     under the main one)
export default function BoothScreenV4({ weekCount, onEnter, onWall }: Props) {
  const loc = getLocale();
  const word = WORDMARK[loc] ?? WORDMARK.en;
  const sub = SUB[loc] ?? SUB.en;
  const wallLabel = WALL_LABEL[loc] ?? WALL_LABEL.en;
  const isCJK = ['zh', 'ja', 'ko'].includes(loc);
  const wordSize = isCJK ? 62 : 78;

  return (
    <div className="cb4-booth">
      <Zigzag color="#a888ff" accent="#a888ff" bg="#0a0a0a" cols={14} className="cb4-booth__pattern" />
      <Confetti
        width={400}
        height={840}
        count={16}
        colors={['#ff9a3c', '#fce8c8']}
        rRange={[3, 6]}
        seed={11}
        className="cb4-booth__confetti"
      />

      <TopNav
        left={{ kind: 'meta', text: 'ALTERU · 1-800-CONFESS' }}
        right={{ label: wallLabel, onClick: onWall }}
      />

      {/* The plate IS the ENTER button — tap to enter. Edition dot lives
          INSIDE the plate-btn so it positions relative to the plate not
          the full-screen center wrapper. */}
      <div className="cb4-booth__center">
        <button
          type="button"
          className="cb4-booth__plate-btn"
          onPointerDown={(e) => { e.preventDefault(); onEnter(); }}
        >
          <Wordmark
            word={word}
            sub={sub}
            variant="teal"
            subVariant="pink"
            size={wordSize}
            tilt={-3}
            sparkle={false}
          />
          <NumberDot value="7" color="orange" size="lg" className="cb4-booth__edition" />
        </button>
      </div>

      {/* Week count — small medal at the bottom edge, balances the comp */}
      <div className="cb4-booth__count">
        <NumberDot value={weekCount.toLocaleString()} color="orange" size="sm" />
        <span className="cb4-booth__count-label">
          {t('booth_count', { n: '' }).replace(/\{?\s*n?\s*\}?/, '').trim().toUpperCase()}
        </span>
      </div>
    </div>
  );
}
