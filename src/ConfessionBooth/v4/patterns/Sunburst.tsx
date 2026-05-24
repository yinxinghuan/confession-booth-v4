// Sunburst radial stripe pattern — concentric color rays radiating from a
// center point. Used on the absolution screen (verdict reveal moment) and
// as a header band on the wall.

interface Props {
  width?: number | string;
  height?: number | string;
  className?: string;
  colors?: string[]; // stripe colors, repeated as needed
  bg?: string;
  rays?: number; // how many rays around the circle
  /** anchor of the center: '50% 50%' (default) or e.g. '50% 100%' for arc-from-bottom */
  origin?: { cx: number; cy: number };
}

const DEFAULT_COLORS = ['#ff4d8e', '#ff7a4a', '#a888ff', '#3ed9b9'];

export default function Sunburst({
  width = '100%',
  height = '100%',
  className,
  colors = DEFAULT_COLORS,
  bg = '#0a0a0a',
  rays = 24,
  origin,
}: Props) {
  const cx = origin?.cx ?? 100;
  const cy = origin?.cy ?? 100;
  const r = 400; // very large so it always covers the container

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="200" height="200" fill={bg} />
      <g>
        {Array.from({ length: rays }).map((_, i) => {
          const a0 = (i / rays) * Math.PI * 2;
          const a1 = ((i + 1) / rays) * Math.PI * 2;
          const c = colors[i % colors.length];
          const x0 = cx + Math.cos(a0) * r;
          const y0 = cy + Math.sin(a0) * r;
          const x1 = cx + Math.cos(a1) * r;
          const y1 = cy + Math.sin(a1) * r;
          return (
            <polygon
              key={i}
              points={`${cx},${cy} ${x0},${y0} ${x1},${y1}`}
              fill={c}
            />
          );
        })}
      </g>
    </svg>
  );
}
