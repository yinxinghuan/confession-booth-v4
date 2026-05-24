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
}

export type Phase = 'booth' | 'typing' | 'processing' | 'absolution' | 'wall';

export type ProcessingStage =
  | 'ringing'
  | 'hold'
  | 'connected'
  | 'cross-ref'
  | 'stamping';
