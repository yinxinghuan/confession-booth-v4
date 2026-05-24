// Top mono-meta strip — "ALTERU CONFESSIONAL · LINE 7 · OPERATOR ON DUTY"
// Brass underline. Used across every screen.

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function MetaStrip({ children, className }: Props) {
  return (
    <div className={`cb-meta ${className ?? ''}`}>
      <span className="cb-meta__dot" aria-hidden />
      <span className="cb-meta__text">{children}</span>
    </div>
  );
}
