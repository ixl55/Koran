import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { QURAN_FONT, useSettings } from '@/context/SettingsContext';
import { BISMILLAH, getSurah, showsBismillah, type Verse } from '@/data/quran';
import { formatAyahCount, toArabicDigits, useT } from '@/i18n';
import { fonts, radius, spacing, useTheme } from '@/theme';

/** Ayahs per rendered paragraph: keeps the mushaf flow while allowing scroll-to-ayah. */
const BLOCK_SIZE = 8;

export default function SurahScreen() {
  const params = useLocalSearchParams<{ id: string; ayah?: string }>();
  const surahId = Number(params.id);
  const targetAyah = params.ayah ? Number(params.ayah) : undefined;
  const surah = getSurah(surahId);
  const t = useT();
  const { colors } = useTheme();
  const { settings, update } = useSettings();
  const lang = settings.language;
  const fontSize = settings.quranFontSize;
  const listRef = useRef<FlatList<Verse[]>>(null);
  const [selected, setSelected] = useState<number | undefined>(
    targetAyah ?? (settings.lastRead?.surah === surahId ? settings.lastRead.ayah : undefined),
  );

  const blocks = useMemo(() => {
    const verses = surah?.verses ?? [];
    const result: Verse[][] = [];
    for (let i = 0; i < verses.length; i += BLOCK_SIZE) result.push(verses.slice(i, i + BLOCK_SIZE));
    return result;
  }, [surah]);

  useEffect(() => {
    if (!targetAyah || targetAyah <= 1) return;
    const index = Math.floor((targetAyah - 1) / BLOCK_SIZE);
    const timer = setTimeout(() => listRef.current?.scrollToIndex({ index, animated: false, viewOffset: 80 }), 300);
    return () => clearTimeout(timer);
  }, [targetAyah]);

  if (!surah) return null;

  const setFont = (delta: number) => {
    const next = Math.min(QURAN_FONT.max, Math.max(QURAN_FONT.min, fontSize + delta));
    update({ quranFontSize: next });
  };

  const markRead = (ayah: number) => {
    setSelected(ayah);
    update({ lastRead: { surah: surahId, ayah } });
  };

  const title = lang === 'ar' ? `${t.quran.surah} ${surah.name}` : surah.transliteration;
  const quranText = { fontFamily: fonts.quran, fontSize, lineHeight: Math.round(fontSize * 2.1), color: colors.text };

  const header = (
    <View style={styles.headerBlock}>
      <View style={[styles.banner, { borderColor: colors.primary, backgroundColor: colors.primarySoft }]}>
        <Text style={[styles.bannerName, { color: colors.primary, fontFamily: fonts.quran }]}>{`سُورَةُ ${surah.name}`}</Text>
        <AppText size={12} muted>
          {surah.type === 'meccan' ? t.quran.meccan : t.quran.medinan} · {formatAyahCount(surah.total_verses, lang)}
        </AppText>
      </View>
      {showsBismillah(surah.id) ? <Text style={[quranText, styles.bismillah]}>{BISMILLAH}</Text> : null}
    </View>
  );

  const prev = surahId > 1 ? getSurah(surahId - 1) : undefined;
  const next = surahId < 114 ? getSurah(surahId + 1) : undefined;
  // Row children follow the layout direction, so "next" is always on the reading-forward side.
  const forward = lang === 'ar' ? 'arrow-back' : 'arrow-forward';
  const backward = lang === 'ar' ? 'arrow-forward' : 'arrow-back';
  const footer = (
    <View style={styles.footer}>
      {prev ? (
        <NavButton
          label={lang === 'ar' ? prev.name : prev.transliteration}
          icon={backward}
          leading
          onPress={() => router.replace({ pathname: '/surah/[id]', params: { id: String(prev.id) } })}
        />
      ) : (
        <View />
      )}
      {next ? (
        <NavButton
          label={lang === 'ar' ? next.name : next.transliteration}
          icon={forward}
          onPress={() => router.replace({ pathname: '/surah/[id]', params: { id: String(next.id) } })}
        />
      ) : null}
    </View>
  );

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title,
          headerRight: () => (
            <View style={styles.fontButtons}>
              <Pressable onPress={() => setFont(-2)} hitSlop={8} accessibilityLabel={t.quran.fontSmaller}>
                <AppText weight="bold" size={14} color={colors.primary}>
                  A−
                </AppText>
              </Pressable>
              <Pressable onPress={() => setFont(2)} hitSlop={8} accessibilityLabel={t.quran.fontBigger}>
                <AppText weight="bold" size={19} color={colors.primary}>
                  A+
                </AppText>
              </Pressable>
            </View>
          ),
        }}
      />
      <FlatList
        ref={listRef}
        data={blocks}
        keyExtractor={(_, i) => String(i)}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.content}
        initialNumToRender={targetAyah ? Math.ceil(targetAyah / BLOCK_SIZE) + 1 : 4}
        onScrollToIndexFailed={({ index }) =>
          setTimeout(() => listRef.current?.scrollToIndex({ index, animated: false, viewOffset: 80 }), 250)
        }
        renderItem={({ item }) => (
          <Text style={[quranText, styles.paragraph]}>
            {item.map((verse) => (
              <Text
                key={verse.id}
                onPress={() => markRead(verse.id)}
                style={selected === verse.id ? { backgroundColor: colors.highlight } : undefined}
              >
                {verse.text}
                <Text style={{ color: colors.primary }}>{` ﴿${toArabicDigits(verse.id)}﴾ `}</Text>
              </Text>
            ))}
          </Text>
        )}
      />
    </View>
  );
}

type NavButtonProps = {
  label: string;
  icon: 'arrow-back' | 'arrow-forward';
  leading?: boolean;
  onPress: () => void;
};

function NavButton({ label, icon, leading, onPress }: NavButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navButton,
        { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      {leading ? <Ionicons name={icon} size={16} color={colors.primary} /> : null}
      <AppText weight="semibold" size={14}>
        {label}
      </AppText>
      {leading ? null : <Ionicons name={icon} size={16} color={colors.primary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  headerBlock: { gap: spacing.md, paddingTop: spacing.sm, marginBottom: spacing.sm },
  banner: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  bannerName: { fontSize: 26, lineHeight: 48 },
  bismillah: { textAlign: 'center' },
  paragraph: { textAlign: 'justify', writingDirection: 'rtl' },
  fontButtons: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingHorizontal: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xl, gap: spacing.md },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
