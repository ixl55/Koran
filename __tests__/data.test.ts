import { DUA_CATEGORIES } from '@/data/duas';
import { getQuran, getSurah, JUZ_STARTS, normalizeArabic, showsBismillah } from '@/data/quran';
import { toHijri } from '@/lib/hijri';

describe('quran data', () => {
  const quran = getQuran();

  it('has 114 surahs and 6236 verses', () => {
    expect(quran).toHaveLength(114);
    expect(quran.reduce((n, s) => n + s.verses.length, 0)).toBe(6236);
    quran.forEach((s, i) => {
      expect(s.id).toBe(i + 1);
      expect(s.verses).toHaveLength(s.total_verses);
    });
  });

  it('has valid juz starting points', () => {
    expect(JUZ_STARTS).toHaveLength(30);
    JUZ_STARTS.forEach(([surah, ayah]) => {
      expect(getSurah(surah)!.verses[ayah - 1]).toBeDefined();
    });
  });

  it('handles the basmala rules', () => {
    expect(showsBismillah(1)).toBe(false);
    expect(showsBismillah(9)).toBe(false);
    expect(showsBismillah(2)).toBe(true);
  });

  it('normalises Arabic for search', () => {
    expect(normalizeArabic('البَقَرَة')).toBe(normalizeArabic('البقره'));
    expect(normalizeArabic('آل عمران')).toBe('ال عمران');
  });
});

describe('adhkar data', () => {
  it('every item has text or a valid Quran reference', () => {
    for (const category of DUA_CATEGORIES) {
      expect(category.items.length).toBeGreaterThan(0);
      for (const item of category.items) {
        expect(item.count).toBeGreaterThan(0);
        expect(item.source.ar && item.source.en && item.en).toBeTruthy();
        if (item.ref) {
          const surah = getSurah(item.ref.surah)!;
          expect(surah.verses[(item.ref.to ?? item.ref.from) - 1]).toBeDefined();
        } else {
          expect(item.text?.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('has unique category ids', () => {
    const ids = DUA_CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('hijri', () => {
  it('converts a known date (1 Ramadan 1445 = 11 March 2024, ±1 day)', () => {
    const h = toHijri(new Date(2024, 2, 11));
    expect(h.year).toBe(1445);
    expect([8, 9]).toContain(h.month);
    if (h.month === 9) expect(h.day).toBeLessThanOrEqual(2);
    else expect(h.day).toBeGreaterThanOrEqual(29);
  });
});
