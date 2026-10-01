import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '@/context/SettingsContext';
import { BISMILLAH, getSurah } from '@/data/quran';
import type { Dhikr } from '@/data/duas';
import { formatNumber, toArabicDigits, useT } from '@/i18n';
import { fonts, radius, spacing, useTheme } from '@/theme';
import { AppText } from './AppText';
import { Card } from './Card';

function dhikrText(item: Dhikr): string {
  if (item.text) return item.text;
  if (!item.ref) return '';
  const { surah, from, to = from } = item.ref;
  const verses = getSurah(surah)?.verses.slice(from - 1, to) ?? [];
  const body = verses.map((v) => `${v.text} ﴿${toArabicDigits(v.id)}﴾`).join(' ');
  return item.basmala ? `${BISMILLAH}\n${body}` : body;
}

type Props = { item: Dhikr; done: number; onCount: () => void; onReset: () => void };

export function DhikrCard({ item, done, onCount, onReset }: Props) {
  const { colors } = useTheme();
  const t = useT();
  const { settings } = useSettings();
  const lang = settings.language;
  const size = settings.duaFontSize;
  const complete = done >= item.count;

  const press = () => {
    if (complete) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(done + 1 >= item.count ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onCount();
  };

  return (
    <Card style={[styles.card, complete && { opacity: 0.6 }]}>
      <Pressable onPress={press} onLongPress={onReset}>
        <Text
          style={{
            fontFamily: fonts.quran,
            fontSize: size,
            lineHeight: Math.round(size * 2),
            color: colors.text,
            textAlign: 'center',
            writingDirection: 'rtl',
          }}
        >
          {dhikrText(item)}
        </Text>
      </Pressable>

      {lang === 'en' ? (
        <AppText muted size={14} style={styles.translation}>
          {item.en}
        </AppText>
      ) : null}

      {item.note ? (
        <AppText size={13} color={colors.primary} center>
          {item.note[lang]}
        </AppText>
      ) : null}

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <AppText muted size={12} style={styles.source}>
          {t.duas.source}: {item.source[lang]}
        </AppText>
        <Pressable
          onPress={press}
          onLongPress={onReset}
          style={({ pressed }) => [
            styles.counter,
            {
              backgroundColor: complete ? colors.primary : colors.primarySoft,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
          accessibilityLabel={t.duas.tapToCount}
        >
          <AppText weight="bold" size={15} color={complete ? colors.onPrimary : colors.primary}>
            {complete ? `✓ ${t.duas.done}` : `${formatNumber(done, lang)} / ${formatNumber(item.count, lang)}`}
          </AppText>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  translation: { textAlign: 'left', writingDirection: 'ltr' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.md,
  },
  source: { flex: 1 },
  counter: {
    minWidth: 92,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignItems: 'center',
  },
});
