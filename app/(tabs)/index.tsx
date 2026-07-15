import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useProfile } from '../_layout';
import { Header, Screen } from '../../components/ui';
import { touch, useTheme } from '../../lib/theme';

/**
 * Tab 1 — The Journal (Home). Default screen, massive central mic button,
 * chronological logs. Free tier (capped storage).
 *
 * Phase 1 scope: the button and empty state exist and are tappable.
 * Recording → Whisper → transcript lands in Phase 2 (Build Order Steps
 * 4–6); the button currently explains that, so nothing on screen is a
 * dead end.
 */
export default function JournalScreen() {
  const { palette } = useTheme();
  const { profile } = useProfile();

  const firstName = profile?.childName?.split(' ')[0];

  return (
    <Screen>
      <Header title="Journal" />
      {firstName ? (
        <Text style={[styles.subtitle, { color: palette.textMuted }]}>
          {firstName}&apos;s log
        </Text>
      ) : null}

      <View style={styles.logArea}>
        <Text style={[styles.emptyTitle, { color: palette.text }]}>
          Tap the stark button to log your first entry.
        </Text>
        <Text style={[styles.emptyBody, { color: palette.textMuted }]}>
          Speak naturally.
        </Text>
      </View>

      {/* Bottom third of the screen — one-handed reach. */}
      <View style={styles.micArea}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start a voice journal entry"
          onPress={() =>
            Alert.alert(
              'Almost wired',
              'Voice recording connects in Phase 2 (Steps 4–6): mic → Whisper → your words saved here.',
            )
          }
          style={({ pressed }) => [
            styles.micButton,
            {
              backgroundColor: palette.action,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
        >
          <Ionicons name="mic" size={56} color={palette.onAction} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 15,
    paddingHorizontal: 20,
    marginTop: -8,
  },
  logArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 44,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  emptyBody: {
    fontSize: 17,
    textAlign: 'center',
  },
  micArea: {
    alignItems: 'center',
    paddingBottom: 36,
  },
  micButton: {
    width: touch.micButton,
    height: touch.micButton,
    borderRadius: touch.micButton / 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
});
