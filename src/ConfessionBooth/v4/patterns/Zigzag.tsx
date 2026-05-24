// Triangle zigzag — separated V's (with black gaps showing between) plus a
// secondary set in a different color and rhythm. Mimics the Wolność stage
// where downward purple V's from the top + smaller upward V's from the
// bottom interlock with black space between, reading as a "stage curtain"
// pattern.

interface Props {
  width?: number | string;
  height?: number | string;
  /** primary triangle color (down V's from the top) */
  color?: string;
  /** secondary accent color — upward V's from the bottom */
  accent?: string;
  /** background behind all triangles */
  bg?: string;
  /** how many primary V's across */
  cols?: number;
  /** if true, also render up V's at half-offset in accent color */
  withUp?: boolean;
  className?: string;
}

export default function Zigzag({
  width = '100%',
  height = '100%',
  color = '#a888ff',
  accent = '#ff4d8e',
  bg = '#0a0a0a',
  cols = 9,
  withUp = true,
  className,
}: Props) {
  // viewBox: a column is 20 wide, total = cols*20. Height 100.
  const vbW = cols * 20;
  const vbH = 100;

  // Primary V's are 14 wide (7 each side of center) → 6 gap between, so the
  // black bg shows. Their points reach the bottom of the viewBox.
  const halfPrimary = 7;
  // Secondary up-V's are slightly narrower (5 each side) → smaller, sit at
  // half-tile offset, reach the top of viewBox from the bottom.
  const halfAccent = 5;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
      aria-hidden
    >
      <rect width={vbW} height={vbH} fill={bg} />

      {/* Primary down-V's */}
      <g fill={color}>
        {Array.from({ length: cols + 1 }).map((_, i) => {
          const x = i * 20;
          return <polygon key={i} points={`${x - halfPrimary},0 ${x + halfPrimary},0 ${x},${vbH}`} />;
        })}
      </g>

      {/* Secondary up-V's */}
      {withUp && (
        <g fill={accent}>
          {Array.from({ length: cols + 1 }).map((_, i) => {
            const x = i * 20 + 10;
            return <polygon key={i} points={`${x - halfAccent},${vbH} ${x + halfAccent},${vbH} ${x},0`} />;
          })}
        </g>
      )}
    </svg>
  );
}
