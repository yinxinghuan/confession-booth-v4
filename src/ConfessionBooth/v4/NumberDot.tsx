// Orange dot circle with a number inside — the brand-mark from the
// Wolność reference (the "3" in the top-left of the festival hero).
// Used for: edition number, ticket number, verdict count, week count.

interface Props {
  value: string | number;
  /** dot color — default orange. Used to tint per stage / verdict. */
  color?: 'orange' | 'pink' | 'teal' | 'lavender' | 'yellow' | 'cream';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function NumberDot({ value, color = 'orange', size = 'md', className }: Props) {
  return (
    <span className={`cb4-dot cb4-dot--${color} cb4-dot--${size} ${className ?? ''}`}>
      {value}
    </span>
  );
}
