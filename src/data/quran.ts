export type Verse = { id: number; text: string };

export type Surah = {
  id: number;
  name: string;
  transliteration: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
  verses: Verse[];
};

let cache: Surah[] | null = null;

/** Full Quran text (Uthmani script). Loaded lazily on first access. */
export function getQuran(): Surah[] {
  if (!cache) cache = require('../../assets/data/quran.json') as Surah[];
  return cache;
}

export function getSurah(id: number): Surah | undefined {
  return getQuran()[id - 1];
}

export const BISMILLAH = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ';

/** Al-Fatihah has the basmala as its first verse and At-Tawbah has none. */
export function showsBismillah(surahId: number): boolean {
  return surahId !== 1 && surahId !== 9;
}

/** Start of each of the 30 ajza' as [surah, ayah]. */
export const JUZ_STARTS: readonly [number, number][] = [
  [1, 1], [2, 142], [2, 253], [3, 93], [4, 24], [4, 148], [5, 83], [6, 111], [7, 88], [8, 41],
  [9, 93], [11, 6], [12, 53], [15, 1], [17, 1], [18, 75], [21, 1], [23, 1], [25, 21], [27, 56],
  [29, 46], [33, 31], [36, 28], [39, 32], [41, 47], [46, 1], [51, 31], [58, 1], [67, 1], [78, 1],
];

/** Normalises Arabic text for search: strips diacritics/Quranic marks and unifies letter forms. */
export function normalizeArabic(text: string): string {
  return text
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, '')
    .replace(/[آأإٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .toLowerCase()
    .trim();
}
