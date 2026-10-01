import { toArabicDigits, type Language } from '@/i18n/digits';

const MONTHS_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];
const MONTHS_EN = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", 'Jumada al-Ula', 'Jumada al-Akhirah',
  'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
];

export type HijriDate = { day: number; month: number; year: number };

/** Umm al-Qura via Intl when the JS engine supports it. */
function fromIntl(date: Date): HijriDate | null {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(date);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    const result = { day: get('day'), month: get('month'), year: get('year') };
    // Engines without the islamic calendar silently fall back to Gregorian.
    if (!result.year || result.year > 1700 || !result.month || !result.day) return null;
    return result;
  } catch {
    return null;
  }
}

/** Arithmetic (tabular) Islamic calendar — fallback, may differ by ±1 day. */
function tabular(date: Date): HijriDate {
  // Julian Day Number of the local calendar date (1970-01-01 = 2440588).
  const jd = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000) + 2440588;
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { day, month, year };
}

export function toHijri(date: Date): HijriDate {
  return fromIntl(date) ?? tabular(date);
}

export function formatHijri(date: Date, lang: Language): string {
  const h = toHijri(date);
  if (lang === 'ar') return `${toArabicDigits(h.day)} ${MONTHS_AR[h.month - 1]} ${toArabicDigits(h.year)} هـ`;
  return `${h.day} ${MONTHS_EN[h.month - 1]} ${h.year} AH`;
}

const WEEKDAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS_G_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS_G_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatGregorian(date: Date, lang: Language): string {
  if (lang === 'ar') {
    return `${WEEKDAYS_AR[date.getDay()]}، ${toArabicDigits(date.getDate())} ${MONTHS_G_AR[date.getMonth()]} ${toArabicDigits(date.getFullYear())}`;
  }
  return `${WEEKDAYS_EN[date.getDay()]}, ${date.getDate()} ${MONTHS_G_EN[date.getMonth()]} ${date.getFullYear()}`;
}
