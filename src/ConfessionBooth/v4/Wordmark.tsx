// The curvy hero logotype — uses Bagel Fat One via Google Fonts, the
// closest free font to the Wolność hand-drawn curvy logotype look.
// Wrapped in a colored plate with sparkle corners + sub-pill below.

import type { ReactNode } from 'react';

interface Props {
  /** The big curvy word */
  word: string;
  /** Pill under the word (e.g. "A 24/7 HOTLINE" / "FESTIWAL") */
  sub?: ReactNode;
  /** Plate color */
  variant?: 'teal' | 'pink' | 'coral' | 'lavender' | 'yellow' | 'cream';
  /** Sub-pill color */
  subVariant?: 'pink' | 'coral' | 'cream' | 'teal';
  /** Rotation in degrees, default -2.5 */
  tilt?: number;
  /** Show ✦ sparkle corners */
  sparkle?: boolean;
  className?: string;
  /** Override font size of the word in px (default 50) */
  size?: number;
}

export default function Wordmark({
  word,
  sub,
  variant = 'teal',
  subVariant = 'pink',
  tilt = -2.5,
  sparkle = true,
  className,
  size = 50,
}: Props) {
  return (
    <div className={`cb4-wm cb4-wm--${variant} ${className ?? ''}`} style={{ transform: `rotate(${tilt}deg)` }}>
      {sparkle && (
        <>
          <span className="cb4-wm__spark cb4-wm__spark--tl">✦</span>
          <span className="cb4-wm__spark cb4-wm__spark--br">✦</span>
        </>
      )}
      <span className="cb4-wm__word" style={{ fontSize: size }}>{word}</span>
      {sub && <span className={`cb4-wm__sub cb4-wm__sub--${subVariant}`}>{sub}</span>}
    </div>
  );
}
