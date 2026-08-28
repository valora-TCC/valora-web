import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';

const IDLE_TIMEOUT_MS = 60 * 60 * 1000;
const ACTIVITY_THROTTLE_MS = 30_000;
const LAST_ACTIVITY_KEY = 'valora-last-activity';

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'] as const;

function getLastActivity(): number {
  const stored = sessionStorage.getItem(LAST_ACTIVITY_KEY);
  return stored ? Number(stored) : Date.now();
}

function touchActivity() {
  sessionStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

function clearActivity() {
  sessionStorage.removeItem(LAST_ACTIVITY_KEY);
}

export function useIdleLogout() {
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (!session) {
      clearActivity();
      return;
    }

    touchActivity();

    let timeoutId: ReturnType<typeof setTimeout>;
    let lastTouchAt = 0;

    const scheduleLogout = () => {
      clearTimeout(timeoutId);
      const elapsed = Date.now() - getLastActivity();
      const remaining = IDLE_TIMEOUT_MS - elapsed;

      if (remaining <= 0) {
        void supabase.auth.signOut();
        return;
      }

      timeoutId = setTimeout(() => {
        void supabase.auth.signOut();
      }, remaining);
    };

    const onActivity = () => {
      const now = Date.now();
      if (now - lastTouchAt < ACTIVITY_THROTTLE_MS) return;
      lastTouchAt = now;
      touchActivity();
      scheduleLogout();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        scheduleLogout();
      }
    };

    scheduleLogout();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity);
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [session]);
}
