import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from './_layout';
import { PrimaryButton } from '../components/ui';
import { saveProfile } from '../lib/profile';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { useTheme } from '../lib/theme';
import { isValidZip, stateForZip } from '../lib/zip-to-state';

/**
 * Phase 2.1 — Soft Onboarding. Three fields only, then straight to the
 * Journal. The zip code silently resolves the family's state; there is no
 * state question and never will be.
 *
 * SSO (Google/Apple via Supabase) activates as soon as credentials exist
 * in .env. Until then the profile lives on-device so the first entry is
 * never blocked by backend setup — traction, not friction.
 */
export default function OnboardingScreen() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const { setProfile } = useProfile();

  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [context, setContext] = useState('');
  const [zip, setZip] = useState('');

  const detectedState = useMemo(
    () => (isValidZip(zip) ? stateForZip(zip) : null),
    [zip],
  );

  const canStart = childName.trim().length > 0 && isValidZip(zip);

  const handleSso = async (provider: 'google' | 'apple') => {
    const supabase = getSupabase();
    if (!supabase) {
      Alert.alert(
        'Sign-in connects later',
        'Google and Apple sign-in switch on once Supabase credentials are added (Build Order, Step 1). Until then everything you enter stays on this phone.',
      );
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: 'caregiver://auth-callback' },
    });
    if (error) Alert.alert('Sign-in failed', error.message);
  };

  const handleStart = async () => {
    const profile = await saveProfile({
      childName: childName.trim(),
      childAge: childAge.trim(),
      onboardingContext: context.trim(),
      locationZip: zip.trim(),
    });
    setProfile(profile); // flips the protected route → lands on the Journal
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: palette.surfaceRaised,
      borderColor: palette.border,
      color: palette.text,
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: palette.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.welcome, { color: palette.text }]}>
          You found it.
        </Text>
        <Text style={[styles.tagline, { color: palette.textMuted }]}>
          One place for everything — your words, their patterns, the
          paperwork, and what to do next.
        </Text>

        <View style={styles.ssoRow}>
          <SsoButton
            icon="logo-google"
            label="Google"
            onPress={() => handleSso('google')}
          />
          <SsoButton
            icon="logo-apple"
            label="Apple"
            onPress={() => handleSso('apple')}
          />
        </View>
        {!isSupabaseConfigured && (
          <Text style={[styles.devNote, { color: palette.textMuted }]}>
            Accounts switch on with the backend — for now, everything stays
            on this phone.
          </Text>
        )}

        <View style={styles.fields}>
          <Field label="Child's name & age" palette={palette}>
            <View style={styles.nameAgeRow}>
              <TextInput
                style={[...inputStyle, { flex: 3 }]}
                placeholder="Name"
                placeholderTextColor={palette.textMuted}
                value={childName}
                onChangeText={setChildName}
                autoCapitalize="words"
              />
              <TextInput
                style={[...inputStyle, { flex: 1 }]}
                placeholder="Age"
                placeholderTextColor={palette.textMuted}
                value={childAge}
                onChangeText={setChildAge}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
          </Field>

          <Field label="What's on your mind?" palette={palette}>
            <TextInput
              style={[...inputStyle, styles.multiline]}
              placeholder="A diagnosis, a suspicion, or just a concern — say it however it comes out."
              placeholderTextColor={palette.textMuted}
              value={context}
              onChangeText={setContext}
              multiline
            />
          </Field>

          <Field label="Zip code" palette={palette}>
            <TextInput
              style={inputStyle}
              placeholder="e.g. 43004"
              placeholderTextColor={palette.textMuted}
              value={zip}
              onChangeText={setZip}
              keyboardType="number-pad"
              maxLength={5}
            />
            {detectedState && (
              <Text style={[styles.stateNote, { color: palette.accentSoft }]}>
                We&apos;ll quietly load {detectedState}&apos;s programs and
                paperwork for you.
              </Text>
            )}
          </Field>
        </View>

        <PrimaryButton
          label="Start journaling"
          onPress={handleStart}
          disabled={!canStart}
        />

        {/* Free vs paid banner — informs, never blocks (spec 2.1). */}
        <View
          style={[
            styles.tierBanner,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.tierText, { color: palette.textMuted }]}>
            The Journal, Library, Compass, and Board are free. The Briefcase —
            AI dossiers, paperwork decoding, deadline tracking — is $9/mo,
            whenever you&apos;re ready. No trial clocks.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  palette,
  children,
}: {
  label: string;
  palette: ReturnType<typeof useTheme>['palette'];
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: palette.text }]}>{label}</Text>
      {children}
    </View>
  );
}

function SsoButton({
  icon,
  label,
  onPress,
}: {
  icon: 'logo-google' | 'logo-apple';
  label: string;
  onPress: () => void;
}) {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${label}`}
      style={({ pressed }) => [
        styles.ssoButton,
        {
          backgroundColor: palette.surfaceRaised,
          borderColor: palette.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={palette.text} />
      <Text style={[styles.ssoLabel, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    gap: 18,
  },
  welcome: {
    fontSize: 32,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: -8,
  },
  ssoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ssoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
  },
  ssoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  devNote: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: -10,
  },
  fields: {
    gap: 18,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  nameAgeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 17,
  },
  multiline: {
    minHeight: 110,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  stateNote: {
    fontSize: 14,
  },
  tierBanner: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  tierText: {
    fontSize: 13,
    lineHeight: 19,
  },
});
