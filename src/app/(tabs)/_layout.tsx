import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useT } from '@/i18n';
import { fonts, useTheme } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

function icon(name: IconName, focusedName: IconName) {
  return ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons name={focused ? focusedName : name} size={24} color={color} />
  );
}

export default function TabsLayout() {
  const t = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 64 + insets.bottom,
          paddingTop: 4,
          paddingBottom: insets.bottom + 4,
        },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 16 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabs.prayer, tabBarIcon: icon('time-outline', 'time') }} />
      <Tabs.Screen name="quran" options={{ title: t.tabs.quran, tabBarIcon: icon('book-outline', 'book') }} />
      <Tabs.Screen name="duas" options={{ title: t.tabs.duas, tabBarIcon: icon('heart-outline', 'heart') }} />
      <Tabs.Screen name="qibla" options={{ title: t.tabs.qibla, tabBarIcon: icon('compass-outline', 'compass') }} />
      <Tabs.Screen name="settings" options={{ title: t.tabs.settings, tabBarIcon: icon('settings-outline', 'settings') }} />
    </Tabs>
  );
}
