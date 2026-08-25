import { supabase } from '../lib/supabase';
import type { PulseUserProfile } from '../types/auth';

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /** Looks up the PULSE profile/roles for the authenticated user via auth_uid -> app_users. */
  async getProfile(authUid: string): Promise<PulseUserProfile | null> {
    const { data, error } = await supabase
      .from('app_users')
      .select('id, auth_uid, email, display_name, roles')
      .eq('auth_uid', authUid)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      authUid: data.auth_uid,
      email: data.email,
      displayName: data.display_name,
      roles: data.roles ?? [],
    };
  },
};
