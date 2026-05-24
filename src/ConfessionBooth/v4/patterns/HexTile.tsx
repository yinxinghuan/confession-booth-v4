// Pointy-top hexagon tile pattern — actually visible, two-color
// alternating. Used as divider / accent band.

interface Props {
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
  altColor?: string;
  bg?: string;
  /** hex circumradius in svg user-space units */
  r?: number;
}

export default function HexTile({
  width = '100%',
  height = '100%',
  className,
  color = '#ffd24a',
  altColor = '#ff7a4a',
  bg = '#0a0a0a',
  r = 16,
}: Props) {
  // Pointy-top hex: width = sqrt(3)*r, height = 2*r
  const sqrt3 = Math.sqrt(3);
  const hexW = sqrt3 * r;
  const hexH = 2 * r;
  const rowStep = hexH * 0.75; // vertical step between rows
  const vbW = 320;
  const vbH = 80;
  const cols = Math.ceil(vbW / hexW) + 2;
  const rows = Math.ceil(vbH / rowStep) + 2;

  const hexPath = (cx: number, cy: number) =>
    `M ${cx} ${cy - r} L ${cx + hexW / 2} ${cy - r / 2} L ${cx + hexW / 2} ${cy + r / 2} L ${cx} ${cy + r} L ${cx - hexW / 2} ${cy + r / 2} L ${cx - hexW / 2} ${cy - r / 2} Z`;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={{ display: 'block' }}
    >
      <rect width={vbW} height={vbH} fill={bg} />
      <g>
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const cx = col * hexW + (row % 2 ? hexW / 2 : 0);
            const cy = row * rowStep;
            const useAlt = (row + col) % 2 === 0;
            return <path key={`${row}-${col}`} d={hexPath(cx, cy)} fill={useAlt ? color : altColor} />;
          }),
        )}
      </g>
    </svg>
  );
}
