import { getLocales } from 'expo-localization';
import { useSettings } from '@/context/SettingsContext';
import ar, { type Strings } from './ar';
import { type Language } from './digits';
import en from './en';

export type { Language } from './digits';

const dictionaries: Record<Language, Strings> = { ar, en };

export function getDeviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode;
  return code === 'en' ? 'en' : 'ar';
}

export function getStrings(lang: Language): Strings {
  return dictionaries[lang];
}

export function useT(): Strings {
  const { settings } = useSettings();
  return dictionaries[settings.language];
}

export { formatAyahCount, formatNumber, toArabicDigits } from './digits';
