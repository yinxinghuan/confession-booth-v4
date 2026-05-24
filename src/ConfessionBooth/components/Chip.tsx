import type { ReactNode } from 'react';

// Call-center keypad button system. Every button on screen reads as a
// physical object on the operator's switchboard:
//
//   primary    — illuminated cream-plastic phone key with a tiny green
//                LED indicator. Sunken-bezel rim. Depresses on press.
//   secondary  — engraved brass nameplate with inset/recessed type.
//                Mounted, not pressable-feeling.
//   ghost      — text-only link with brass underline accent. For
//                back-arrow / micro-actions.
//
// All variants commit to the skeumorphic detail rather than half-baking it.

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export default function Chip({
  variant = 'primary',
  onClick,
  disabled,
  children,
  fullWidth,
  className,
}: Props) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        if (!disabled && onClick) onClick();
      }}
      disabled={disabled}
      className={`cb-key cb-key--${variant} ${fullWidth ? 'cb-key--full' : ''} ${className ?? ''}`}
    >
      <span className="cb-key__bevel cb-key__bevel--top" aria-hidden />
      <span className="cb-key__bevel cb-key__bevel--bot" aria-hidden />

      {variant === 'primary' && (
        <>
          {/* Mounting screws at two corners */}
          <span className="cb-key__screw cb-key__screw--l" aria-hidden />
          <span className="cb-key__screw cb-key__screw--r" aria-hidden />
          {/* Active LED indicator */}
          <span className="cb-key__led" aria-hidden />
        </>
      )}

      {variant === 'secondary' && (
        <>
          {/* Engraving rule strokes top + bottom */}
          <span className="cb-key__plate-rule cb-key__plate-rule--top" aria-hidden />
          <span className="cb-key__plate-rule cb-key__plate-rule--bot" aria-hidden />
          {/* Mounting screws all 4 corners (proper brass plate) */}
          <span className="cb-key__screw cb-key__screw--tl" aria-hidden />
          <span className="cb-key__screw cb-key__screw--tr" aria-hidden />
          <span className="cb-key__screw cb-key__screw--bl" aria-hidden />
          <span className="cb-key__screw cb-key__screw--br" aria-hidden />
        </>
      )}

      <span className="cb-key__label">{children}</span>
    </button>
  );
}
