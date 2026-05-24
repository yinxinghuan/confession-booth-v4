// Ticket numbers, call durations, soul-counter.

export function newTicketNumber(): string {
  // 4-digit prefix + suffix, e.g. "#4827-7"
  const a = 1000 + Math.floor(Math.random() * 9000);
  const b = Math.floor(Math.random() * 10);
  return `#${a}-${b}`;
}

export function fakeCallDuration(): string {
  // 14–93 seconds, mm:ss
  const total = 14 + Math.floor(Math.random() * 80);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function newConfessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
