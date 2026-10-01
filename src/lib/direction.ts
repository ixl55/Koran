import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { DevSettings, I18nManager, Platform } from 'react-native';
import type { Language } from '@/i18n';

/**
 * Aligns the layout direction with the UI language. Native RTL changes only apply after a
 * reload, so `reload` is used when the user switches language from settings.
 */
export function applyDirection(lang: Language) {
  const rtl = lang === 'ar';
  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
    return false;
  }
  if (I18nManager.isRTL === rtl) return false;
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
  return true;
}

export async function reloadApp() {
  if (Platform.OS === 'web') return;
  try {
    await Updates.reloadAsync();
  } catch {
    // expo-updates cannot reload in development builds / Expo Go.
    DevSettings.reload();
  }
}

const RELOAD_FLAG = 'direction:reloaded';

/**
 * On launch, makes sure the native layout direction matches the saved language (e.g. Arabic UI on
 * a phone set to French). Reloads at most once so a platform that ignores forceRTL cannot loop.
 */
export async function syncDirectionOnLaunch(lang: Language) {
  const changed = applyDirection(lang);
  if (!changed) {
    AsyncStorage.removeItem(RELOAD_FLAG).catch(() => {});
    return;
  }
  if (await AsyncStorage.getItem(RELOAD_FLAG).catch(() => null)) return;
  await AsyncStorage.setItem(RELOAD_FLAG, '1').catch(() => {});
  await reloadApp();
}
