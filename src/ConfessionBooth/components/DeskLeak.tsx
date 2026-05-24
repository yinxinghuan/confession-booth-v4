// What the player sees BEHIND the brass grille — the operator's desk
// leaking through the lattice. Bright enough to read clearly through the
// grille holes. Composed of:
//   - CRT-screen sickly green glow + scanline overlay
//   - desk lamp silhouette with halo
//   - steaming coffee cup
//   - cassette tape on the desk (1980s call center reference)
//   - alarm clock (the operator's gonna clock out)
//   - phone log book (a binder with tab dividers)
//   - sticky Post-It with the operator's scribble
//   - thin slice of yellow neon "1-800" reflection
//   - headset cord curling across

interface Props {
  className?: string;
  noteSeed?: number;
}

const NOTES = [
  'BACK\nIN 5',
  '☕ refill',
  'CALL #4827\nsounds\ngenuine',
  'tell\nmavis',
  'Karen\n1pm',
  'kid asleep\nno yelling',
];

export default function DeskLeak({ className, noteSeed = 0 }: Props) {
  const note = NOTES[noteSeed % NOTES.length];
  return (
    <div className={`cb-leak ${className ?? ''}`} aria-hidden>
      {/* CRT screensaver glow */}
      <div className="cb-leak__crt">
        <div className="cb-leak__crt-scan" />
      </div>

      {/* Desk lamp silhouette w/ pooled light on desk */}
      <svg className="cb-leak__lamp" viewBox="0 0 90 110" aria-hidden>
        <defs>
          <radialGradient id="cb-lamp-glow" cx="50%" cy="30%" r="55%">
            <stop offset="0%" stopColor="#ffd97a" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ffba3a" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffba3a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="45" cy="22" rx="42" ry="26" fill="url(#cb-lamp-glow)" />
        {/* Lampshade */}
        <path d="M 18 28 Q 45 -2 72 28 L 64 44 L 26 44 Z" fill="#1a0f08" />
        <path d="M 26 44 L 64 44 L 60 48 L 30 48 Z" fill="#3d2818" />
        {/* Arm */}
        <path d="M 45 48 L 45 78 L 16 100" stroke="#1a0f08" strokeWidth="4" fill="none" strokeLinejoin="round" />
        <circle cx="16" cy="100" r="6" fill="#1a0f08" />
      </svg>

      {/* Coffee cup with steam */}
      <svg className="cb-leak__cup" viewBox="0 0 68 82" aria-hidden>
        {/* Steam */}
        <g className="cb-leak__steam" stroke="#f3e4c2" strokeWidth="1.6" fill="none" opacity="0.6" strokeLinecap="round">
          <path d="M 20 30 Q 14 20 20 8" />
          <path d="M 34 32 Q 28 22 34 4" />
          <path d="M 48 30 Q 42 20 48 8" />
        </g>
        {/* Cup body */}
        <path d="M 14 38 L 18 74 Q 18 78 22 78 L 46 78 Q 50 78 50 74 L 54 38 Z" fill="#1a0f08" />
        {/* Rim highlight */}
        <ellipse cx="34" cy="38" rx="20" ry="3" fill="#3d2818" />
        {/* Handle */}
        <path d="M 54 46 Q 64 48 62 58 Q 60 64 52 64" stroke="#1a0f08" strokeWidth="3" fill="none" />
        {/* Saucer */}
        <ellipse cx="34" cy="80" rx="22" ry="3" fill="#3d2818" />
      </svg>

      {/* Cassette tape on the desk — peeking corner */}
      <svg className="cb-leak__cassette" viewBox="0 0 96 64" aria-hidden>
        <rect x="2" y="2" width="92" height="60" rx="3" fill="#1a0f08" stroke="#3d2818" strokeWidth="1.5" />
        {/* Label */}
        <rect x="10" y="8" width="76" height="22" rx="1" fill="#efe4c8" />
        <line x1="14" y1="14" x2="78" y2="14" stroke="#7a5a32" strokeWidth="0.6" />
        <line x1="14" y1="20" x2="78" y2="20" stroke="#7a5a32" strokeWidth="0.6" />
        <text x="48" y="26" textAnchor="middle" fontFamily="'Caveat', cursive" fontSize="11" fill="#1a0f08">
          MIX '92
        </text>
        {/* Reels */}
        <circle cx="28" cy="46" r="9" fill="#3d2818" stroke="#fce6a3" strokeWidth="0.6" />
        <circle cx="28" cy="46" r="3" fill="#a87e3a" />
        <circle cx="68" cy="46" r="9" fill="#3d2818" stroke="#fce6a3" strokeWidth="0.6" />
        <circle cx="68" cy="46" r="3" fill="#a87e3a" />
        {/* Spool teeth */}
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <line key={a} x1="28" y1="46" x2={28 + Math.cos((a * Math.PI) / 180) * 8} y2={46 + Math.sin((a * Math.PI) / 180) * 8} stroke="#fce6a3" strokeWidth="0.6" />
        ))}
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <line key={`b-${a}`} x1="68" y1="46" x2={68 + Math.cos((a * Math.PI) / 180) * 8} y2={46 + Math.sin((a * Math.PI) / 180) * 8} stroke="#fce6a3" strokeWidth="0.6" />
        ))}
      </svg>

      {/* Alarm clock — desk clock with bells on top */}
      <svg className="cb-leak__clock" viewBox="0 0 70 86" aria-hidden>
        {/* Bells */}
        <ellipse cx="14" cy="14" rx="8" ry="6" fill="#1a0f08" />
        <ellipse cx="56" cy="14" rx="8" ry="6" fill="#1a0f08" />
        {/* Striker hammer */}
        <path d="M 22 12 L 48 12" stroke="#1a0f08" strokeWidth="2" />
        {/* Body */}
        <circle cx="35" cy="50" r="28" fill="#1a0f08" stroke="#3d2818" strokeWidth="2" />
        <circle cx="35" cy="50" r="24" fill="#efe4c8" />
        {/* Hands at 3:47 — late-shift feel */}
        <line x1="35" y1="50" x2="35" y2="33" stroke="#1a0f08" strokeWidth="2" strokeLinecap="round" />
        <line x1="35" y1="50" x2="46" y2="56" stroke="#1a0f08" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="35" cy="50" r="2" fill="#1a0f08" />
        {/* Foot */}
        <rect x="28" y="80" width="14" height="4" fill="#1a0f08" />
      </svg>

      {/* Phone log binder peeking from corner */}
      <svg className="cb-leak__binder" viewBox="0 0 88 60" aria-hidden>
        <rect x="0" y="0" width="88" height="60" fill="#8a1a1a" stroke="#1a0f08" strokeWidth="1" />
        {/* Spine rings */}
        <circle cx="6" cy="14" r="3" fill="#3d2818" stroke="#0a0703" strokeWidth="0.5" />
        <circle cx="6" cy="30" r="3" fill="#3d2818" stroke="#0a0703" strokeWidth="0.5" />
        <circle cx="6" cy="46" r="3" fill="#3d2818" stroke="#0a0703" strokeWidth="0.5" />
        {/* Tab dividers sticking out the right */}
        <rect x="78" y="8" width="14" height="10" fill="#f4ce64" />
        <rect x="78" y="22" width="14" height="10" fill="#7ad8a4" />
        <rect x="78" y="36" width="14" height="10" fill="#ec2c64" />
        {/* Cover label */}
        <text x="48" y="34" textAnchor="middle" fontFamily="'Big Shoulders Stencil Display', monospace" fontWeight="900" fontSize="9" fill="#fce6a3" letterSpacing="0.2em">
          LOG
        </text>
      </svg>

      {/* Yellow neon "1-800" reflection — small angled */}
      <div className="cb-leak__neon">
        <span>1-800</span>
        <span>CONFESS</span>
      </div>

      {/* Post-it (the BACK IN 5 variant) */}
      <div className="cb-leak__postit">
        {note.split('\n').map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </div>

      {/* Headset coiled cord */}
      <svg className="cb-leak__cord" viewBox="0 0 240 80" aria-hidden preserveAspectRatio="none">
        <path
          d="M -10 40 Q 30 12 50 30 Q 70 50 90 28 Q 110 8 130 30 Q 150 52 170 32 Q 190 14 210 32 Q 230 50 250 32"
          stroke="#0a0703"
          strokeWidth="2.4"
          fill="none"
          opacity="0.78"
        />
      </svg>
    </div>
  );
}
