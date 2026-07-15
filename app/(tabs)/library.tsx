import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { fonts, useTheme } from '../../lib/theme';

/**
 * Tab 3 — The Library. The 30-chapter manuscript, browsable and indexed.
 * Free forever — the core trust mechanism.
 *
 * Protected styling (spec 6.3): serif body text on its own reading
 * surface, never shared with the Board or Tips. The manuscript itself is
 * imported in Phase 2, Step 7; this screen already wears the styling so
 * the distinction is visible from day one.
 */
export default function LibraryScreen() {
  const { palette } = useTheme();

  return (
    <Screen>
      <Header title="Library" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View
          style={[
            styles.page,
            { backgroundColor: palette.libraryBg, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.chapterLabel, { color: palette.textMuted }]}>
            THE RELATED CONDITIONS LIBRARY
          </Text>
          <Text style={[styles.title, { color: palette.libraryText }]}>
            A finished book, not a wiki.
          </Text>
          <Text style={[styles.body, { color: palette.libraryText }]}>
            The full manuscript loads here in Phase 2, Step 7 — thirty
            chapters, browsable and searchable, free forever.
          </Text>
          <Text style={[styles.body, { color: palette.libraryText }]}>
            This page keeps its own protected styling: a serif face on a
            quiet reading surface. Community content never wears this look,
            so you always know when you are reading the authoritative
            reference and when you are reading another parent&apos;s
            experience.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
  },
  page: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    gap: 14,
  },
  chapterLabel: {
    fontSize: 12,
    letterSpacing: 1.4,
    fontWeight: '600',
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 26,
    lineHeight: 34,
  },
  body: {
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 27,
  },
});
