// Triangle zigzag — Wolność Panel 1 stage-curtain pattern.
//   - Tall narrow triangles pointing DOWN from the top of the panel
//   - Same set pointing UP from the bottom, at half-tile offset
//   - Triangles span only ~60% of the height, so the middle is pure black
//   - Both layers in the same color (the curtain reads as one mesh)

interface Props {
  width?: number | string;
  height?: number | string;
  color?: string;
  accent?: string;
  bg?: string;
  cols?: number;
  withUp?: boolean;
  className?: string;
}

export default function Zigzag({
  width = '100%',
  height = '100%',
  color = '#a888ff',
  accent,
  bg = '#0a0a0a',
  cols = 14,
  withUp = true,
  className,
}: Props) {
  // viewBox uses an aspect that's TALLER than 1:1 (about 1:2.5), so when the
  // SVG stretches into a portrait container the V's stay reasonably
  // triangular instead of becoming pencil lines.
  const tile = 20;
  const vbW = cols * tile;
  const vbH = cols * tile * 2.5;
  // Triangle height: 60% of the half-height; remaining 40% is black middle
  const triH = vbH * 0.55;
  // Triangle half-width: a touch wider than the gap (8 of 20 tile = wider
  // than the 12-tile gap inverted; gives a V visibility close to reference)
  const halfPrimary = 8;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ display: 'block' }}
      aria-hidden
    >
      <rect width={vbW} height={vbH} fill={bg} />

      {/* Down V's from the top */}
      <g fill={color}>
        {Array.from({ length: cols + 1 }).map((_, i) => {
          const x = i * tile;
          return (
            <polygon
              key={i}
              points={`${x - halfPrimary},0 ${x + halfPrimary},0 ${x},${triH}`}
            />
          );
        })}
      </g>

      {/* Up V's from the bottom, half-tile offset */}
      {withUp && (
        <g fill={accent ?? color}>
          {Array.from({ length: cols + 1 }).map((_, i) => {
            const x = i * tile + tile / 2;
            return (
              <polygon
                key={i}
                points={`${x - halfPrimary},${vbH} ${x + halfPrimary},${vbH} ${x},${vbH - triH}`}
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}
