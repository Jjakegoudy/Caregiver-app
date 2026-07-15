import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Phase 7.1 — Backend & Database: Supabase (managed Postgres, file
 * storage, and login). Nothing self-hosted.
 *
 * Credentials come from EXPO_PUBLIC_ env vars — see .env.example.
 * Until they're set, the app runs in "unwired" mode: onboarding still
 * works (profile is stored on-device) so the chassis can be tapped
 * through on a phone before the backend exists.
 */

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url!, anonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
