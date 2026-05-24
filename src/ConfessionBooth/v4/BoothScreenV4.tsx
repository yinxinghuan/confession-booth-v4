import Pill from './Pill';
import NumberDot from './NumberDot';
import Zigzag from './patterns/Zigzag';
import HexTile from './patterns/HexTile';
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

const SUB_TAG: Record<string, string> = {
  en: 'A 24/7 HOTLINE',
  zh: '24 小时热线',
  es: 'LÍNEA 24/7',
  pt: 'LINHA 24/7',
  ru: 'ЛИНИЯ 24/7',
  ja: '24時間ホットライン',
  ko: '24시간 상담 전화',
  fr: 'LIGNE 24/7',
};

export default function BoothScreenV4({ weekCount, onEnter, onWall }: Props) {
  const loc = getLocale();
  const word = WORDMARK[loc] ?? WORDMARK.en;
  const subtag = SUB_TAG[loc] ?? SUB_TAG.en;

  return (
    <div className="cb4-booth">
      {/* Header strip: small meta line */}
      <header className="cb4-booth__head">
        <span className="cb4-booth__head-line">
          <span className="cb4-booth__head-dot" />
          ALTERU · 1-800-CONFESS · {subtag}
        </span>
      </header>

      {/* The hero band — zigzag pattern + wordmark plate + edition number */}
      <section className="cb4-booth__hero">
        <Zigzag color="#a888ff" bg="#0a0a0a" cols={8} variant="up" className="cb4-booth__hero-pattern" />
        <div className="cb4-booth__hero-content">
          <div className="cb4-booth__wordmark">
            <span className="cb4-booth__wordmark-text">{word}</span>
            <span className="cb4-booth__wordmark-tag">BOOTH</span>
          </div>
          <NumberDot value="7" color="orange" size="lg" className="cb4-booth__edition" />
        </div>
      </section>

      {/* Pill chip stack — info / metadata */}
      <section className="cb4-booth__chips">
        <Pill variant="pink" size="md">{t('booth_sub')}</Pill>
        <Pill variant="cream" size="md">
          <NumberDot value={weekCount.toLocaleString()} color="orange" size="sm" />
          {' '}
          {t('booth_count', { n: '' }).replace(/\{?\s*n?\s*\}?/, '').trim()}
        </Pill>
      </section>

      {/* Pattern divider */}
      <section className="cb4-booth__divider">
        <HexTile color="#3ed9b9" bg="#0a0a0a" r={16} className="cb4-booth__divider-tile" />
      </section>

      {/* CTAs — pill buttons */}
      <section className="cb4-booth__cta">
        <Pill variant="coral" size="xl" onClick={onEnter} fullWidth>
          → {t('booth_enter')}
        </Pill>
        <Pill variant="outline-cream" size="lg" onClick={onWall} fullWidth>
          {t('booth_wall')}
        </Pill>
      </section>
    </div>
  );
}
