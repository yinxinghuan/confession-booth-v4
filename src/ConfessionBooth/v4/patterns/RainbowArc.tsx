// Concentric rainbow arcs — 4-color stripe loop that wraps around content.
// Used as a frame device on the verdict / wall / processing screens, like
// the U-loop frame in the Wolność "SPEKTAKLE" panel.

interface Props {
  width?: number | string;
  height?: number | string;
  className?: string;
  colors?: string[]; // 4-5 stripe colors from inside out
  bg?: string;
}

const DEFAULT_COLORS = [
  '#a888ff', // lavender (innermost)
  '#ff4d8e', // hot pink
  '#ff7a4a', // coral
  '#ffd24a', // yellow
  '#3ed9b9', // teal (outermost)
];

export default function RainbowArc({
  width = '100%',
  height = '100%',
  className,
  colors = DEFAULT_COLORS,
  bg = '#0a0a0a',
}: Props) {
  // Coordinate system: 200×220 nominal. Loop = a rounded-rect path centered
  // with stripes going outward. We use stroke-width to draw each stripe band.
  const cx = 100;
  const cy = 110;
  const baseInner = 56;
  const stripeW = 12;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 200 220"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <rect width="200" height="220" fill={bg} />
      <g fill="none" strokeLinejoin="miter">
        {colors.map((c, i) => {
          const r = baseInner + i * stripeW;
          return (
            <rect
              key={i}
              x={cx - r}
              y={cy - r - 8}
              width={r * 2}
              height={r * 2 + 30}
              rx={r}
              stroke={c}
              strokeWidth={stripeW - 1}
            />
          );
        })}
      </g>
    </svg>
  );
}
