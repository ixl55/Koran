import { useColorScheme } from 'react-native';
import { useSettings } from '@/context/SettingsContext';

export type Palette = {
  primary: string;
  primarySoft: string;
  onPrimary: string;
  background: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  highlight: string;
  danger: string;
};

const light: Palette = {
  primary: '#0E9F6E',
  primarySoft: '#E3F5EE',
  onPrimary: '#FFFFFF',
  background: '#F7F8F7',
  card: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  textMuted: '#6B7280',
  highlight: '#FFF6D6',
  danger: '#DC2626',
};

const dark: Palette = {
  primary: '#34D399',
  primarySoft: '#123128',
  onPrimary: '#06281D',
  background: '#0B0F0E',
  card: '#151B19',
  border: '#232B28',
  text: '#F3F4F6',
  textMuted: '#9CA3AF',
  highlight: '#3A3317',
  danger: '#F87171',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 10, md: 16, lg: 24, full: 999 } as const;

export const fonts = {
  regular: 'IBMPlexSansArabic_400Regular',
  medium: 'IBMPlexSansArabic_500Medium',
  semibold: 'IBMPlexSansArabic_600SemiBold',
  bold: 'IBMPlexSansArabic_700Bold',
  quran: 'AmiriQuran_400Regular',
} as const;

export type Theme = { colors: Palette; isDark: boolean };

export function useTheme(): Theme {
  const system = useColorScheme();
  const { settings } = useSettings();
  const mode = settings.themeMode === 'system' ? system ?? 'light' : settings.themeMode;
  const isDark = mode === 'dark';
  return { colors: isDark ? dark : light, isDark };
}
