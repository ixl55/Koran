import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { useSettings } from '@/context/SettingsContext';
import { DUA_CATEGORIES } from '@/data/duas';
import { formatNumber, useT } from '@/i18n';
import { radius, spacing, useTheme } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export default function DuasScreen() {
  const t = useT();
  const { colors } = useTheme();
  const { settings } = useSettings();
  const lang = settings.language;

  return (
    <Screen title={t.duas.title}>
      <View style={styles.grid}>
        {DUA_CATEGORIES.map((category) => (
          <Card
            key={category.id}
            style={styles.tile}
            onPress={() => router.push({ pathname: '/duas/[category]', params: { category: category.id } })}
          >
            <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name={category.icon as IconName} size={22} color={colors.primary} />
            </View>
            <AppText weight="semibold" size={15} numberOfLines={1}>
              {category.title[lang]}
            </AppText>
            <AppText muted size={12}>
              {formatNumber(category.items.length, lang)} {t.duas.items}
            </AppText>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: { flexBasis: '47%', flexGrow: 1, gap: spacing.xs },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
});
