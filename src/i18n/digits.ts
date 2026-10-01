export type Language = 'ar' | 'en';

const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** Converts Western digits to Arabic-Indic digits (used for ayah numbers). */
export function toArabicDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => arabicDigits[Number(d)]);
}

/** Formats a number in the UI language. */
export function formatNumber(value: number | string, lang: Language): string {
  return lang === 'ar' ? toArabicDigits(value) : String(value);
}

/** "7 ayahs" / "٧ آيات" / "٢٨٦ آية" — Arabic uses the plural only for 3–10. */
export function formatAyahCount(n: number, lang: Language): string {
  if (lang === 'en') return `${n} ${n === 1 ? 'ayah' : 'ayahs'}`;
  const noun = n >= 3 && n <= 10 ? 'آيات' : 'آية';
  return `${toArabicDigits(n)} ${noun}`;
}
