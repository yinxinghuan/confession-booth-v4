// Triangle zigzag pattern — downward V's filling the band. Two color variant
// (alternating). Tile-able SVG pattern so it scales to any container.

interface Props {
  width?: number | string;
  height?: number | string;
  /** primary triangle color (the V's themselves) */
  color?: string;
  /** background behind the triangles */
  bg?: string;
  /** how many V's across — drives tile size */
  cols?: number;
  /** triangle direction */
  variant?: 'down' | 'up';
  className?: string;
}

export default function Zigzag({
  width = '100%',
  height = '100%',
  color = '#ff4d8e',
  bg = '#0a0a0a',
  cols = 6,
  variant = 'down',
  className,
}: Props) {
  // We render across one row tall and let the SVG stretch to fill the
  // container with preserveAspectRatio="none" so the V's elongate.
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${cols * 20} 40`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
      aria-hidden
    >
      <rect width="100%" height="100%" fill={bg} />
      <g fill={color}>
        {Array.from({ length: cols + 1 }).map((_, i) => {
          const x = i * 20;
          if (variant === 'down') {
            // V pointing down (apex at bottom)
            return <polygon key={i} points={`${x - 10},0 ${x + 10},0 ${x},40`} />;
          }
          return <polygon key={i} points={`${x - 10},40 ${x + 10},40 ${x},0`} />;
        })}
      </g>
    </svg>
  );
}
