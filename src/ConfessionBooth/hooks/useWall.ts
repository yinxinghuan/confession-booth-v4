// The Wall of (Mostly) Forgiven. Pulls 6 most-recent users' latest save
// rows and yields their newest confession — anonymized, no userId, no
// avatar (per design: complete anonymity).

import { useCallback, useEffect, useState } from 'react';
import {
  callAigramAPI,
  isInAigram,
  type AigramResponse,
} from '@shared/runtime/bridge';
import { getGameUuid } from '@shared/runtime/game-id';
import type { Confession } from '../types';

interface SaveRow {
  user_id: string;
  time?: string;
  resource_data?: string;
}

export interface ConfessionSave {
  confessions: Confession[];
}

export interface UseWall {
  entries: Confession[]; // anonymized — userId stripped
  loaded: boolean;
  refresh: () => void;
}

export function useWall(): UseWall {
  const [entries, setEntries] = useState<Confession[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    const sessionId = getGameUuid();
    if (!isInAigram || !sessionId) {
      setLoaded(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await callAigramAPI<AigramResponse<SaveRow[]>>(
          `/note/aigram/ai/game/get/data/list?session_id=${encodeURIComponent(sessionId)}`,
          'GET',
        );
        const rows = Array.isArray(res?.data) ? res.data : [];
        const parsed: Confession[] = [];
        for (const row of rows) {
          if (!row.resource_data) continue;
          try {
            const save = JSON.parse(row.resource_data) as ConfessionSave;
            const c = save.confessions?.[0];
            if (c && c.sin && c.operatorReply) parsed.push(c);
          } catch {
            /* skip corrupt row */
          }
          if (parsed.length >= 6) break;
        }
        if (cancelled) return;
        setEntries(parsed);
      } catch {
        if (!cancelled) setEntries([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return { entries, loaded, refresh };
}
