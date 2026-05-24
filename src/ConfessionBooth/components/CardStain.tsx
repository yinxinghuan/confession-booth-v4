// Per-wall-card visual "wear" — coffee ring, ink smudge, folded corner,
// or scribbled marginalia. Rotates per card so the wall reads as the
// operator's bulletin board, not an algorithmic grid.

type Kind = 'coffee' | 'ink' | 'fold' | 'margin' | 'none';

interface Props {
  kind: Kind;
  /** the operator's handwritten initial/note for the margin kind */
  note?: string;
}

export default function CardStain({ kind, note = '✓ JL' }: Props) {
  if (kind === 'coffee') {
    return (
      <svg className="cb-stain cb-stain--coffee" viewBox="0 0 90 90" width="90" height="90" aria-hidden>
        <defs>
          <radialGradient id="cb-coffee" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7a5a32" stopOpacity="0" />
            <stop offset="78%" stopColor="#7a5a32" stopOpacity="0" />
            <stop offset="82%" stopColor="#5a3e15" stopOpacity="0.45" />
            <stop offset="90%" stopColor="#3a2710" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3a2710" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="45" cy="45" rx="40" ry="34" fill="url(#cb-coffee)" />
        <ellipse cx="45" cy="45" rx="34" ry="28" fill="none" stroke="#5a3e15" strokeWidth="2" opacity="0.4" />
        <ellipse cx="45" cy="45" rx="40" ry="34" fill="none" stroke="#5a3e15" strokeWidth="1.2" opacity="0.5" />
      </svg>
    );
  }
  if (kind === 'ink') {
    return (
      <svg className="cb-stain cb-stain--ink" viewBox="0 0 60 60" width="60" height="60" aria-hidden>
        <path
          d="M 30 10 Q 42 14 44 28 Q 50 36 38 42 Q 32 52 22 46 Q 12 50 10 38 Q 6 28 16 22 Q 20 12 30 10 Z"
          fill="#0a0703"
          opacity="0.65"
        />
        <circle cx="48" cy="14" r="2.2" fill="#0a0703" opacity="0.55" />
        <circle cx="8" cy="50" r="1.6" fill="#0a0703" opacity="0.55" />
        <circle cx="52" cy="44" r="1" fill="#0a0703" opacity="0.55" />
      </svg>
    );
  }
  if (kind === 'fold') {
    // dog-eared corner triangle
    return (
      <svg className="cb-stain cb-stain--fold" viewBox="0 0 36 36" width="36" height="36" aria-hidden>
        <path d="M 36 0 L 36 36 L 0 36 Z" fill="#d6c69a" />
        <path d="M 36 0 L 36 36 L 0 36 Z" fill="none" stroke="#7a5a32" strokeWidth="0.6" opacity="0.5" />
        <path d="M 22 36 L 36 22" stroke="#7a5a32" strokeWidth="0.5" opacity="0.5" />
      </svg>
    );
  }
  if (kind === 'margin') {
    return (
      <span className="cb-stain cb-stain--margin">{note}</span>
    );
  }
  return null;
}

export type { Kind as CardStainKind };
