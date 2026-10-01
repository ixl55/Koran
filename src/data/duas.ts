/**
 * Adhkar and supplications, primarily from "Hisn al-Muslim" (Fortress of the Muslim).
 * Passages that are whole Quranic verses reference the bundled Quran text (`ref`) instead of
 * duplicating it, so they always match the mushaf exactly.
 */

export type QuranRef = { surah: number; from: number; to?: number };

export type Dhikr = {
  /** Arabic text (omitted when `ref` is used). */
  text?: string;
  ref?: QuranRef;
  /** Show the basmala before the referenced passage (e.g. the three Quls). */
  basmala?: boolean;
  count: number;
  source: { ar: string; en: string };
  en: string;
  note?: { ar: string; en: string };
};

export type DuaCategory = {
  id: string;
  icon: string;
  title: { ar: string; en: string };
  items: Dhikr[];
};

const src = (ar: string, en: string) => ({ ar, en });

const AYAT_AL_KURSI: QuranRef = { surah: 2, from: 255 };
const IKHLAS: QuranRef = { surah: 112, from: 1, to: 4 };
const FALAQ: QuranRef = { surah: 113, from: 1, to: 5 };
const NAS: QuranRef = { surah: 114, from: 1, to: 6 };

/** Builds the shared morning/evening list; `m` selects the morning wording. */
function morningEvening(m: boolean): Dhikr[] {
  return [
    {
      ref: AYAT_AL_KURSI,
      count: 1,
      source: src('النسائي في عمل اليوم والليلة', "An-Nasa'i"),
      en: 'Ayat al-Kursi (Al-Baqarah 2:255).',
    },
    {
      ref: IKHLAS,
      basmala: true,
      count: 3,
      source: src('أبو داود والترمذي', 'Abu Dawud, At-Tirmidhi'),
      en: 'Surah Al-Ikhlas.',
    },
    {
      ref: FALAQ,
      basmala: true,
      count: 3,
      source: src('أبو داود والترمذي', 'Abu Dawud, At-Tirmidhi'),
      en: 'Surah Al-Falaq.',
    },
    {
      ref: NAS,
      basmala: true,
      count: 3,
      source: src('أبو داود والترمذي', 'Abu Dawud, At-Tirmidhi'),
      en: 'Surah An-Nas.',
    },
    {
      text: m
        ? 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ'
        : 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
      count: 1,
      source: src('مسلم', 'Muslim'),
      en: m
        ? 'We have entered the morning and the dominion belongs to Allah. Praise be to Allah; none has the right to be worshipped but Allah alone. My Lord, I ask You for the good of this day and what follows it, and seek refuge in You from its evil, from laziness and the misery of old age, and from punishment in the Fire and in the grave.'
        : 'We have entered the evening and the dominion belongs to Allah. Praise be to Allah; none has the right to be worshipped but Allah alone. My Lord, I ask You for the good of this night and what follows it, and seek refuge in You from its evil, from laziness and the misery of old age, and from punishment in the Fire and in the grave.',
    },
    {
      text: m
        ? 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ'
        : 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
      count: 1,
      source: src('الترمذي', 'At-Tirmidhi'),
      en: m
        ? 'O Allah, by You we enter the morning and by You the evening, by You we live and die, and to You is the resurrection.'
        : 'O Allah, by You we enter the evening and by You the morning, by You we live and die, and to You is the final return.',
    },
    {
      text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      count: 1,
      source: src('البخاري', 'Al-Bukhari'),
      en: 'Sayyid al-Istighfar: O Allah, You are my Lord, none has the right to be worshipped but You. You created me and I am Your servant, keeping Your covenant as best I can. I seek refuge in You from the evil I have done. I acknowledge Your favour upon me and my sin, so forgive me, for none forgives sins but You.',
    },
    {
      text: m
        ? 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ'
        : 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
      count: 4,
      source: src('أبو داود', 'Abu Dawud'),
      en: 'O Allah, I call You, the bearers of Your Throne, Your angels and all Your creation to witness that You are Allah, none has the right to be worshipped but You alone, and that Muhammad is Your servant and Messenger.',
    },
    {
      text: m
        ? 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ'
        : 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
      count: 1,
      source: src('أبو داود', 'Abu Dawud'),
      en: 'O Allah, whatever blessing I or any of Your creation have is from You alone, without partner; to You is all praise and thanks.',
    },
    {
      text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ',
      count: 3,
      source: src('أبو داود', 'Abu Dawud'),
      en: 'O Allah, grant me well-being in my body, my hearing and my sight; none has the right to be worshipped but You. O Allah, I seek refuge in You from disbelief, poverty and the punishment of the grave.',
    },
    {
      text: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
      count: 7,
      source: src('أبو داود', 'Abu Dawud'),
      en: 'Allah is sufficient for me; none has the right to be worshipped but Him. Upon Him I rely, and He is Lord of the Mighty Throne.',
    },
    {
      text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي، وَعَنْ يَمِينِي وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
      count: 1,
      source: src('أبو داود وابن ماجه', 'Abu Dawud, Ibn Majah'),
      en: 'O Allah, I ask You for pardon and well-being in this world and the Hereafter, in my religion, my worldly affairs, my family and my wealth. Conceal my faults, calm my fears, and guard me from every side; I seek refuge in Your greatness from being struck from beneath me.',
    },
    {
      text: 'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ',
      count: 1,
      source: src('الترمذي وأبو داود', 'At-Tirmidhi, Abu Dawud'),
      en: 'O Allah, Knower of the unseen and the seen, Creator of the heavens and the earth, Lord and Sovereign of all things: I seek refuge in You from the evil of my soul, from the evil of Satan and his call to shirk, and from wronging myself or bringing harm to a Muslim.',
    },
    {
      text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      count: 3,
      source: src('أبو داود والترمذي', 'Abu Dawud, At-Tirmidhi'),
      en: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
    },
    {
      text: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
      count: 3,
      source: src('أبو داود والترمذي', 'Abu Dawud, At-Tirmidhi'),
      en: 'I am pleased with Allah as my Lord, Islam as my religion and Muhammad ﷺ as my Prophet.',
    },
    {
      text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
      count: 1,
      source: src('الحاكم', 'Al-Hakim'),
      en: 'O Ever-Living, O Sustainer, by Your mercy I seek help: set right all my affairs and do not leave me to myself even for the blink of an eye.',
    },
    {
      text: m
        ? 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ'
        : 'أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ',
      count: 1,
      source: src('أحمد', 'Ahmad'),
      en: 'We are upon the natural religion of Islam, the word of sincerity, the religion of our Prophet Muhammad ﷺ and the way of our father Ibrahim, upright and Muslim, and he was not of the polytheists.',
    },
    ...(m
      ? [
          {
            text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
            count: 3,
            source: src('مسلم', 'Muslim'),
            en: 'Glory and praise be to Allah, as many times as His creation, as much as pleases Him, as the weight of His Throne and the ink of His words.',
          },
          {
            text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
            count: 1,
            source: src('ابن ماجه', 'Ibn Majah'),
            en: 'O Allah, I ask You for beneficial knowledge, wholesome provision and accepted deeds.',
          },
        ]
      : [
          {
            text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
            count: 3,
            source: src('مسلم', 'Muslim'),
            en: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
          },
        ]),
    {
      text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      count: 10,
      source: src('النسائي وأحمد', "An-Nasa'i, Ahmad"),
      en: 'None has the right to be worshipped but Allah alone, without partner. His is the dominion and the praise, and He has power over all things.',
    },
    {
      text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
      count: 100,
      source: src('مسلم', 'Muslim'),
      en: 'Glory be to Allah and praise be to Him.',
    },
    {
      text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
      count: 100,
      source: src('البخاري ومسلم', 'Al-Bukhari, Muslim'),
      en: 'I seek the forgiveness of Allah and repent to Him.',
    },
    {
      text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
      count: 10,
      source: src('الطبراني', 'At-Tabarani'),
      en: 'O Allah, send prayers and peace upon our Prophet Muhammad.',
    },
  ];
}

export const DUA_CATEGORIES: DuaCategory[] = [
  {
    id: 'morning',
    icon: 'sunny-outline',
    title: { ar: 'أذكار الصباح', en: 'Morning Adhkar' },
    items: morningEvening(true),
  },
  {
    id: 'evening',
    icon: 'moon-outline',
    title: { ar: 'أذكار المساء', en: 'Evening Adhkar' },
    items: morningEvening(false),
  },
  {
    id: 'after-prayer',
    icon: 'hand-left-outline',
    title: { ar: 'أذكار بعد الصلاة', en: 'After Prayer' },
    items: [
      {
        text: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        count: 1,
        source: src('مسلم', 'Muslim'),
        en: 'I seek the forgiveness of Allah (three times). O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of Majesty and Honour.',
      },
      {
        text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
        count: 1,
        source: src('البخاري ومسلم', 'Al-Bukhari, Muslim'),
        en: 'None has the right to be worshipped but Allah alone... O Allah, none can withhold what You give, none can give what You withhold, and no wealth avails its owner against You.',
      },
      {
        text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، لَا إِلَهَ إِلَّا اللَّهُ، وَلَا نَعْبُدُ إِلَّا إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ، لَا إِلَهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ',
        count: 1,
        source: src('مسلم', 'Muslim'),
        en: 'There is no might or power except with Allah. None has the right to be worshipped but Allah and we worship none but Him. His is the grace, the bounty and the excellent praise; we are sincere in religion to Him, even if the disbelievers dislike it.',
      },
      {
        text: 'سُبْحَانَ اللَّهِ',
        count: 33,
        source: src('مسلم', 'Muslim'),
        en: 'Glory be to Allah.',
      },
      {
        text: 'الْحَمْدُ لِلَّهِ',
        count: 33,
        source: src('مسلم', 'Muslim'),
        en: 'Praise be to Allah.',
      },
      {
        text: 'اللَّهُ أَكْبَرُ',
        count: 33,
        source: src('مسلم', 'Muslim'),
        en: 'Allah is the Greatest.',
      },
      {
        text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        count: 1,
        source: src('مسلم', 'Muslim'),
        en: 'Completing the hundred: none has the right to be worshipped but Allah alone, without partner...',
      },
      {
        ref: AYAT_AL_KURSI,
        count: 1,
        source: src('النسائي', "An-Nasa'i"),
        en: 'Ayat al-Kursi (Al-Baqarah 2:255).',
      },
      {
        ref: IKHLAS,
        basmala: true,
        count: 1,
        source: src('أبو داود والترمذي', 'Abu Dawud, At-Tirmidhi'),
        en: 'Surah Al-Ikhlas.',
        note: { ar: 'ثلاث مرات بعد الفجر والمغرب', en: 'Three times after Fajr and Maghrib' },
      },
      {
        ref: FALAQ,
        basmala: true,
        count: 1,
        source: src('أبو داود والترمذي', 'Abu Dawud, At-Tirmidhi'),
        en: 'Surah Al-Falaq.',
        note: { ar: 'ثلاث مرات بعد الفجر والمغرب', en: 'Three times after Fajr and Maghrib' },
      },
      {
        ref: NAS,
        basmala: true,
        count: 1,
        source: src('أبو داود والترمذي', 'Abu Dawud, At-Tirmidhi'),
        en: 'Surah An-Nas.',
        note: { ar: 'ثلاث مرات بعد الفجر والمغرب', en: 'Three times after Fajr and Maghrib' },
      },
      {
        text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
        count: 1,
        source: src('أبو داود والنسائي', "Abu Dawud, An-Nasa'i"),
        en: 'O Allah, help me to remember You, to thank You and to worship You well.',
      },
    ],
  },
  {
    id: 'sleep',
    icon: 'bed-outline',
    title: { ar: 'أذكار النوم', en: 'Before Sleep' },
    items: [
      {
        text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        count: 1,
        source: src('البخاري', 'Al-Bukhari'),
        en: 'In Your name, O Allah, I die and I live.',
      },
      {
        ref: IKHLAS,
        basmala: true,
        count: 3,
        source: src('البخاري', 'Al-Bukhari'),
        en: 'Surah Al-Ikhlas — blow into cupped hands and wipe over the body.',
      },
      {
        ref: FALAQ,
        basmala: true,
        count: 3,
        source: src('البخاري', 'Al-Bukhari'),
        en: 'Surah Al-Falaq.',
      },
      {
        ref: NAS,
        basmala: true,
        count: 3,
        source: src('البخاري', 'Al-Bukhari'),
        en: 'Surah An-Nas.',
      },
      {
        ref: AYAT_AL_KURSI,
        count: 1,
        source: src('البخاري', 'Al-Bukhari'),
        en: 'Ayat al-Kursi (Al-Baqarah 2:255).',
      },
      {
        ref: { surah: 2, from: 285, to: 286 },
        count: 1,
        source: src('البخاري ومسلم', 'Al-Bukhari, Muslim'),
        en: 'The last two verses of Al-Baqarah (2:285–286).',
      },
      {
        text: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
        count: 1,
        source: src('البخاري ومسلم', 'Al-Bukhari, Muslim'),
        en: 'In Your name, my Lord, I lie down and by You I rise. If You take my soul, have mercy on it; if You release it, protect it as You protect Your righteous servants.',
      },
      {
        text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        count: 3,
        source: src('أبو داود', 'Abu Dawud'),
        en: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
      },
      {
        text: 'سُبْحَانَ اللَّهِ (٣٣)، الْحَمْدُ لِلَّهِ (٣٣)، اللَّهُ أَكْبَرُ (٣٤)',
        count: 1,
        source: src('البخاري ومسلم', 'Al-Bukhari, Muslim'),
        en: 'Glory be to Allah (33), praise be to Allah (33), Allah is the Greatest (34).',
      },
      {
        text: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ',
        count: 1,
        source: src('البخاري ومسلم', 'Al-Bukhari, Muslim'),
        en: 'O Allah, I submit myself to You, entrust my affair to You, turn my face to You and rely on You, in hope and fear of You. There is no refuge or escape from You except to You. I believe in Your Book which You revealed and Your Prophet whom You sent.',
      },
    ],
  },
  {
    id: 'waking',
    icon: 'alarm-outline',
    title: { ar: 'أذكار الاستيقاظ', en: 'Upon Waking' },
    items: [
      {
        text: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        count: 1,
        source: src('البخاري', 'Al-Bukhari'),
        en: 'Praise be to Allah who gave us life after causing us to die, and to Him is the resurrection.',
      },
      {
        text: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ',
        count: 1,
        source: src('الترمذي', 'At-Tirmidhi'),
        en: 'Praise be to Allah who restored my health, returned my soul to me and allowed me to remember Him.',
      },
    ],
  },
  {
    id: 'adhan-mosque',
    icon: 'business-outline',
    title: { ar: 'الأذان والمسجد', en: 'Adhan & Mosque' },
    items: [
      {
        text: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
        count: 1,
        source: src('البخاري', 'Al-Bukhari'),
        en: 'After the adhan: O Allah, Lord of this perfect call and the prayer to be established, grant Muhammad the intercession and favour, and raise him to the praised station You promised him.',
      },
      {
        text: 'أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ. بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        count: 1,
        source: src('أبو داود ومسلم', 'Abu Dawud, Muslim'),
        en: 'Entering the mosque: I seek refuge in Allah the Almighty, His noble Face and eternal authority from the accursed Satan. In the name of Allah, and peace and blessings upon the Messenger of Allah. O Allah, open for me the gates of Your mercy.',
      },
      {
        text: 'بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ، اللَّهُمَّ اعْصِمْنِي مِنَ الشَّيْطَانِ الرَّجِيمِ',
        count: 1,
        source: src('مسلم وابن ماجه', 'Muslim, Ibn Majah'),
        en: 'Leaving the mosque: In the name of Allah, and peace and blessings upon the Messenger of Allah. O Allah, I ask You of Your bounty; O Allah, protect me from the accursed Satan.',
      },
    ],
  },
  {
    id: 'home',
    icon: 'home-outline',
    title: { ar: 'المنزل', en: 'Home' },
    items: [
      {
        text: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        count: 1,
        source: src('أبو داود والترمذي', 'Abu Dawud, At-Tirmidhi'),
        en: 'Leaving home: In the name of Allah, I rely upon Allah, and there is no might or power except with Allah.',
      },
      {
        text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ',
        count: 1,
        source: src('أبو داود', 'Abu Dawud'),
        en: 'O Allah, I seek refuge in You from going astray or being led astray, from slipping or being made to slip, from wronging or being wronged, and from acting foolishly or being treated foolishly.',
      },
      {
        text: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
        count: 1,
        source: src('أبو داود', 'Abu Dawud'),
        en: 'Entering home: In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we rely.',
      },
    ],
  },
  {
    id: 'food',
    icon: 'restaurant-outline',
    title: { ar: 'الطعام والصيام', en: 'Food & Fasting' },
    items: [
      {
        text: 'بِسْمِ اللَّهِ',
        count: 1,
        source: src('أبو داود والترمذي', 'Abu Dawud, At-Tirmidhi'),
        en: 'Before eating: In the name of Allah.',
        note: { ar: 'فإن نسي في أوله فليقل: بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ', en: 'If forgotten, say: In the name of Allah at its beginning and its end.' },
      },
      {
        text: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا، وَرَزَقَنِيهِ، مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        count: 1,
        source: src('أبو داود والترمذي', 'Abu Dawud, At-Tirmidhi'),
        en: 'After eating: Praise be to Allah who fed me this and provided it for me without any might or power on my part.',
      },
      {
        text: 'اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ، وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ',
        count: 1,
        source: src('مسلم', 'Muslim'),
        en: 'For the host: O Allah, bless them in what You have provided them, forgive them and have mercy on them.',
      },
      {
        text: 'ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
        count: 1,
        source: src('أبو داود', 'Abu Dawud'),
        en: 'Breaking the fast: The thirst is gone, the veins are moistened, and the reward is assured, if Allah wills.',
      },
    ],
  },
  {
    id: 'travel',
    icon: 'airplane-outline',
    title: { ar: 'السفر', en: 'Travel' },
    items: [
      {
        text: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ، اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَكَآبَةِ الْمَنْظَرِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ',
        count: 1,
        source: src('مسلم', 'Muslim'),
        en: 'Allah is the Greatest (three times). Glory be to Him who has subjected this to us, and we could not have done it ourselves, and to our Lord we will return. O Allah, we ask You on this journey for righteousness, piety and deeds that please You. Make this journey easy and shorten its distance. You are the Companion on the journey and the Guardian of the family. I seek refuge in You from the hardships of travel, gloomy sights and an evil return to wealth and family.',
      },
      {
        text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        count: 1,
        source: src('مسلم', 'Muslim'),
        en: 'When stopping at a place: I seek refuge in the perfect words of Allah from the evil of what He has created.',
      },
      {
        text: 'آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ',
        count: 1,
        source: src('مسلم', 'Muslim'),
        en: 'On returning: We return, repentant, worshipping and praising our Lord.',
      },
    ],
  },
  {
    id: 'quranic',
    icon: 'book-outline',
    title: { ar: 'أدعية من القرآن', en: 'Quranic Duas' },
    items: [
      {
        text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        count: 1,
        source: src('البقرة: ٢٠١', 'Al-Baqarah 2:201'),
        en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
      },
      {
        text: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
        count: 1,
        source: src('البقرة: ١٢٧', 'Al-Baqarah 2:127'),
        en: 'Our Lord, accept from us; indeed You are the All-Hearing, the All-Knowing.',
      },
      {
        ref: { surah: 3, from: 8 },
        count: 1,
        source: src('آل عمران: ٨', "Ali 'Imran 3:8"),
        en: 'Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from Yourself; indeed You are the Bestower.',
      },
      {
        text: 'رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
        count: 1,
        source: src('الأعراف: ٢٣', "Al-A'raf 7:23"),
        en: 'Our Lord, we have wronged ourselves; if You do not forgive us and have mercy on us, we will surely be among the losers.',
      },
      {
        ref: { surah: 14, from: 40, to: 41 },
        count: 1,
        source: src('إبراهيم: ٤٠–٤١', 'Ibrahim 14:40–41'),
        en: 'My Lord, make me one who establishes prayer, and from my descendants. Our Lord, accept my supplication. Our Lord, forgive me, my parents and the believers on the Day the account is established.',
      },
      {
        text: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
        count: 1,
        source: src('الإسراء: ٢٤', "Al-Isra' 17:24"),
        en: 'My Lord, have mercy on them (my parents) as they raised me when I was small.',
      },
      {
        text: 'رَبِّ اشْرَحْ لِي صَدْرِي، وَيَسِّرْ لِي أَمْرِي، وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي، يَفْقَهُوا قَوْلِي',
        count: 1,
        source: src('طه: ٢٥–٢٨', 'Ta-Ha 20:25–28'),
        en: 'My Lord, expand my chest, ease my task, and untie the knot from my tongue so they may understand my speech.',
      },
      {
        text: 'رَبِّ زِدْنِي عِلْمًا',
        count: 1,
        source: src('طه: ١١٤', 'Ta-Ha 20:114'),
        en: 'My Lord, increase me in knowledge.',
      },
      {
        text: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
        count: 1,
        source: src('الأنبياء: ٨٧', "Al-Anbiya' 21:87"),
        en: 'There is no deity except You; glory be to You. Indeed, I have been among the wrongdoers.',
      },
      {
        text: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
        count: 1,
        source: src('الفرقان: ٧٤', 'Al-Furqan 25:74'),
        en: 'Our Lord, grant us from our spouses and offspring comfort to our eyes, and make us leaders of the righteous.',
      },
    ],
  },
  {
    id: 'prophetic',
    icon: 'heart-outline',
    title: { ar: 'أدعية نبوية', en: 'Prophetic Duas' },
    items: [
      {
        text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
        count: 1,
        source: src('البخاري', 'Al-Bukhari'),
        en: 'O Allah, I seek refuge in You from worry and grief, from weakness and laziness, from miserliness and cowardice, and from the burden of debt and being overpowered by men.',
      },
      {
        text: 'اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي',
        count: 1,
        source: src('أحمد', 'Ahmad'),
        en: 'O Allah, I am Your servant, son of Your servants; my forelock is in Your hand, Your judgement upon me is assured and Your decree is just. I ask You by every name You have, to make the Quran the spring of my heart, the light of my chest, the remover of my sadness and the reliever of my distress.',
      },
      {
        text: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
        count: 1,
        source: src('البخاري ومسلم', 'Al-Bukhari, Muslim'),
        en: 'In distress: None has the right to be worshipped but Allah, the Mighty, the Forbearing; Lord of the Mighty Throne; Lord of the heavens, the earth and the Noble Throne.',
      },
      {
        text: 'اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ',
        count: 1,
        source: src('أبو داود', 'Abu Dawud'),
        en: 'O Allah, it is Your mercy I hope for, so do not leave me to myself even for the blink of an eye, and set right all my affairs. None has the right to be worshipped but You.',
      },
      {
        text: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
        count: 1,
        source: src('الترمذي', 'At-Tirmidhi'),
        en: 'O Turner of hearts, make my heart firm upon Your religion.',
      },
      {
        text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى، وَالتُّقَى، وَالْعَفَافَ، وَالْغِنَى',
        count: 1,
        source: src('مسلم', 'Muslim'),
        en: 'O Allah, I ask You for guidance, piety, chastity and self-sufficiency.',
      },
      {
        text: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        count: 1,
        source: src('الترمذي', 'At-Tirmidhi'),
        en: 'O Allah, You are Pardoning and love to pardon, so pardon me.',
      },
      {
        text: 'اللَّهُمَّ أَصْلِحْ لِي دِينِيَ الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ',
        count: 1,
        source: src('مسلم', 'Muslim'),
        en: 'O Allah, set right my religion which is the safeguard of my affairs, my worldly life wherein is my livelihood, and my Hereafter to which is my return. Make life an increase for me in all good and death a relief from all evil.',
      },
      {
        text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ، وَتَحَوُّلِ عَافِيَتِكَ، وَفُجَاءَةِ نِقْمَتِكَ، وَجَمِيعِ سَخَطِكَ',
        count: 1,
        source: src('مسلم', 'Muslim'),
        en: 'O Allah, I seek refuge in You from the loss of Your blessings, the change of Your protection, the suddenness of Your punishment and all Your displeasure.',
      },
    ],
  },
];

export function getCategory(id: string): DuaCategory | undefined {
  return DUA_CATEGORIES.find((c) => c.id === id);
}
