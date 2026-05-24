// Hexagon tile pattern — flat-colored honeycomb with optional alternating
// secondary color for pop. Used as a textural backdrop band.

interface Props {
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
  bg?: string;
  /** alternate color (every other tile) */
  altColor?: string;
  /** hex cell radius */
  r?: number;
}

export default function HexTile({
  width = '100%',
  height = '100%',
  className,
  color = '#ffd24a',
  bg = '#0a0a0a',
  altColor,
  r = 22,
}: Props) {
  // Hex point coordinates (flat-top hexagon)
  const sqrt3 = Math.sqrt(3);
  const stepX = r * 1.5;
  const stepY = r * sqrt3;

  const cols = Math.ceil(360 / stepX) + 2;
  const rows = Math.ceil(360 / stepY) + 2;

  const hex = (cx: number, cy: number) =>
    `M ${cx - r} ${cy} L ${cx - r / 2} ${cy - (r * sqrt3) / 2} L ${cx + r / 2} ${cy - (r * sqrt3) / 2} L ${cx + r} ${cy} L ${cx + r / 2} ${cy + (r * sqrt3) / 2} L ${cx - r / 2} ${cy + (r * sqrt3) / 2} Z`;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 360 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={{ display: 'block' }}
    >
      <rect width="360" height="360" fill={bg} />
      <g>
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const cx = col * stepX;
            const cy = row * stepY + (col % 2 ? stepY / 2 : 0);
            const useAlt = altColor && (row + col) % 2 === 0;
            return <path key={`${row}-${col}`} d={hex(cx, cy)} fill={useAlt ? altColor : color} />;
          }),
        )}
      </g>
    </svg>
  );
}
