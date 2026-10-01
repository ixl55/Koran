import { Coordinates, Qibla } from 'adhan';

export const KAABA = { latitude: 21.4225, longitude: 39.8262 };

/** Bearing to the Kaaba in degrees clockwise from true North. */
export function qiblaBearing(latitude: number, longitude: number): number {
  return Qibla(new Coordinates(latitude, longitude));
}

/** Great-circle distance to the Kaaba in kilometres. */
export function distanceToKaaba(latitude: number, longitude: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(KAABA.latitude - latitude);
  const dLon = toRad(KAABA.longitude - longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(latitude)) * Math.cos(toRad(KAABA.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Normalises an angle to the range (-180, 180]. */
export function normalizeAngle(angle: number): number {
  let a = ((angle % 360) + 360) % 360;
  if (a > 180) a -= 360;
  return a;
}

/** How many degrees the phone must turn (clockwise positive) to face the Qibla. */
export function qiblaOffset(bearing: number, heading: number): number {
  return normalizeAngle(bearing - heading);
}
