// Dark walnut backdrop with subtle vertical grain streaks. Used as the
// background canvas of the whole game (under the stained glass + grille).

interface Props {
  width?: number;
  height?: number;
  className?: string;
  /** add a downward shaft of warm light from the top */
  shaft?: boolean;
}

export default function WoodPanel({ width = 390, height = 844, className, shaft = true }: Props) {
  // Deterministic grain — 24 vertical streaks at varied offsets
  const streaks = Array.from({ length: 24 }).map((_, i) => {
    const x = (i / 23) * width + ((i * 17.3) % 7);
    const opacity = 0.05 + ((i * 13) % 11) / 70;
    const w = 1 + ((i * 7) % 3);
    return { x, opacity, w };
  });
  const knots = Array.from({ length: 5 }).map((_, i) => {
    const x = ((i * 71) % (width - 80)) + 40;
    const y = ((i * 137) % (height - 100)) + 50;
    return { x, y, r: 6 + (i % 3) * 3 };
  });

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="cb-wood-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d130a" />
          <stop offset="50%" stopColor="#2a1c12" />
          <stop offset="100%" stopColor="#150b06" />
        </linearGradient>
        <radialGradient id="cb-shaft" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor="#f3e4c2" stopOpacity="0.32" />
          <stop offset="40%" stopColor="#e8a23a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0d0805" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={width} height={height} fill="url(#cb-wood-base)" />
      <g>
        {streaks.map((s, i) => (
          <rect
            key={i}
            x={s.x}
            y="0"
            width={s.w}
            height={height}
            fill="#3d2818"
            opacity={s.opacity}
          />
        ))}
      </g>
      <g>
        {knots.map((k, i) => (
          <g key={i}>
            <ellipse cx={k.x} cy={k.y} rx={k.r} ry={k.r * 0.55} fill="#0a0703" opacity="0.55" />
            <ellipse cx={k.x} cy={k.y} rx={k.r * 0.45} ry={k.r * 0.25} fill="#3d2818" opacity="0.65" />
          </g>
        ))}
      </g>
      {shaft && <rect width={width} height={height} fill="url(#cb-shaft)" />}
    </svg>
  );
}
