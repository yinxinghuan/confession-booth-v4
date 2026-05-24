// Scattered accent dots floating across the screen — adds the small-detail
// rhythm that Wolność prints have. Deterministic positions so it looks
// designed-not-random.

interface Props {
  count?: number;
  className?: string;
  /** SVG viewBox size; dots scatter inside this */
  width?: number;
  height?: number;
  colors?: string[];
  /** dot radius range [min, max] */
  rRange?: [number, number];
  /** seed for placement (lets caller pin deterministic layouts) */
  seed?: number;
}

const DEFAULT_COLORS = ['#ff9a3c', '#fce8c8', '#ff4d8e', '#3ed9b9'];

// Tiny LCG so the scatter is deterministic + serializable
function rand(seed: number): () => number {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function Confetti({
  count = 14,
  className,
  width = 400,
  height = 800,
  colors = DEFAULT_COLORS,
  rRange = [2, 5],
  seed = 7,
}: Props) {
  const r = rand(seed);
  const dots = Array.from({ length: count }).map(() => ({
    x: r() * width,
    y: r() * height,
    rad: rRange[0] + r() * (rRange[1] - rRange[0]),
    c: colors[Math.floor(r() * colors.length)],
    star: r() > 0.78, // 22% become 4-point stars instead of dots
  }));

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {dots.map((d, i) =>
        d.star ? (
          <g key={i} transform={`translate(${d.x} ${d.y})`} fill={d.c}>
            <polygon points={`0,${-d.rad * 2} ${d.rad * 0.5},${-d.rad * 0.5} ${d.rad * 2},0 ${d.rad * 0.5},${d.rad * 0.5} 0,${d.rad * 2} ${-d.rad * 0.5},${d.rad * 0.5} ${-d.rad * 2},0 ${-d.rad * 0.5},${-d.rad * 0.5}`} />
          </g>
        ) : (
          <circle key={i} cx={d.x} cy={d.y} r={d.rad} fill={d.c} />
        ),
      )}
    </svg>
  );
}
