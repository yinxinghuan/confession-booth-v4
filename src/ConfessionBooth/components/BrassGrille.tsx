// The brass grille between confessor and operator. A real confessional
// grille is a CAST IRON LATTICE — diamonds connected by thin diagonal
// struts, with see-through holes between them, not floating diamonds.
//
// SVG <pattern> over user-space coords so the lattice scales to any
// parent size without distortion.

interface Props {
  width?: number | string;
  height?: number | string;
  /** opacity multiplier on the brass elements (0–1) */
  density?: number;
  className?: string;
  /** transparent (default) or filled dark wood backplate */
  fill?: 'transparent' | 'dark';
  /** cell pitch in px — bigger = larger diamonds + more see-through */
  cell?: number;
}

export default function BrassGrille({
  width = '100%',
  height = '100%',
  density = 0.95,
  className,
  fill = 'transparent',
  cell = 30,
}: Props) {
  const c = cell;
  const half = c / 2;
  const diamondR = c * 0.36; // diamond half-width (smaller than cell so holes show)
  const strutW = 3.4;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      preserveAspectRatio="none"
      aria-hidden
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="cb-brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c570" />
          <stop offset="50%" stopColor="#a87e3a" />
          <stop offset="100%" stopColor="#4a3210" />
        </linearGradient>
        <linearGradient id="cb-brass-strut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fce6a3" />
          <stop offset="35%" stopColor="#c8964a" />
          <stop offset="100%" stopColor="#3a2710" />
        </linearGradient>
        <linearGradient id="cb-brass-hi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fce6a3" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#fce6a3" stopOpacity="0" />
          <stop offset="100%" stopColor="#fce6a3" stopOpacity="0" />
        </linearGradient>
        <pattern
          id="cb-grille-pat"
          x="0"
          y="0"
          width={c}
          height={c}
          patternUnits="userSpaceOnUse"
        >
          {/* Diagonal struts forming an X through the cell center, bordered
              by the diamond. Strut goes corner-to-corner; the diamond at
              the center connects them. */}
          <g opacity={density}>
            {/* Diagonals (form the lattice X-mesh) */}
            <line
              x1="0" y1="0" x2={c} y2={c}
              stroke="url(#cb-brass-strut)"
              strokeWidth={strutW}
            />
            <line
              x1="0" y1={c} x2={c} y2="0"
              stroke="url(#cb-brass-strut)"
              strokeWidth={strutW}
            />
            {/* Diamond at center (cast knot) — slightly larger so it
                visually anchors the X joint */}
            <path
              d={`M ${half} ${half - diamondR}
                  L ${half + diamondR} ${half}
                  L ${half} ${half + diamondR}
                  L ${half - diamondR} ${half}
                  Z`}
              fill="url(#cb-brass)"
              stroke="#3a2710"
              strokeWidth="0.6"
            />
            {/* Top highlight on diamond */}
            <path
              d={`M ${half} ${half - diamondR}
                  L ${half + diamondR * 0.6} ${half - diamondR * 0.18}
                  L ${half} ${half - diamondR * 0.55} Z`}
              fill="url(#cb-brass-hi)"
            />
            {/* Tiny center rivet */}
            <circle cx={half} cy={half} r="1.2" fill="#3a2710" />
            <circle cx={half - 0.4} cy={half - 0.4} r="0.6" fill="#fce6a3" opacity="0.9" />
          </g>
        </pattern>
      </defs>
      {fill === 'dark' && <rect width="100%" height="100%" fill="#1a0f08" />}
      <rect width="100%" height="100%" fill="url(#cb-grille-pat)" />
    </svg>
  );
}
