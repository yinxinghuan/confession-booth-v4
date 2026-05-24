// Multi-color sunburst radial — like the Wolność top-right "07-11" panel
// where bright rays alternate pink/lavender from a center.

interface Props {
  width?: number | string;
  height?: number | string;
  className?: string;
  colors?: string[];
  bg?: string;
  rays?: number;
  /** if given, anchor the burst at this fractional position [0..1, 0..1] */
  origin?: { x: number; y: number };
}

const DEFAULT_COLORS = ['#ff4d8e', '#a888ff'];

export default function Sunburst({
  width = '100%',
  height = '100%',
  className,
  colors = DEFAULT_COLORS,
  bg = '#0a0a0a',
  rays = 16,
  origin,
}: Props) {
  const vbW = 320;
  const vbH = 320;
  const cx = (origin?.x ?? 0.5) * vbW;
  const cy = (origin?.y ?? 0.5) * vbH;
  const r = vbW * 1.4; // ray length, far beyond the box so it fills

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width={vbW} height={vbH} fill={bg} />
      <g>
        {Array.from({ length: rays }).map((_, i) => {
          const a0 = (i / rays) * Math.PI * 2;
          const a1 = ((i + 1) / rays) * Math.PI * 2;
          const c = colors[i % colors.length];
          const x0 = cx + Math.cos(a0) * r;
          const y0 = cy + Math.sin(a0) * r;
          const x1 = cx + Math.cos(a1) * r;
          const y1 = cy + Math.sin(a1) * r;
          return <polygon key={i} points={`${cx},${cy} ${x0},${y0} ${x1},${y1}`} fill={c} />;
        })}
      </g>
    </svg>
  );
}
