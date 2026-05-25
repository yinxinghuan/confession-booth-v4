import NumberDot from './NumberDot';
import Wordmark from './Wordmark';
import TopNav from './TopNav';
import AvatarChip from './AvatarChip';
import Zigzag from './patterns/Zigzag';
import Confetti from './Confetti';
import { t, getLocale } from '../i18n';
import { playPing, playTap } from '../utils/audio';
import { currentTheme, currentWeekIndex } from './themes';
import { useCurrentUser } from './useCurrentUser';

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

const TAP_TO_BEGIN: Record<string, string> = {
  en: 'TAP TO BEGIN',
  zh: '点击开始',
  es: 'TOCA PARA EMPEZAR',
  pt: 'TOQUE PARA INICIAR',
  ru: 'НАЖМИ ДЛЯ СТАРТА',
  ja: 'タップ',
  ko: '눌러서 시작',
  fr: 'APPUYE',
};

const WALL_LABEL: Record<string, string> = {
  en: 'WALL', zh: '墙', es: 'MURO', pt: 'MURO',
  ru: 'СТЕНА', ja: '壁', ko: '벽', fr: 'MUR',
};

const THIS_WEEK: Record<string, string> = {
  en: 'THIS WEEK · WEEK', zh: '本周题 · 第', es: 'ESTA SEMANA · SEMANA',
  pt: 'ESTA SEMANA · SEM', ru: 'ЭТА НЕДЕЛЯ', ja: '今週のテーマ · 第',
  ko: '이번 주 · 주차', fr: 'CETTE SEMAINE · SEM',
};

export default function BoothScreenV4({ weekCount, onEnter, onWall }: Props) {
  const loc = getLocale();
  const word = WORDMARK[loc] ?? WORDMARK.en;
  const sub = TAP_TO_BEGIN[loc] ?? TAP_TO_BEGIN.en;
  const wallLabel = WALL_LABEL[loc] ?? WALL_LABEL.en;
  const isCJK = ['zh', 'ja', 'ko'].includes(loc);
  const wordSize = isCJK ? 62 : 78;

  const theme = currentTheme();
  const themeLabel = theme.label[loc] ?? theme.label.en;
  const weekIdx = currentWeekIndex();

  const { profile } = useCurrentUser();

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
        left={{ kind: 'meta', text: 'ALTERU · FESTIVAL EDITION' }}
        right={{ label: wallLabel, onClick: () => { playTap(); onWall(); } }}
      />

      {/* Centered plate + theme banner stack */}
      <div className="cb4-booth__center">
        <button
          type="button"
          className="cb4-booth__plate-btn"
          onPointerDown={(e) => { e.preventDefault(); playPing(); onEnter(); }}
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

        {/* Weekly theme banner — defines the prompt for this week */}
        <div className="cb4-booth__theme">
          <div className="cb4-booth__theme-head">
            <span className="cb4-booth__theme-week">{THIS_WEEK[loc] ?? THIS_WEEK.en} {weekIdx + 1}</span>
          </div>
          <div className="cb4-booth__theme-label">{themeLabel}</div>
        </div>
      </div>

      {/* User identity badge at bottom — you ARE performing here */}
      {profile && (
        <div className="cb4-booth__you">
          <AvatarChip user={profile} size="md" />
          <span className="cb4-booth__you-label">
            {profile.userId === 'guest' ? 'AS A GUEST' : 'PERFORMING AS'}
          </span>
        </div>
      )}

      <div className="cb4-booth__count">
        <NumberDot value={weekCount.toLocaleString()} color="orange" size="sm" />
        <span className="cb4-booth__count-label">
          {t('booth_count', { n: '' }).replace(/\{?\s*n?\s*\}?/, '').trim().toUpperCase()}
        </span>
      </div>
    </div>
  );
}
