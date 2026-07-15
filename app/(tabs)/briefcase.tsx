import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EmptyState, Header, Screen } from '../../components/ui';
import { useTheme } from '../../lib/theme';

/**
 * Tab 2 — The Briefcase. AI dossiers, IEP/paperwork decoder, State
 * Navigator. Paid tier ($9/mo) — heavy machinery arrives in Phase 4
 * (Build Order Steps 11–13).
 */
export default function BriefcaseScreen() {
  const { palette } = useTheme();

  return (
    <Screen>
      <Header title="Briefcase" />
      <View style={styles.badgeRow}>
        <View style={[styles.badge, { borderColor: palette.accentSoft }]}>
          <Text style={[styles.badgeText, { color: palette.accentSoft }]}>
            $9/mo tier
          </Text>
        </View>
      </View>
      <EmptyState
        icon="document-text-outline"
        title="Upload an IEP or medical document to begin tracking deadlines."
        body="The decoder turns dense paperwork into plain English — what was approved, what was denied, and what to do next."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    paddingHorizontal: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
