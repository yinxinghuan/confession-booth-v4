// Mount once at the App root. SVG filters used across the game:
//   cb-ink-wobble  — slight edge wobble for stamps + carved type
//   cb-glass-grain — light noise + saturation lift for stained glass panes
//   cb-candle-glow — soft glow ring for the candle flame
//   cb-paper-rough — torn-paper edge wobble for receipts

export default function SvgFilters() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden>
      <defs>
        <filter id="cb-ink-wobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.4" />
        </filter>
        <filter id="cb-paper-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="2.2" />
        </filter>
        <filter id="cb-glass-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" />
          <feColorMatrix
            values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0.18 0"
          />
          <feComposite in2="SourceGraphic" operator="in" />
          <feComposite in="SourceGraphic" operator="over" />
        </filter>
        <filter id="cb-candle-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="6" />
          <feColorMatrix
            values="
              1 0 0 0 0
              0 0.7 0 0 0
              0 0 0.3 0 0
              0 0 0 1.2 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
