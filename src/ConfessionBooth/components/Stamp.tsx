// Wax-seal verdict stamps. Three variants — ABSOLVED (cream-on-ruby),
// DENIED (ruby-on-ink), DEFERRED (lavender). Slammed diagonally onto
// the absolution receipt + smaller versions on wall cards.

import type { Verdict } from '../types';

interface Props {
  verdict: Verdict;
  size?: number;
  className?: string;
  /** when true, plays the slam-down animation on mount */
  slam?: boolean;
}

const COLORS: Record<Verdict, { bg: string; ink: string; ring: string }> = {
  ABSOLVED: { bg: '#8a1a1a', ink: '#fbe5b5', ring: '#fbe5b5' },
  DENIED: { bg: '#0a0703', ink: '#c64873', ring: '#c64873' },
  DEFERRED: { bg: '#3b2b6b', ink: '#e8d4ff', ring: '#e8d4ff' },
};

export default function Stamp({ verdict, size = 150, className, slam }: Props) {
  const c = COLORS[verdict];
  return (
    <svg
      className={`${className ?? ''} ${slam ? 'cb-stamp--slam' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 150 150"
      filter="url(#cb-ink-wobble)"
      aria-hidden
    >
      {/* Wax pool — soft splatter beneath the disc */}
      <g opacity="0.7">
        <ellipse cx="78" cy="78" rx="68" ry="64" fill={c.bg} />
        <circle cx="22" cy="82" r="4" fill={c.bg} />
        <circle cx="130" cy="62" r="3" fill={c.bg} />
        <circle cx="116" cy="120" r="3" fill={c.bg} />
        <circle cx="34" cy="36" r="2.5" fill={c.bg} />
      </g>
      {/* Disc */}
      <circle cx="75" cy="75" r="60" fill={c.bg} />
      {/* Inner ring */}
      <circle cx="75" cy="75" r="51" fill="none" stroke={c.ring} strokeWidth="1.6" />
      <circle cx="75" cy="75" r="47" fill="none" stroke={c.ring} strokeWidth="0.8" opacity="0.6" />
      {/* Cross marks at compass points */}
      {[0, 90, 180, 270].map((a) => (
        <g key={a} transform={`rotate(${a} 75 75)`}>
          <line x1="75" y1="20" x2="75" y2="28" stroke={c.ring} strokeWidth="1.6" />
        </g>
      ))}
      {/* Verdict text */}
      <text
        x="75"
        y="72"
        textAnchor="middle"
        fill={c.ink}
        fontFamily="'UnifrakturCook', 'Cormorant Garamond', serif"
        fontWeight="700"
        fontSize={verdict === 'ABSOLVED' ? 20 : verdict === 'DENIED' ? 24 : 19}
        letterSpacing="0.04em"
      >
        {verdict}
      </text>
      {/* Curved label below */}
      <text
        x="75"
        y="98"
        textAnchor="middle"
        fill={c.ink}
        fontFamily="'IBM Plex Mono', monospace"
        fontSize="8"
        letterSpacing="0.2em"
        opacity="0.85"
      >
        ALTERU · CONFESSIONAL
      </text>
      {/* Decorative star */}
      <g transform="translate(75 110)" fill={c.ink} opacity="0.8">
        <polygon points="0,-5 1.4,-1.4 5,0 1.4,1.4 0,5 -1.4,1.4 -5,0 -1.4,-1.4" />
      </g>
    </svg>
  );
}
