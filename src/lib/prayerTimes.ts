import { CalculationMethod, CalculationParameters, Coordinates, HighLatitudeRule, Madhab, PrayerTimes } from 'adhan';

export const PRAYER_KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
export type PrayerKey = (typeof PRAYER_KEYS)[number];

export const METHOD_KEYS = [
  'UmmAlQura',
  'Egyptian',
  'MuslimWorldLeague',
  'Karachi',
  'Dubai',
  'Kuwait',
  'Qatar',
  'Turkey',
  'NorthAmerica',
  'Singapore',
  'Tehran',
  'MoonsightingCommittee',
  'Morocco',
  'Algeria',
  'Tunisia',
] as const;
export type MethodKey = (typeof METHOD_KEYS)[number];

/** Default calculation method per ISO country code (official authority where known). */
const COUNTRY_METHODS: Record<string, MethodKey> = {
  SA: 'UmmAlQura', YE: 'UmmAlQura',
  EG: 'Egyptian', SD: 'Egyptian', LY: 'Egyptian', SY: 'Egyptian', LB: 'Egyptian', IQ: 'Egyptian',
  AE: 'Dubai', OM: 'Dubai',
  KW: 'Kuwait',
  QA: 'Qatar', BH: 'Qatar',
  TR: 'Turkey',
  PK: 'Karachi', IN: 'Karachi', BD: 'Karachi', AF: 'Karachi',
  US: 'NorthAmerica', CA: 'NorthAmerica',
  SG: 'Singapore', MY: 'Singapore', ID: 'Singapore', BN: 'Singapore',
  IR: 'Tehran',
  GB: 'MoonsightingCommittee',
  MA: 'Morocco',
  DZ: 'Algeria',
  TN: 'Tunisia',
};

export function methodForCountry(countryCode?: string): MethodKey {
  return (countryCode && COUNTRY_METHODS[countryCode.toUpperCase()]) || 'MuslimWorldLeague';
}

function customAngles(fajr: number, isha: number): CalculationParameters {
  const params = CalculationMethod.Other();
  params.fajrAngle = fajr;
  params.ishaAngle = isha;
  return params;
}

export function getParameters(method: MethodKey, madhab: 'shafi' | 'hanafi'): CalculationParameters {
  let params: CalculationParameters;
  switch (method) {
    case 'Morocco':
      params = customAngles(19, 17);
      params.methodAdjustments = { ...params.methodAdjustments, dhuhr: 5, maghrib: 5 };
      break;
    case 'Algeria':
      params = customAngles(18, 17);
      break;
    case 'Tunisia':
      params = customAngles(18, 18);
      break;
    default:
      params = CalculationMethod[method]();
  }
  params.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}

export type DayTimes = Record<PrayerKey, Date>;

export type PrayerConfig = {
  latitude: number;
  longitude: number;
  method: MethodKey;
  madhab: 'shafi' | 'hanafi';
};

export function getDayTimes(config: PrayerConfig, date: Date): DayTimes {
  const coordinates = new Coordinates(config.latitude, config.longitude);
  const params = getParameters(config.method, config.madhab);
  params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);
  const t = new PrayerTimes(coordinates, date, params);
  return { fajr: t.fajr, sunrise: t.sunrise, dhuhr: t.dhuhr, asr: t.asr, maghrib: t.maghrib, isha: t.isha };
}

export type PrayerStatus = {
  today: DayTimes;
  next: { key: PrayerKey; time: Date; isTomorrow: boolean };
  previousTime: Date;
  /** 0..1 — fraction of time elapsed between previous and next prayer. */
  progress: number;
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getPrayerStatus(config: PrayerConfig, now: Date = new Date()): PrayerStatus {
  const today = getDayTimes(config, now);
  const upcoming = PRAYER_KEYS.find((k) => today[k].getTime() > now.getTime());

  let next: PrayerStatus['next'];
  let previousTime: Date;
  if (upcoming) {
    next = { key: upcoming, time: today[upcoming], isTomorrow: false };
    const idx = PRAYER_KEYS.indexOf(upcoming);
    previousTime = idx > 0 ? today[PRAYER_KEYS[idx - 1]] : getDayTimes(config, addDays(now, -1)).isha;
  } else {
    const tomorrow = getDayTimes(config, addDays(now, 1));
    next = { key: 'fajr', time: tomorrow.fajr, isTomorrow: true };
    previousTime = today.isha;
  }

  const span = next.time.getTime() - previousTime.getTime();
  const progress = span > 0 ? Math.min(1, Math.max(0, (now.getTime() - previousTime.getTime()) / span)) : 0;
  return { today, next, previousTime, progress };
}

/** All prayer times for the next `days` days starting from `from` (inclusive), filtered to the future. */
export function getUpcomingTimes(config: PrayerConfig, from: Date, days: number) {
  const result: { key: PrayerKey; time: Date }[] = [];
  for (let i = 0; i < days; i++) {
    const times = getDayTimes(config, addDays(from, i));
    for (const key of PRAYER_KEYS) {
      if (times[key].getTime() > from.getTime()) result.push({ key, time: times[key] });
    }
  }
  return result;
}

export function formatTime(date: Date, lang: 'ar' | 'en'): string {
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const suffix = lang === 'ar' ? (h < 12 ? 'ص' : 'م') : h < 12 ? 'AM' : 'PM';
  return `${h12}:${m} ${suffix}`;
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}
