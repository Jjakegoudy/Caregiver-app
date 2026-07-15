import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { touch, useTheme } from '../lib/theme';

/**
 * Shared building blocks. Ergonomics per Phase 6.2: massive touch
 * targets, primary controls reachable one-handed.
 */

export function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        { flex: 1, backgroundColor: palette.bg, paddingTop: insets.top },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Screen title row with the light/dark toggle always available. */
export function Header({ title }: { title: string }) {
  const { palette, isDark, toggle } = useTheme();
  return (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: palette.text }]}>{title}</Text>
      <Pressable
        onPress={toggle}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={({ pressed }) => [
          styles.themeToggle,
          { backgroundColor: palette.surfaceRaised, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Ionicons
          name={isDark ? 'sunny-outline' : 'moon-outline'}
          size={22}
          color={palette.textMuted}
        />
      </Pressable>
    </View>
  );
}

/** The only element allowed to wear the amber action color. */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.primaryButton,
        {
          backgroundColor: palette.action,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.primaryButtonLabel, { color: palette.onAction }]}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Centered guidance when a tab has no content yet — spec 6.4. */
export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}) {
  const { palette } = useTheme();
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={44} color={palette.textMuted} />
      <Text style={[styles.emptyTitle, { color: palette.text }]}>{title}</Text>
      <Text style={[styles.emptyBody, { color: palette.textMuted }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  } as TextStyle,
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    minHeight: touch.target,
    borderRadius: touch.target / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  primaryButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
