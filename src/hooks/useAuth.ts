import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { isTransactionReportAuthorized } from '../utils/roles';
import type { PulseUserProfile } from '../types/auth';

interface UseAuthResult {
  session: Session | null;
  profile: PulseUserProfile | null;
  roles: string[];
  isAuthenticated: boolean;
  isAuthorized: boolean;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PulseUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadProfile = useCallback(async (authUid: string) => {
    const p = await authService.getProfile(authUid);
    setProfile(p);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const currentSession = await authService.getSession();
        if (cancelled) return;
        setSession(currentSession);
        if (currentSession) {
          await loadProfile(currentSession.user.id);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        await loadProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      await authService.signIn(email, password);
    } catch (err) {
      setAuthError(mapAuthError(err));
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const roles = profile?.roles ?? [];

  return {
    session,
    profile,
    roles,
    isAuthenticated: !!session,
    isAuthorized: isTransactionReportAuthorized(roles),
    loading,
    authError,
    signIn,
    signOut,
  };
}

function mapAuthError(err: unknown): string {
  const message = err instanceof Error ? err.message : '';
  if (/invalid login credentials/i.test(message)) {
    return 'Invalid login credentials. Please check your username and password.';
  }
  if (/fetch|network/i.test(message)) {
    return 'Unable to connect to PULSE. Please try again.';
  }
  return 'Unable to connect to PULSE. Please try again.';
}
