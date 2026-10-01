import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Settings } from '@/context/SettingsContext';
import { getStrings } from '@/i18n';
import { getUpcomingTimes, methodForCountry, PRAYER_KEYS } from '@/lib/prayerTimes';

export const ADHAN_CHANNEL = 'adhan';

/** iOS keeps at most 64 pending local notifications, so we schedule a rolling window. */
const DAYS_AHEAD = 7;

const supported = Platform.OS === 'ios' || Platform.OS === 'android';

export function configureNotifications() {
  if (!supported) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ADHAN_CHANNEL, {
    name: 'الأذان',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 400, 200, 400],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!supported) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

/**
 * Cancels every pending adhan notification and schedules the next DAYS_AHEAD days
 * for the prayers the user enabled. Safe to call often (app start, settings change).
 */
export async function rescheduleAdhan(settings: Settings): Promise<number> {
  if (!supported) return 0;
  await Notifications.cancelAllScheduledNotificationsAsync();

  const { location } = settings;
  const enabled = PRAYER_KEYS.filter((k) => settings.notifications[k]);
  if (!location || enabled.length === 0) return 0;

  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return 0;

  await ensureChannel();
  const t = getStrings(settings.language);
  const method = settings.method === 'auto' ? methodForCountry(location.countryCode) : settings.method;
  const upcoming = getUpcomingTimes(
    { latitude: location.latitude, longitude: location.longitude, method, madhab: settings.madhab },
    new Date(),
    DAYS_AHEAD,
  ).filter((p) => settings.notifications[p.key]);

  for (const { key, time } of upcoming) {
    const name = t.prayers[key];
    const isSunrise = key === 'sunrise';
    await Notifications.scheduleNotificationAsync({
      content: {
        title: isSunrise
          ? settings.language === 'ar' ? 'الشروق' : 'Sunrise'
          : settings.language === 'ar' ? `حان الآن وقت صلاة ${name}` : `It's time for ${name}`,
        body: location.city ?? '',
        sound: 'default',
        data: { prayer: key },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: time,
        channelId: ADHAN_CHANNEL,
      },
    });
  }
  return upcoming.length;
}
