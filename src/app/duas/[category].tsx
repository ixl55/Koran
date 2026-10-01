import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { DhikrCard } from '@/components/DhikrCard';
import { useSettings } from '@/context/SettingsContext';
import { getCategory } from '@/data/duas';
import { formatNumber, useT } from '@/i18n';
import { radius, spacing, useTheme } from '@/theme';

export default function DuaCategoryScreen() {
  const { category: id } = useLocalSearchParams<{ category: string }>();
  const category = getCategory(id);
  const t = useT();
  const { colors } = useTheme();
  const { settings } = useSettings();
  const lang = settings.language;
  const [counts, setCounts] = useState<number[]>(() => category?.items.map(() => 0) ?? []);

  if (!category) return null;

  const completed = category.items.filter((item, i) => counts[i] >= item.count).length;
  const progress = completed / category.items.length;

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: category.title[lang],
          headerRight: () => (
            <Pressable onPress={() => setCounts(category.items.map(() => 0))} hitSlop={8} style={styles.headerButton}>
              <AppText weight="semibold" size={14} color={colors.primary}>
                {t.duas.reset}
              </AppText>
            </Pressable>
          ),
        }}
      />
      <View style={styles.progressWrap}>
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
        </View>
        <AppText muted size={12}>
          {formatNumber(completed, lang)} / {formatNumber(category.items.length, lang)}
        </AppText>
      </View>
      <FlatList
        data={category.items}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <DhikrCard
            item={item}
            done={counts[index]}
            onCount={() => setCounts((c) => c.map((v, i) => (i === index ? v + 1 : v)))}
            onReset={() => setCounts((c) => c.map((v, i) => (i === index ? 0 : v)))}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { padding: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl, gap: spacing.md },
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  track: { flex: 1, height: 4, borderRadius: radius.full, overflow: 'hidden' },
  fill: { height: '100%' },
  headerButton: { paddingHorizontal: spacing.sm },
});
