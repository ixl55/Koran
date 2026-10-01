import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { getDeviceLanguage, type Language } from '@/i18n';
import type { MethodKey, PrayerKey } from '@/lib/prayerTimes';

export type ThemeMode = 'system' | 'light' | 'dark';

export type SavedLocation = {
  latitude: number;
  longitude: number;
  city?: string;
  countryCode?: string;
};

export type LastRead = { surah: number; ayah: number };

export type Settings = {
  language: Language;
  themeMode: ThemeMode;
  quranFontSize: number;
  duaFontSize: number;
  method: MethodKey | 'auto';
  madhab: 'shafi' | 'hanafi';
  notifications: Record<PrayerKey, boolean>;
  location: SavedLocation | null;
  lastRead: LastRead | null;
};

export const QURAN_FONT = { min: 18, max: 44, default: 28 };
export const DUA_FONT = { min: 16, max: 34, default: 22 };

const STORAGE_KEY = 'settings:v1';

const defaultSettings = (): Settings => ({
  language: getDeviceLanguage(),
  themeMode: 'system',
  quranFontSize: QURAN_FONT.default,
  duaFontSize: DUA_FONT.default,
  method: 'auto',
  madhab: 'shafi',
  notifications: { fajr: true, sunrise: false, dhuhr: true, asr: true, maghrib: true, isha: true },
  location: null,
  lastRead: null,
});

type SettingsContextValue = {
  settings: Settings;
  ready: boolean;
  /** Applies a patch; the returned promise resolves once it is persisted. */
  update: (patch: Partial<Settings>) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [ready, setReady] = useState(false);
  const latest = useRef(settings);
  latest.current = settings;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as Partial<Settings>;
        const current = latest.current;
        const merged = { ...current, ...saved, notifications: { ...current.notifications, ...saved.notifications } };
        latest.current = merged;
        setSettings(merged);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const update = useCallback(async (patch: Partial<Settings>) => {
    const next = { ...latest.current, ...patch };
    latest.current = next;
    setSettings(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Persisting is best-effort; the in-memory state is already updated.
    }
  }, []);

  const value = useMemo(() => ({ settings, ready, update }), [settings, ready, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
