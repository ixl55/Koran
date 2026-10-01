import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { NextPrayerCard } from '@/components/NextPrayerCard';
import { PrayerRow } from '@/components/PrayerRow';
import { Screen } from '@/components/Screen';
import { useSettings } from '@/context/SettingsContext';
import { useNow } from '@/hooks/useNow';
import { usePrayerConfig } from '@/hooks/usePrayerConfig';
import { useT } from '@/i18n';
import { formatGregorian, formatHijri } from '@/lib/hijri';
import { detectLocation } from '@/lib/location';
import { requestNotificationPermission } from '@/lib/notifications';
import { formatTime, getPrayerStatus, PRAYER_KEYS, type PrayerKey } from '@/lib/prayerTimes';
import { radius, spacing, useTheme } from '@/theme';

export default function PrayerTimesScreen() {
  const t = useT();
  const { colors } = useTheme();
  const { settings, update } = useSettings();
  const config = usePrayerConfig();
  const now = useNow(1000);
  const [locating, setLocating] = useState(false);
  const [denied, setDenied] = useState(false);
  const lang = settings.language;

  const locate = async () => {
    setLocating(true);
    const result = await detectLocation();
    setLocating(false);
    if (result.ok) {
      setDenied(false);
      update({ location: result.location });
    } else {
      setDenied(true);
    }
  };

  // First launch: ask for the location straight away.
  useEffect(() => {
    if (!settings.location) locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cheap to compute (pure astronomy), so it is simply refreshed with the 1s clock.
  const status = useMemo(() => (config ? getPrayerStatus(config, now) : null), [config, now]);

  const toggleNotify = async (key: PrayerKey) => {
    const enable = !settings.notifications[key];
    if (enable) await requestNotificationPermission();
    update({ notifications: { ...settings.notifications, [key]: enable } });
  };

  if (!config || !status) {
    return (
      <Screen title={t.tabs.prayer}>
        <Card style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="location-outline" size={32} color={colors.primary} />
          </View>
          <AppText weight="bold" size={18} center>
            {t.prayer.noLocationTitle}
          </AppText>
          <AppText muted center>
            {t.prayer.noLocationBody}
          </AppText>
          <Pressable
            onPress={locate}
            disabled={locating}
            style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}
          >
            {locating ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <AppText weight="semibold" color={colors.onPrimary}>
                {t.prayer.allowLocation}
              </AppText>
            )}
          </Pressable>
          {denied ? (
            <AppText size={13} color={colors.danger} center>
              {t.prayer.locationDenied}
            </AppText>
          ) : null}
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.flex}>
          <Pressable onPress={locate} style={styles.city} hitSlop={8}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <AppText weight="semibold" size={16} numberOfLines={1}>
              {settings.location?.city ?? t.prayer.unknownCity}
            </AppText>
            {locating ? <ActivityIndicator size="small" color={colors.primary} /> : null}
          </Pressable>
          <AppText muted size={13}>
            {formatGregorian(now, lang)}
          </AppText>
        </View>
        <View style={[styles.hijri, { backgroundColor: colors.primarySoft }]}>
          <AppText weight="semibold" size={13} color={colors.primary}>
            {formatHijri(now, lang)}
          </AppText>
        </View>
      </View>

      <NextPrayerCard status={status} now={now} />

      <View style={styles.list}>
        {PRAYER_KEYS.map((key) => {
          const time = status.today[key];
          const isNext = !status.next.isTomorrow && status.next.key === key;
          return (
            <PrayerRow
              key={key}
              name={t.prayers[key]}
              time={formatTime(time, lang)}
              passed={time.getTime() <= now.getTime()}
              isNext={isNext}
              notify={settings.notifications[key]}
              onToggleNotify={() => toggleNotify(key)}
            />
          );
        })}
      </View>

      <AppText muted size={12} center>
        {t.prayer.method}: {t.methods[config.resolvedMethod]}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  city: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  hijri: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full },
  list: { gap: spacing.sm },
  empty: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  button: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    minWidth: 180,
    alignItems: 'center',
  },
});
