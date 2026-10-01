import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { useSettings } from '@/context/SettingsContext';
import { getQuran, getSurah, JUZ_STARTS, normalizeArabic } from '@/data/quran';
import { formatAyahCount, formatNumber, useT } from '@/i18n';
import { fonts, radius, spacing, useTheme } from '@/theme';

type Tab = 'surahs' | 'juz';

function openSurah(id: number, ayah?: number) {
  router.push({ pathname: '/surah/[id]', params: ayah ? { id: String(id), ayah: String(ayah) } : { id: String(id) } });
}

export default function QuranScreen() {
  const t = useT();
  const { colors } = useTheme();
  const { settings } = useSettings();
  const lang = settings.language;
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('surahs');

  const surahs = useMemo(() => getQuran().map(({ verses: _verses, ...meta }) => meta), []);
  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return surahs;
    const nq = normalizeArabic(q);
    return surahs.filter(
      (s) =>
        String(s.id) === q ||
        normalizeArabic(s.name).includes(nq) ||
        s.transliteration.toLowerCase().replace(/['-]/g, '').includes(q.toLowerCase().replace(/['-]/g, '')),
    );
  }, [query, surahs]);

  const lastRead = settings.lastRead ? getSurah(settings.lastRead.surah) : undefined;

  const header = (
    <View style={styles.headerWrap}>
      <AppText weight="bold" size={26}>
        {t.quran.title}
      </AppText>

      {lastRead && settings.lastRead ? (
        <Pressable
          onPress={() => openSurah(lastRead.id, settings.lastRead!.ayah)}
          style={({ pressed }) => [styles.continue, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
        >
          <View style={styles.flex}>
            <AppText size={13} color={colors.onPrimary} style={{ opacity: 0.85 }}>
              {t.quran.continueReading}
            </AppText>
            <AppText weight="bold" size={18} color={colors.onPrimary}>
              {t.quran.surah} {lang === 'ar' ? lastRead.name : lastRead.transliteration} ·{' '}
              {t.quran.ayah} {formatNumber(settings.lastRead.ayah, lang)}
            </AppText>
          </View>
          <Ionicons name="book" size={28} color={colors.onPrimary} />
        </Pressable>
      ) : null}

      <View style={[styles.segment, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {(['surahs', 'juz'] as Tab[]).map((key) => (
          <Pressable
            key={key}
            onPress={() => setTab(key)}
            style={[styles.segmentItem, tab === key && { backgroundColor: colors.primary }]}
          >
            <AppText weight="semibold" color={tab === key ? colors.onPrimary : colors.textMuted}>
              {key === 'surahs' ? t.quran.surahs : t.quran.juz}
            </AppText>
          </Pressable>
        ))}
      </View>

      {tab === 'surahs' ? (
        <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t.quran.search}
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { color: colors.text }]}
            clearButtonMode="while-editing"
          />
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={[styles.flex, { backgroundColor: colors.background }]}>
      {tab === 'surahs' ? (
        <FlatList
          data={filtered}
          keyExtractor={(s) => String(s.id)}
          ListHeaderComponent={header}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <AppText muted center>
              {t.quran.noResults}
            </AppText>
          }
          renderItem={({ item }) => (
            <Card onPress={() => openSurah(item.id)} style={styles.row}>
              <View style={[styles.number, { backgroundColor: colors.primarySoft }]}>
                <AppText weight="bold" size={14} color={colors.primary}>
                  {formatNumber(item.id, lang)}
                </AppText>
              </View>
              <View style={styles.flex}>
                <AppText weight="semibold" size={16}>
                  {lang === 'ar' ? item.name : item.transliteration}
                </AppText>
                <AppText muted size={12}>
                  {item.type === 'meccan' ? t.quran.meccan : t.quran.medinan} · {formatAyahCount(item.total_verses, lang)}
                </AppText>
              </View>
              <AppText style={{ fontFamily: fonts.quran, fontSize: 22, lineHeight: 40 }} color={colors.primary}>
                {item.name}
              </AppText>
            </Card>
          )}
        />
      ) : (
        <FlatList
          data={JUZ_STARTS.map(([surah, ayah], i) => ({ juz: i + 1, surah, ayah }))}
          keyExtractor={(j) => String(j.juz)}
          ListHeaderComponent={header}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const s = getSurah(item.surah)!;
            return (
              <Card onPress={() => openSurah(item.surah, item.ayah)} style={styles.row}>
                <View style={[styles.number, { backgroundColor: colors.primarySoft }]}>
                  <AppText weight="bold" size={14} color={colors.primary}>
                    {formatNumber(item.juz, lang)}
                  </AppText>
                </View>
                <View style={styles.flex}>
                  <AppText weight="semibold" size={16}>
                    {t.quran.juzN} {formatNumber(item.juz, lang)}
                  </AppText>
                  <AppText muted size={12}>
                    {lang === 'ar' ? s.name : s.transliteration} · {t.quran.ayah} {formatNumber(item.ayah, lang)}
                  </AppText>
                </View>
                <Ionicons name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.textMuted} />
              </Card>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.sm },
  headerWrap: { gap: spacing.md, marginBottom: spacing.sm },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  segment: { flexDirection: 'row', borderRadius: radius.full, padding: 4, borderWidth: StyleSheet.hairlineWidth },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.full },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: { flex: 1, paddingVertical: spacing.md, fontFamily: fonts.regular, fontSize: 15, textAlign: 'auto' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  number: { width: 40, height: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
});
