// Interlocking diamond pattern — multi-color like the Wolność MUZEUM panel.
// 4 colors alternating in a diamond tessellation.

interface Props {
  width?: number | string;
  height?: number | string;
  className?: string;
  colors?: string[];
  bg?: string;
  /** diamond half-width in user-space */
  size?: number;
}

const DEFAULT_COLORS = ['#3ed9b9', '#c64030', '#a888ff', '#ff4d8e'];

export default function Diamond({
  width = '100%',
  height = '100%',
  className,
  colors = DEFAULT_COLORS,
  bg = '#0a0a0a',
  size = 24,
}: Props) {
  const vbW = 320;
  const vbH = 160;
  const cols = Math.ceil(vbW / size) + 2;
  const rows = Math.ceil(vbH / size) + 2;

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
      <g>
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const cx = col * size + (row % 2 ? size / 2 : 0);
            const cy = row * size * 0.62;
            const colorIdx = (row + col) % colors.length;
            const fill = colors[colorIdx];
            return (
              <polygon
                key={`${row}-${col}`}
                points={`${cx},${cy - size * 0.55} ${cx + size * 0.5},${cy} ${cx},${cy + size * 0.55} ${cx - size * 0.5},${cy}`}
                fill={fill}
              />
            );
          }),
        )}
      </g>
    </svg>
  );
}
