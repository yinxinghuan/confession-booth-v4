// Small flickering yellow-rose neon sign that reads "1-800-CONFESS"
// — positioned at the booth screen's bottom-left corner like a roadside
// diner advert leaking into the church. The sign also doubles as a
// secondary "language reveal": the joke that this confessional is run
// out of a call center.

interface Props {
  className?: string;
}

export default function NeonSign({ className }: Props) {
  return (
    <div className={`cb-neon ${className ?? ''}`} aria-hidden>
      <svg viewBox="0 0 220 90" width="200" height="80" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="cb-neon-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4" result="g1" />
            <feMerge>
              <feMergeNode in="g1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <text
          x="110"
          y="38"
          textAnchor="middle"
          fontFamily="'Big Shoulders Stencil Display', 'Cormorant Garamond', serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="0.12em"
          fill="#ffba3a"
          filter="url(#cb-neon-glow)"
        >
          1-800-CONFESS
        </text>
        <text
          x="110"
          y="64"
          textAnchor="middle"
          fontFamily="'IBM Plex Mono', monospace"
          fontWeight="700"
          fontSize="9"
          letterSpacing="0.32em"
          fill="#ec2c64"
          filter="url(#cb-neon-glow)"
        >
          OPEN 24 HRS
        </text>
        {/* underline glow rules */}
        <line x1="20" y1="76" x2="200" y2="76" stroke="#ec2c64" strokeWidth="1.4" filter="url(#cb-neon-glow)" />
      </svg>
    </div>
  );
}
