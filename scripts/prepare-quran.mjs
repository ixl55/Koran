/**
 * Prepares assets/data/quran.json from the `quran-json` package (Uthmani text, quranenc.com).
 *
 * The source uses the KFGQPC encoding for "open" tanween marks (U+0657, U+065E, U+0656), which
 * Amiri Quran does not render as tanween. They are mapped to the standard Unicode open tanween
 * code points (U+08F0–U+08F2) that the font supports.
 *
 * Usage: node scripts/prepare-quran.mjs <path/to/quran-json/dist/quran.json>
 */
import fs from 'node:fs';

const OPEN_TANWEEN = {
  'ٗ': 'ࣰ', // open fathatan
  'ٞ': 'ࣱ', // open dammatan
  'ٖ': 'ࣲ', // open kasratan
};

const [source = 'assets/data/quran.json'] = process.argv.slice(2);
const quran = JSON.parse(fs.readFileSync(source, 'utf8'));

let replaced = 0;
for (const surah of quran) {
  for (const verse of surah.verses) {
    verse.text = verse.text.replace(/[ٖٗٞ]/g, (ch) => {
      replaced++;
      return OPEN_TANWEEN[ch];
    });
  }
}

fs.writeFileSync('assets/data/quran.json', JSON.stringify(quran));
console.log(`Wrote assets/data/quran.json (${quran.length} surahs, ${replaced} tanween marks mapped).`);
