// Shared top-of-screen navigation row. Consistent across every screen:
//   - left:  meta strip OR back button
//   - right: optional jump button (yellow pill with → arrow)
//
// Identical position / size / shadow on every screen so the user always
// knows where these things live.

interface Props {
  /** Left side: render either a back button or the meta text */
  left?:
    | { kind: 'meta'; text: string }
    | { kind: 'back'; label: string; onBack: () => void };
  /** Right side: optional jump button */
  right?: { label: string; onClick: () => void };
}

export default function TopNav({ left, right }: Props) {
  return (
    <header className="cb4-nav">
      {left?.kind === 'meta' && (
        <div className="cb4-nav__meta">
          <span className="cb4-nav__meta-dot" />
          <span className="cb4-nav__meta-text">{left.text}</span>
        </div>
      )}
      {left?.kind === 'back' && (
        <button
          type="button"
          className="cb4-nav__back"
          onPointerDown={(e) => { e.preventDefault(); left.onBack(); }}
        >
          <span className="cb4-nav__arrow">←</span>
          <span>{left.label}</span>
        </button>
      )}

      {right && (
        <button
          type="button"
          className="cb4-nav__jump"
          onPointerDown={(e) => { e.preventDefault(); right.onClick(); }}
        >
          <span>{right.label}</span>
          <span className="cb4-nav__arrow">→</span>
        </button>
      )}
    </header>
  );
}
