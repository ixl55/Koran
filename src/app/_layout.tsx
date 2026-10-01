import { AmiriQuran_400Regular } from '@expo-google-fonts/amiri-quran';
import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { syncDirectionOnLaunch } from '@/lib/direction';
import { configureNotifications, rescheduleAdhan } from '@/lib/notifications';
import { fonts, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});
configureNotifications();

function RootNavigator() {
  const { settings, ready } = useSettings();
  const { colors, isDark } = useTheme();
  const [fontsLoaded] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
    AmiriQuran_400Regular,
  });

  useEffect(() => {
    if (ready) syncDirectionOnLaunch(settings.language);
    // Only on launch; language changes from settings handle their own reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (ready && fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [ready, fontsLoaded]);

  // Keep the rolling window of adhan notifications fresh whenever relevant settings change.
  const { location, method, madhab, notifications, language } = settings;
  useEffect(() => {
    if (!ready) return;
    rescheduleAdhan(settings).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, location, method, madhab, notifications, language]);

  if (!ready || !fontsLoaded) return null;

  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontFamily: fonts.bold, color: colors.text },
          headerTintColor: colors.primary,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="surah/[id]" />
        <Stack.Screen name="duas/[category]" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <RootNavigator />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
