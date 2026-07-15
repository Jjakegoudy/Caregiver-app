import AsyncStorage from '@react-native-async-storage/async-storage';
import { stateForZip } from './zip-to-state';

/**
 * Phase 5.1 — User & Child Profile, plus the onboarding contract from
 * Phase 2.1: exactly three fields, no more.
 *
 * The profile is written locally the moment onboarding completes so the
 * parent lands on the Journal with zero waiting. When Supabase is
 * configured it is synced up on the next launch (Phase 1, Step 1 wiring).
 */

export interface ChildProfile {
  childName: string;
  childAge: string;
  /** Open free text: "What's on your mind?" */
  onboardingContext: string;
  /** The single field that makes the app nationwide. */
  locationZip: string;
  /** Derived silently from locationZip — never asked as a question. */
  stateCode: string | null;
  createdAt: string;
}

const STORAGE_KEY = 'caregiver.profile';

export async function loadProfile(): Promise<ChildProfile | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as ChildProfile) : null;
}

export async function saveProfile(input: {
  childName: string;
  childAge: string;
  onboardingContext: string;
  locationZip: string;
}): Promise<ChildProfile> {
  const profile: ChildProfile = {
    ...input,
    stateCode: stateForZip(input.locationZip),
    createdAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
