// Flickering fluorescent tube light — replaces a candle on the v2 booth
// to dial the church back and push the workplace/call-center feel. The
// tube hums with a sickly white-green and flickers occasionally.

interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export default function Fluorescent({ className, width = 200, height = 16 }: Props) {
  return (
    <svg
      className={`cb-fluo ${className ?? ''}`}
      viewBox="0 0 200 16"
      width={width}
      height={height}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="cb-fluo-tube" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dff5e0" />
          <stop offset="50%" stopColor="#b8f5cd" />
          <stop offset="100%" stopColor="#7ad8a4" />
        </linearGradient>
        <filter id="cb-fluo-glow" x="-20%" y="-300%" width="140%" height="700%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {/* outer glow */}
      <rect x="2" y="2" width="196" height="12" rx="6" fill="#b8f5cd" filter="url(#cb-fluo-glow)" opacity="0.6" />
      {/* tube body */}
      <rect x="6" y="4" width="188" height="8" rx="4" fill="url(#cb-fluo-tube)" className="cb-fluo__body" />
      {/* end caps */}
      <rect x="0" y="2" width="6" height="12" fill="#1a0f08" />
      <rect x="194" y="2" width="6" height="12" fill="#1a0f08" />
      {/* inner core line */}
      <rect x="10" y="6.5" width="180" height="1.6" fill="#ffffff" opacity="0.7" />
    </svg>
  );
}
