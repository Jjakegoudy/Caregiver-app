import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * Phase 6 — UI/UX Tolerances.
 *
 * Dark mode (default): deep, red-shifted, zero-blue-light palette so the
 * screen is comfortable at 3am. Every dark color is built from warm
 * red/amber/brown hues — the blue channel is kept as close to zero as
 * legibility allows.
 *
 * Light mode (toggle): soft, warm off-whites for daytime use.
 *
 * Amber/orange is reserved for primary actions ONLY ("stark action
 * triggers"). Nothing else on screen may use it.
 */

export interface Palette {
  name: 'dark' | 'light';
  /** Screen background. */
  bg: string;
  /** Cards, sheets, list rows. */
  surface: string;
  /** Slightly raised surface (inputs, tab bar). */
  surfaceRaised: string;
  /** Hairline borders and separators. */
  border: string;
  /** Primary body text. */
  text: string;
  /** Secondary / muted text. */
  textMuted: string;
  /** Primary action color — amber/orange, buttons only. */
  action: string;
  /** Text/icon color drawn on top of an action-colored element. */
  onAction: string;
  /** Tab bar inactive tint. */
  tabInactive: string;
  /** Non-diagnostic pattern flags, gentle emphasis. */
  accentSoft: string;
  /** Library-only protected styling: parchment-like reading surface. */
  libraryBg: string;
  libraryText: string;
  /** Sponsored "Local Partner" boxes — shaded differently, never organic. */
  sponsoredBg: string;
  sponsoredBorder: string;
}

export const darkPalette: Palette = {
  name: 'dark',
  bg: '#171210',
  surface: '#211915',
  surfaceRaised: '#2A201A',
  border: '#3A2C22',
  text: '#F2E4D5',
  textMuted: '#A8917C',
  action: '#FFA028',
  onAction: '#231505',
  tabInactive: '#7D6A58',
  accentSoft: '#C97B4A',
  libraryBg: '#1D1713',
  libraryText: '#EFE3D0',
  sponsoredBg: '#26190F',
  sponsoredBorder: '#5A4020',
};

export const lightPalette: Palette = {
  name: 'light',
  bg: '#FAF4EA',
  surface: '#FFFCF5',
  surfaceRaised: '#F3EADC',
  border: '#E0D3BF',
  text: '#2E2318',
  textMuted: '#7A6A58',
  action: '#E07B00',
  onAction: '#FFF8ED',
  tabInactive: '#A99680',
  accentSoft: '#B4652F',
  libraryBg: '#FBF6EC',
  libraryText: '#33281B',
  sponsoredBg: '#F5E9D2',
  sponsoredBorder: '#D9C29A',
};

/** Typography: clean sans-serif for menus/UI; legible serif for the Library. */
export const fonts = {
  sans: undefined as string | undefined, // platform default sans-serif
  serif: 'serif',
};

/** Ergonomics: massive touch targets, one-handed operation. */
export const touch = {
  /** Minimum height for any tappable row/button. */
  target: 56,
  /** The Journal's central mic button diameter. */
  micButton: 132,
};

interface ThemeContextValue {
  palette: Palette;
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  palette: darkPalette,
  isDark: true,
  toggle: () => {},
});

const STORAGE_KEY = 'caregiver.theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Dark is the default — spec 6.1 — regardless of system setting.
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light') setIsDark(false);
    });
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ palette: isDark ? darkPalette : lightPalette, isDark, toggle }),
    [isDark, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
