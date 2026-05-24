// Diagonal parallelogram tile — like the WEBINARY panel in Wolność.
// Two-color tessellation of stretched parallelograms tilting one direction.

interface Props {
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
  bg?: string;
  /** secondary accent color for highlight bars */
  accent?: string;
  /** parallelogram width step in user-space units */
  step?: number;
  /** how steep the tilt is (0=flat, 1=45°) */
  skew?: number;
}

export default function DiagonalTile({
  width = '100%',
  height = '100%',
  className,
  color = '#a888ff',
  bg = '#0a0a0a',
  accent = '#ff4d8e',
  step = 28,
  skew = 0.55,
}: Props) {
  const vbW = 320;
  const vbH = 160;
  // each tile is `step` wide and `vbH` tall, sheared by `skew*vbH` horizontally
  const shear = skew * vbH;
  const cols = Math.ceil((vbW + shear) / step) + 2;

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
        {Array.from({ length: cols }).map((_, i) => {
          const x = i * step - shear;
          const isAccent = i % 3 === 0;
          const fill = isAccent ? accent : color;
          return (
            <polygon
              key={i}
              points={`${x},${vbH} ${x + step * 0.62},${vbH} ${x + step * 0.62 + shear},0 ${x + shear},0`}
              fill={fill}
            />
          );
        })}
      </g>
    </svg>
  );
}
