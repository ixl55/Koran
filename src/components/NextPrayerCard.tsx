import { StyleSheet, View } from 'react-native';
import { useSettings } from '@/context/SettingsContext';
import { useT } from '@/i18n';
import { formatCountdown, formatTime, type PrayerStatus } from '@/lib/prayerTimes';
import { radius, spacing, useTheme } from '@/theme';
import { AppText } from './AppText';

export function NextPrayerCard({ status, now }: { status: PrayerStatus; now: Date }) {
  const { colors } = useTheme();
  const t = useT();
  const { settings } = useSettings();
  const { next, progress } = status;
  const remaining = next.time.getTime() - now.getTime();

  return (
    <View style={[styles.card, { backgroundColor: colors.primary }]}>
      <AppText color={colors.onPrimary} style={styles.dim}>
        {t.prayer.next}
        {next.isTomorrow ? ` · ${t.prayer.tomorrow}` : ''}
      </AppText>
      <AppText weight="bold" size={30} color={colors.onPrimary}>
        {t.prayers[next.key]}
      </AppText>
      <AppText weight="semibold" size={44} color={colors.onPrimary} style={styles.countdown}>
        {formatCountdown(remaining)}
      </AppText>
      <View style={styles.row}>
        <AppText color={colors.onPrimary} style={styles.dim}>
          {formatTime(next.time, settings.language)}
        </AppText>
        <AppText color={colors.onPrimary} style={styles.dim}>
          {Math.round(progress * 100)}%
        </AppText>
      </View>
      <View style={[styles.track, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
        <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: colors.onPrimary }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.xs,
  },
  dim: { opacity: 0.85 },
  countdown: { letterSpacing: 1, fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  track: { height: 6, borderRadius: radius.full, overflow: 'hidden', marginTop: spacing.xs },
  fill: { height: '100%', borderRadius: radius.full },
});
