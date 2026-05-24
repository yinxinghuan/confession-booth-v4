// Decorative "how is this paper card attached to the wall" treatments.
// One of these is rendered per wall-card so the bulletin board reads as
// the operator's actual workspace, not an algorithmic grid.

type Kind = 'pushpin' | 'staple' | 'tape' | 'punch';

interface Props {
  kind: Kind;
  /** rotation in degrees for the entire decoration */
  rotate?: number;
}

const RED = '#ec2c64';
const BRASS = '#a87e3a';
const TAPE = '#f4ce64';

export default function CardPin({ kind, rotate = 0 }: Props) {
  if (kind === 'pushpin') {
    return (
      <svg
        className="cb-pin cb-pin--pushpin"
        viewBox="0 0 26 26"
        width="26"
        height="26"
        style={{ transform: `rotate(${rotate}deg)` }}
        aria-hidden
      >
        <ellipse cx="13" cy="14" rx="9" ry="2" fill="#000" opacity="0.45" />
        <circle cx="13" cy="11" r="8" fill={RED} />
        <circle cx="11" cy="9" r="3" fill="#fff" opacity="0.45" />
        <circle cx="13" cy="11" r="2" fill="#7a0d24" />
      </svg>
    );
  }
  if (kind === 'staple') {
    return (
      <svg
        className="cb-pin cb-pin--staple"
        viewBox="0 0 38 14"
        width="38"
        height="14"
        style={{ transform: `rotate(${rotate}deg)` }}
        aria-hidden
      >
        <rect x="0" y="2" width="38" height="3.4" fill="#9aa3ad" />
        <rect x="0" y="2" width="38" height="1.4" fill="#dee3e8" />
        <rect x="0" y="5" width="6" height="9" fill="#9aa3ad" />
        <rect x="32" y="5" width="6" height="9" fill="#9aa3ad" />
      </svg>
    );
  }
  if (kind === 'tape') {
    return (
      <svg
        className="cb-pin cb-pin--tape"
        viewBox="0 0 80 22"
        width="80"
        height="22"
        preserveAspectRatio="none"
        style={{ transform: `rotate(${rotate}deg)` }}
        aria-hidden
      >
        <rect x="0" y="0" width="80" height="22" fill={TAPE} opacity="0.74" />
        {/* serrated edges */}
        <path d="M 0 0 L 3 4 L 6 0 L 10 4 L 13 0 L 16 4 L 19 0 L 23 4 L 26 0 L 30 4 L 33 0 L 36 4 L 40 0 L 43 4 L 47 0 L 50 4 L 53 0 L 56 4 L 60 0 L 63 4 L 67 0 L 70 4 L 73 0 L 76 4 L 80 0 L 80 0 Z" fill="#1a0f08" opacity="0.35" />
        <path d="M 0 22 L 4 18 L 7 22 L 10 18 L 14 22 L 17 18 L 20 22 L 24 18 L 27 22 L 30 18 L 34 22 L 37 18 L 40 22 L 44 18 L 47 22 L 50 18 L 54 22 L 57 18 L 60 22 L 63 18 L 67 22 L 70 18 L 73 22 L 77 18 L 80 22 L 80 22 Z" fill="#1a0f08" opacity="0.35" />
        {/* slight cellotape grain */}
        <rect x="14" y="6" width="22" height="0.5" fill="#fff" opacity="0.6" />
        <rect x="50" y="14" width="18" height="0.4" fill="#fff" opacity="0.5" />
      </svg>
    );
  }
  // punch — a hole in the corner of the paper
  return (
    <svg
      className="cb-pin cb-pin--punch"
      viewBox="0 0 22 22"
      width="22"
      height="22"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" fill="#0a0703" />
      <circle cx="11" cy="11" r="7" fill="none" stroke={BRASS} strokeWidth="1" />
      {/* string */}
      <path d="M 11 4 L 5 -4" stroke="#1a0f08" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export type { Kind as CardPinKind };
