// Big 5-stripe rainbow U-arc that wraps around content — the dominant
// compositional element from the Wolność "SPEKTAKLE" panel. Stripes loop
// down both sides, across the bottom, and back up.

interface Props {
  width?: number | string;
  height?: number | string;
  className?: string;
  colors?: string[]; // 5 inside-out
  bg?: string;
}

const DEFAULT = ['#ff4d8e', '#ff7a4a', '#ffd24a', '#3ed9b9', '#a888ff'];

export default function RainbowArc({
  width = '100%',
  height = '100%',
  className,
  colors = DEFAULT,
  bg = '#0a0a0a',
}: Props) {
  // viewBox 320×260, frame opens at the top.
  const vbW = 320;
  const vbH = 260;
  const stripeW = 14;
  const gap = 1;
  // Inner loop is a rounded rectangle clipped at the top.
  // Each stripe = a rounded-rect path of growing radius.
  const baseInner = 40;
  const baseLeft = 60;
  const baseTop = 30;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <rect width={vbW} height={vbH} fill={bg} />
      <g fill="none" strokeLinejoin="miter">
        {colors.map((c, i) => {
          const inset = i * (stripeW + gap);
          const x = baseLeft - inset;
          const y = baseTop - inset;
          const w = vbW - 2 * x;
          const h = vbH - y + 60; // extends past the bottom so the loop reads "open at top"
          const r = baseInner + inset;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={h}
              rx={r}
              stroke={c}
              strokeWidth={stripeW}
            />
          );
        })}
        {/* black mask to clip the top portion so it reads as U-arc opening upward */}
      </g>
      <rect x="0" y="0" width={vbW} height={baseTop - 6} fill={bg} />
    </svg>
  );
}
