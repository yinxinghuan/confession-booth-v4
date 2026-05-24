// Stained-glass pointed-arch window. Geometric rose-window-inspired panes:
// a central rose with 8 petals, surrounded by a ring of trefoils, all bounded
// by a lancet (gothic pointed) arch. Leaded lines in black. Subtle candle
// flicker via CSS keyframes (opacity drift on the warm panes).

interface Props {
  width?: number;
  height?: number;
  variant?: 'full' | 'top-strip'; // top-strip = just the upper third (used in typing screen)
  className?: string;
}

export default function StainedGlass({ width = 280, height = 360, variant = 'full', className }: Props) {
  // Bound arch path: pointed-top lancet shape.
  // Coordinates work in a 280×360 canvas — children scale to viewBox.
  const arch = 'M14 350 L14 130 Q14 14 140 14 Q266 14 266 130 L266 350 Z';

  // Stained-glass palette — saturated, jewel-like, glowing.
  const amber = '#e9a23a';
  const rose = '#c64873';
  const cobalt = '#1d33c4';
  const leaf = '#2b6e3f';
  const lavender = '#9879d1';
  const ruby = '#8a1a1a';
  const honey = '#d6c074';
  const lead = '#0a0703';

  const isTop = variant === 'top-strip';

  return (
    <svg
      className={className}
      viewBox={isTop ? '0 0 280 140' : '0 0 280 360'}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <clipPath id="cb-arch">
          <path d={arch} />
        </clipPath>
        <radialGradient id="cb-pane-light" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7d2" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#fff7d2" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#fff7d2" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g clipPath="url(#cb-arch)">
        {/* Black backing — leading shows through */}
        <rect x="0" y="0" width="280" height="360" fill={lead} />

        {/* Outer ring of triangle panes radiating from center */}
        {!isTop && (
          <g className="cb-glass__outer">
            {Array.from({ length: 12 }).map((_, i) => {
              const colors = [amber, rose, cobalt, leaf, lavender, honey, amber, ruby, cobalt, rose, leaf, lavender];
              const a0 = (i / 12) * Math.PI * 2;
              const a1 = ((i + 1) / 12) * Math.PI * 2;
              const r0 = 90;
              const r1 = 150;
              const cx = 140;
              const cy = 180;
              const p = `M ${cx + Math.cos(a0) * r0} ${cy + Math.sin(a0) * r0}
                         L ${cx + Math.cos(a0) * r1} ${cy + Math.sin(a0) * r1}
                         A ${r1} ${r1} 0 0 1 ${cx + Math.cos(a1) * r1} ${cy + Math.sin(a1) * r1}
                         L ${cx + Math.cos(a1) * r0} ${cy + Math.sin(a1) * r0}
                         A ${r0} ${r0} 0 0 0 ${cx + Math.cos(a0) * r0} ${cy + Math.sin(a0) * r0} Z`;
              return <path key={i} d={p} fill={colors[i]} className="cb-glass__pane" style={{ animationDelay: `${i * 0.27}s` }} />;
            })}
          </g>
        )}

        {/* Center rose — 8 petals */}
        {!isTop && (
          <g transform="translate(140 180)">
            {Array.from({ length: 8 }).map((_, i) => {
              const colors = [rose, amber, cobalt, leaf, rose, honey, cobalt, lavender];
              const rot = i * 45;
              return (
                <path
                  key={i}
                  transform={`rotate(${rot})`}
                  d="M 0 0 L 0 -70 Q 26 -50 26 -20 Q 26 0 0 0 Z"
                  fill={colors[i]}
                  className="cb-glass__petal"
                  style={{ animationDelay: `${i * 0.31}s` }}
                />
              );
            })}
            <circle r="10" fill="#fff8df" className="cb-glass__core" />
          </g>
        )}

        {/* Top quatrefoil arch panes — present in both variants */}
        <g>
          {/* Two narrow lancets flanking center top */}
          <path d="M 36 60 L 36 220 L 100 220 L 100 100 Q 100 60 70 60 Z" fill={cobalt} className="cb-glass__pane" />
          <path d="M 244 60 L 244 220 L 180 220 L 180 100 Q 180 60 210 60 Z" fill={ruby} className="cb-glass__pane" />
          <path d="M 100 100 Q 100 60 140 60 Q 180 60 180 100 L 180 60 L 100 60 Z" fill={honey} className="cb-glass__pane" />
          <path d="M 100 100 Q 140 60 180 100 L 180 60 L 100 60 Z" fill={amber} opacity="0.85" />
        </g>

        {/* Highlight: warm core glow center, simulating sun-on-glass */}
        <circle cx="140" cy={isTop ? 80 : 180} r={isTop ? 80 : 140} fill="url(#cb-pane-light)" />

        {/* Leading — the black lead lines between panes */}
        <g fill="none" stroke={lead} strokeWidth="2.5" strokeLinecap="round">
          {!isTop && (
            <>
              {/* Outer ring boundary */}
              <circle cx="140" cy="180" r="90" />
              <circle cx="140" cy="180" r="150" />
              {/* Petal rays */}
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <line key={i} x1={140 + Math.cos(a) * 90} y1={180 + Math.sin(a) * 90} x2={140 + Math.cos(a) * 150} y2={180 + Math.sin(a) * 150} />;
              })}
              {/* Center 8 petal lines */}
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return <line key={i} x1="140" y1="180" x2={140 + Math.cos(a) * 70} y2={180 + Math.sin(a) * 70} />;
              })}
            </>
          )}
          {/* Upper lancet structure */}
          <line x1="100" y1="60" x2="100" y2="220" />
          <line x1="180" y1="60" x2="180" y2="220" />
          <path d="M 100 100 Q 100 60 140 60 Q 180 60 180 100" />
          <line x1="140" y1="60" x2="140" y2="100" />
        </g>

        {/* Outer arch lead trim */}
        <path d={arch} fill="none" stroke={lead} strokeWidth="6" />
      </g>
    </svg>
  );
}
