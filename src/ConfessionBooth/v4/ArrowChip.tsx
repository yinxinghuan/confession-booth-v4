// Small orange-pill arrow chip — used in the Wolność "→ TWORZONYCH PRZEZ"
// reading flow indicators between content pills.

interface Props {
  direction?: 'right' | 'left' | 'down' | 'up';
  variant?: 'orange' | 'cream' | 'pink' | 'teal';
  size?: 'sm' | 'md';
  className?: string;
}

const GLYPH = { right: '→', left: '←', down: '↓', up: '↑' };

export default function ArrowChip({ direction = 'right', variant = 'orange', size = 'sm', className }: Props) {
  return (
    <span className={`cb4-arrow cb4-arrow--${variant} cb4-arrow--${size} ${className ?? ''}`}>
      {GLYPH[direction]}
    </span>
  );
}
