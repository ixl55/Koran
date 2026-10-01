import { useMemo } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { methodForCountry, type MethodKey, type PrayerConfig } from '@/lib/prayerTimes';

/** Prayer calculation config derived from settings, or null when no location is saved. */
export function usePrayerConfig(): (PrayerConfig & { resolvedMethod: MethodKey }) | null {
  const { settings } = useSettings();
  const { location, method, madhab } = settings;
  return useMemo(() => {
    if (!location) return null;
    const resolvedMethod = method === 'auto' ? methodForCountry(location.countryCode) : method;
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      method: resolvedMethod,
      resolvedMethod,
      madhab,
    };
  }, [location, method, madhab]);
}
