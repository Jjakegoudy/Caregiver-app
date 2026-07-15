import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChildProfile, loadProfile } from '../lib/profile';
import { ThemeProvider, useTheme } from '../lib/theme';

interface ProfileContextValue {
  profile: ChildProfile | null;
  ready: boolean;
  setProfile: (p: ChildProfile | null) => void;
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  ready: false,
  setProfile: () => {},
});

export function useProfile() {
  return useContext(ProfileContext);
}

function RootNavigator() {
  const { palette, isDark } = useTheme();
  const { ready, profile } = useProfile();

  // Hold rendering one frame until the stored profile is read, so a
  // returning parent never flashes the onboarding screen.
  if (!ready) return null;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.bg },
        }}
      >
        <Stack.Protected guard={profile !== null}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={profile === null}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadProfile()
      .then(setProfile)
      .finally(() => setReady(true));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ProfileContext.Provider value={{ profile, ready, setProfile }}>
          <RootNavigator />
        </ProfileContext.Provider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
