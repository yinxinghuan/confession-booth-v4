import type { ReactNode } from 'react';

// Pill chip — the workhorse of the v4 design system. Rounded-rectangle
// with bold all-caps tracked label. Used everywhere:
//   - info chips ("OPEN 24 HRS", "LINE 7")
//   - buttons (filled or outlined)
//   - section labels
//   - operator-reply line chips on the wall + receipt

interface Props {
  children: ReactNode;
  variant?:
    | 'pink'
    | 'coral'
    | 'teal'
    | 'lavender'
    | 'cream'
    | 'yellow'
    | 'black'
    | 'outline-cream'
    | 'outline-pink';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  fullWidth?: boolean;
  className?: string;
  /** display as button (interactive) or plain chip */
  as?: 'button' | 'span';
}

export default function Pill({
  children,
  variant = 'cream',
  size = 'md',
  onClick,
  fullWidth,
  className,
  as,
}: Props) {
  const tag = as ?? (onClick ? 'button' : 'span');
  const cls = `cb4-pill cb4-pill--${variant} cb4-pill--${size} ${fullWidth ? 'cb4-pill--full' : ''} ${className ?? ''}`;

  if (tag === 'button') {
    return (
      <button
        type="button"
        className={cls}
        onPointerDown={(e) => {
          e.preventDefault();
          if (onClick) onClick();
        }}
      >
        {children}
      </button>
    );
  }
  return <span className={cls}>{children}</span>;
}
