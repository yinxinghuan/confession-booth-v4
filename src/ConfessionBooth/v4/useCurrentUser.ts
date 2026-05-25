// Pull the current Aigram user (avatar + name) for the new festival edition
// where confessions are PUBLIC (not anonymous). Falls back to a "STAGE NAME"
// when not inside Aigram (dev/preview).

import { useEffect, useState } from 'react';
import { callAigramAPI, isInAigram, telegramId, type AigramResponse } from '@shared/runtime/bridge';

export interface UserProfile {
  userId: string;
  name: string;
  avatarUrl?: string;
}

const FALLBACK: UserProfile = {
  userId: 'guest',
  name: 'Festival Guest',
};

export function useCurrentUser(): { profile: UserProfile | null; loaded: boolean } {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isInAigram || !telegramId) {
      setProfile(FALLBACK);
      setLoaded(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await callAigramAPI<AigramResponse<{ name?: string; head_url?: string }>>(
          `/note/telegram/user/get/info/by/telegram_id?telegram_id=${encodeURIComponent(telegramId)}`,
          'GET',
        );
        if (cancelled) return;
        setProfile({
          userId: telegramId,
          name: res?.data?.name || 'Anonymous',
          avatarUrl: res?.data?.head_url,
        });
      } catch {
        if (!cancelled) setProfile({ userId: telegramId, name: 'Anonymous' });
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, loaded };
}

/** Fetch a peer user's profile (for wall cards). */
export async function fetchPeerProfile(userId: string): Promise<UserProfile | null> {
  if (!isInAigram || !userId || userId === 'guest') return null;
  try {
    const res = await callAigramAPI<AigramResponse<{ name?: string; head_url?: string }>>(
      `/note/telegram/user/get/info/by/telegram_id?telegram_id=${encodeURIComponent(userId)}`,
      'GET',
    );
    return {
      userId,
      name: res?.data?.name || 'Anonymous',
      avatarUrl: res?.data?.head_url,
    };
  } catch {
    return null;
  }
}
