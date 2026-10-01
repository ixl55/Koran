import * as Location from 'expo-location';
import type { SavedLocation } from '@/context/SettingsContext';

export type LocationResult =
  | { ok: true; location: SavedLocation }
  | { ok: false; reason: 'denied' | 'unavailable' };

export async function detectLocation(): Promise<LocationResult> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return { ok: false, reason: 'denied' };

  try {
    const position =
      (await Location.getLastKnownPositionAsync({ maxAge: 10 * 60 * 1000 })) ??
      (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
    const { latitude, longitude } = position.coords;

    let city: string | undefined;
    let countryCode: string | undefined;
    try {
      const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
      city = place?.city ?? place?.subregion ?? place?.region ?? undefined;
      countryCode = place?.isoCountryCode ?? undefined;
    } catch {
      // Reverse geocoding needs network on some platforms; coordinates are enough.
    }
    return { ok: true, location: { latitude, longitude, city, countryCode } };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}
