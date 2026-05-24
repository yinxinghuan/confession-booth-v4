import type { ReactNode } from 'react';

// Torn-paper receipt for absolution + wall cards. Cream paper, blue ruled
// lines, jagged top + bottom edges. Layout is just a styled <section>;
// the children handle their own internal composition.

interface Props {
  children: ReactNode;
  className?: string;
  tilt?: number; // degrees of subtle rotation, default 0
  small?: boolean; // narrower padding for wall cards
}

export default function Receipt({ children, className, tilt = 0, small }: Props) {
  return (
    <section
      className={`cb-receipt ${small ? 'cb-receipt--small' : ''} ${className ?? ''}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="cb-receipt__torn cb-receipt__torn--top" aria-hidden />
      <div className="cb-receipt__rules" aria-hidden />
      <div className="cb-receipt__body">{children}</div>
      <div className="cb-receipt__torn cb-receipt__torn--bot" aria-hidden />
    </section>
  );
}
