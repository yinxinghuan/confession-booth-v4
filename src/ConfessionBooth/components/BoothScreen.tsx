import StainedGlass from './StainedGlass';
import BrassGrille from './BrassGrille';
import DeskLeak from './DeskLeak';
import NeonSign from './NeonSign';
import Fluorescent from './Fluorescent';
import Chip from './Chip';
import MetaStrip from './MetaStrip';
import { t, getLocale } from '../i18n';

interface Props {
  weekCount: number;
  onEnter: () => void;
  onWall: () => void;
}

// Localized crash-type variants for the hero word + tagline. Kept inline
// rather than in i18n so the visual treatment per language is self-contained.
const CRASH: Record<string, { word: string; tag: string }> = {
  en: { word: 'CONFESS', tag: 'OR JUST KEEP IT IN' },
  zh: { word: '忏悔', tag: '不然就憋着' },
  es: { word: 'CONFIESA', tag: 'O TRÁGATELO' },
  pt: { word: 'CONFESSE', tag: 'OU ENGOLE' },
  ru: { word: 'ИСПОВЕДЬ', tag: 'ИЛИ МОЛЧИ' },
  ja: { word: '告解', tag: 'またはのみ込め' },
  ko: { word: '고백', tag: '아니면 삼켜' },
  fr: { word: 'CONFESSE', tag: 'OU AVALE' },
};

export default function BoothScreen({ weekCount, onEnter, onWall }: Props) {
  const loc = getLocale();
  const crash = CRASH[loc] ?? CRASH.en;
  return (
    <div className="cb-booth-v2">
      <MetaStrip>{t('meta_line')}</MetaStrip>

      <div className="cb-chamber">
        {/* Top strip: small stained-glass transom + fluorescent tube hum
            (replaced the second candle to dial down the church feel) */}
        <div className="cb-chamber__transom">
          <div className="cb-chamber__transom-glass">
            <StainedGlass width={156} height={92} variant="top-strip" />
          </div>
          <div className="cb-chamber__transom-fluo">
            <Fluorescent width={160} height={14} />
          </div>
          {/* Diagonal light shaft */}
          <span className="cb-chamber__shaft" aria-hidden />
        </div>

        {/* Crash blackletter hero */}
        <h1 className="cb-crash">
          <span className="cb-crash__word">{crash.word}</span>
          <span className="cb-crash__rule" aria-hidden />
          <span className="cb-crash__tag">{crash.tag}</span>
        </h1>

        {/* The grille well — operator's desk leaks through */}
        <div className="cb-chamber__grille-well">
          <DeskLeak className="cb-chamber__leak" noteSeed={2} />
          <NeonSign className="cb-chamber__neon" />
          <BrassGrille width="100%" height="100%" density={0.96} cell={26} />
          {/* Player-side Post-It pinned ON the grille */}
          <span className="cb-chamber__postit cb-chamber__postit--front" aria-hidden>
            BACK
            <br />
            IN 5
          </span>
        </div>

        {/* Dock — call-center keypad buttons */}
        <div className="cb-chamber__floor">
          <div className="cb-booth-v2__actions">
            <Chip variant="primary" onClick={onEnter} fullWidth>
              {t('booth_enter')} →
            </Chip>
            <div className="cb-booth-v2__action-row">
              <Chip variant="secondary" onClick={onWall}>
                {t('booth_wall')}
              </Chip>
              <span className="cb-booth-v2__count">
                <span className="cb-booth-v2__count-num">{weekCount.toLocaleString()}</span>
                <span className="cb-booth-v2__count-tag">/wk</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
