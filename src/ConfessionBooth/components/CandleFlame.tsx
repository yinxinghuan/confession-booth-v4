// A small candle with a flickering flame. Used:
//   - centered below stained glass on booth entry
//   - in the corner of the receipt as a flourish

interface Props {
  width?: number;
  height?: number;
  className?: string;
  noStick?: boolean; // just the flame, no wax body
}

export default function CandleFlame({ width = 48, height = 110, className, noStick }: Props) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 48 110" aria-hidden>
      <defs>
        <radialGradient id="cb-flame-grad" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor="#fff7c4" />
          <stop offset="35%" stopColor="#ffba3a" />
          <stop offset="70%" stopColor="#e7411b" />
          <stop offset="100%" stopColor="#e7411b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cb-flame-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd97a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffd97a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cb-wax" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e4c2" />
          <stop offset="100%" stopColor="#a78a5a" />
        </linearGradient>
      </defs>
      {/* Halo */}
      <ellipse cx="24" cy="30" rx="32" ry="36" fill="url(#cb-flame-halo)" className="cb-candle__halo" />
      {/* Flame */}
      <g className="cb-candle__flame">
        <ellipse cx="24" cy="36" rx="9" ry="20" fill="url(#cb-flame-grad)" />
        <ellipse cx="24" cy="38" rx="4" ry="11" fill="#fffce0" opacity="0.75" />
      </g>
      {/* Wick */}
      <line x1="24" y1="55" x2="24" y2="62" stroke="#2a1c12" strokeWidth="1.4" />
      {/* Wax */}
      {!noStick && (
        <>
          <rect x="18" y="62" width="12" height="40" fill="url(#cb-wax)" rx="1" />
          <ellipse cx="24" cy="62" rx="6" ry="2.4" fill="#fffce0" opacity="0.85" />
          <ellipse cx="24" cy="102" rx="8" ry="3" fill="#5a3e15" opacity="0.6" />
          <path d="M 18 64 Q 22 70 18 78 Q 22 84 18 92" fill="#a78a5a" opacity="0.45" />
        </>
      )}
    </svg>
  );
}
