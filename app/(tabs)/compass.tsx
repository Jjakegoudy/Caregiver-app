import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState, Header, Screen } from '../../components/ui';
import { useTheme } from '../../lib/theme';

const FILTERS = ['Sensory Load', 'Cost', 'Age Range', 'Learning Value'];

/**
 * Tab 4 — The Compass (Activity Finder). Sensory load, cost, age filters
 * plus a sponsored row. Free tier.
 *
 * The sponsored "Local Partners" row is boxed, shaded differently, and
 * badged — never inside or styled like organic results (spec 3.3 / 6.3).
 * The styling ships now so the separation rule is locked in before any
 * real content or partners exist.
 */
export default function CompassScreen() {
  const { palette } = useTheme();

  return (
    <Screen>
      <Header title="Compass" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <View
              key={f}
              style={[
                styles.filterChip,
                {
                  backgroundColor: palette.surfaceRaised,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.filterText, { color: palette.textMuted }]}>
                {f}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.emptyWrap}>
          <EmptyState
            icon="compass-outline"
            title="Activities near you land here."
            body="AI-curated finds and other parents' recommendations, filtered by what your child can actually enjoy today. Arrives in Phase 5, Step 15."
          />
        </View>

        <View
          style={[
            styles.sponsoredBox,
            {
              backgroundColor: palette.sponsoredBg,
              borderColor: palette.sponsoredBorder,
            },
          ]}
        >
          <Text style={[styles.sponsoredBadge, { color: palette.textMuted }]}>
            SPONSORED PARTNER
          </Text>
          <Text style={[styles.sponsoredBody, { color: palette.textMuted }]}>
            Local partners appear only in this clearly labeled box — never
            mixed into the results above.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    gap: 20,
    flexGrow: 1,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyWrap: {
    flex: 1,
    minHeight: 220,
  },
  sponsoredBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  sponsoredBadge: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  sponsoredBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
