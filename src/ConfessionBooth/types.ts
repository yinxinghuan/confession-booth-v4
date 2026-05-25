export type Verdict = 'ABSOLVED' | 'DENIED' | 'DEFERRED';

export interface Confession {
  id: string;
  sin: string; // what the player typed
  operatorReply: string; // multi-line, includes asides
  penance: string;
  quip: string; // 1-line wall-card quip
  verdict: Verdict;
  ticketNumber: string; // "#4827"
  callDuration: string; // "00:42"
  createdAt: number;
  // v4 additions — public festival edition
  /** Aigram user id who confessed (null = guest / fallback) */
  userId?: string;
  userName?: string;
  userAvatarUrl?: string;
  /** Theme week index (0-based, cycles through THEMES) */
  weekIndex?: number;
}

export type Phase = 'booth' | 'typing' | 'processing' | 'absolution' | 'wall';

export type ProcessingStage =
  | 'ringing'
  | 'hold'
  | 'connected'
  | 'cross-ref'
  | 'stamping';
