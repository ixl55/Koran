import { formatCountdown, getDayTimes, getPrayerStatus, getUpcomingTimes, methodForCountry } from '@/lib/prayerTimes';

const MAKKAH = { latitude: 21.4225, longitude: 39.8262, method: 'UmmAlQura' as const, madhab: 'shafi' as const };
const CAIRO = { latitude: 30.0444, longitude: 31.2357, method: 'Egyptian' as const, madhab: 'shafi' as const };

/** Formats a Date as HH:MM in a fixed UTC offset (hours), independent of the test machine's zone. */
function hhmm(date: Date, offsetHours: number) {
  const d = new Date(date.getTime() + offsetHours * 3600 * 1000);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

describe('prayer times', () => {
  it('orders the six times chronologically', () => {
    const t = getDayTimes(CAIRO, new Date(2024, 5, 15));
    const order = [t.fajr, t.sunrise, t.dhuhr, t.asr, t.maghrib, t.isha].map((d) => d.getTime());
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('matches published Makkah times (Umm al-Qura, 2024-01-01, UTC+3)', () => {
    const t = getDayTimes(MAKKAH, new Date(2024, 0, 1, 12));
    // Published timetable values for Makkah (±2 minutes).
    const expectNear = (actual: Date, expected: string) => {
      const [h, m] = expected.split(':').map(Number);
      const [ah, am] = hhmm(actual, 3).split(':').map(Number);
      expect(Math.abs(ah * 60 + am - (h * 60 + m))).toBeLessThanOrEqual(2);
    };
    expectNear(t.fajr, '05:37');
    expectNear(t.dhuhr, '12:24');
    expectNear(t.asr, '15:29');
    expectNear(t.maghrib, '17:50');
    // Umm al-Qura: Isha is fixed at 90 minutes after Maghrib outside Ramadan.
    expect(Math.round((t.isha.getTime() - t.maghrib.getTime()) / 60000)).toBe(90);
  });

  it('Hanafi Asr is later than Shafi Asr', () => {
    const date = new Date(2024, 5, 15);
    const shafi = getDayTimes(CAIRO, date).asr;
    const hanafi = getDayTimes({ ...CAIRO, madhab: 'hanafi' }, date).asr;
    expect(hanafi.getTime()).toBeGreaterThan(shafi.getTime());
  });

  it('finds the next prayer and rolls over to tomorrow after Isha', () => {
    const date = new Date(2024, 5, 15);
    const today = getDayTimes(CAIRO, date);

    const beforeDhuhr = new Date(today.dhuhr.getTime() - 60_000);
    const s1 = getPrayerStatus(CAIRO, beforeDhuhr);
    expect(s1.next.key).toBe('dhuhr');
    expect(s1.next.isTomorrow).toBe(false);
    expect(s1.progress).toBeGreaterThan(0.9);

    const afterIsha = new Date(today.isha.getTime() + 60_000);
    const s2 = getPrayerStatus(CAIRO, afterIsha);
    expect(s2.next.key).toBe('fajr');
    expect(s2.next.isTomorrow).toBe(true);
    expect(s2.next.time.getTime()).toBeGreaterThan(afterIsha.getTime());
  });

  it('schedules at most 6 prayers per day, all in the future', () => {
    const from = new Date(2024, 5, 15, 13);
    const upcoming = getUpcomingTimes(CAIRO, from, 7);
    expect(upcoming.length).toBeLessThanOrEqual(42);
    expect(upcoming.length).toBeGreaterThan(35);
    upcoming.forEach((p) => expect(p.time.getTime()).toBeGreaterThan(from.getTime()));
  });

  it('picks a default method per country', () => {
    expect(methodForCountry('SA')).toBe('UmmAlQura');
    expect(methodForCountry('eg')).toBe('Egyptian');
    expect(methodForCountry('MA')).toBe('Morocco');
    expect(methodForCountry(undefined)).toBe('MuslimWorldLeague');
  });

  it('formats a countdown', () => {
    expect(formatCountdown((1 * 3600 + 23 * 60 + 45) * 1000)).toBe('01:23:45');
    expect(formatCountdown(-5)).toBe('00:00:00');
  });
});
