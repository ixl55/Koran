import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Compass } from '@/components/Compass';
import { Screen } from '@/components/Screen';
import { useSettings } from '@/context/SettingsContext';
import { formatNumber, useT } from '@/i18n';
import { distanceToKaaba, qiblaBearing, qiblaOffset } from '@/lib/qibla';
import { spacing, useTheme } from '@/theme';

const ALIGN_TOLERANCE = 5;

export default function QiblaScreen() {
  const t = useT();
  const { colors } = useTheme();
  const { settings } = useSettings();
  const lang = settings.language;
  const location = settings.location;
  const [heading, setHeading] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState(3);
  const [supported, setSupported] = useState(Platform.OS !== 'web');
  const wasAligned = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    let subscription: Location.LocationSubscription | undefined;
    let cancelled = false;
    Location.watchHeadingAsync((h) => {
      const value = h.trueHeading >= 0 ? h.trueHeading : h.magHeading;
      setHeading((prev) => (prev === null || Math.abs(prev - value) >= 1 ? value : prev));
      setAccuracy(h.accuracy);
    })
      .then((sub) => {
        if (cancelled) sub.remove();
        else subscription = sub;
      })
      .catch(() => setSupported(false));
    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []);

  const bearing = location ? qiblaBearing(location.latitude, location.longitude) : 0;
  const offset = heading === null ? null : qiblaOffset(bearing, heading);
  const aligned = offset !== null && Math.abs(offset) <= ALIGN_TOLERANCE;

  useEffect(() => {
    if (aligned && !wasAligned.current && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    wasAligned.current = aligned;
  }, [aligned]);

  if (!location) {
    return (
      <Screen title={t.qibla.title}>
        <Card>
          <AppText muted center>
            {t.qibla.needLocation}
          </AppText>
        </Card>
      </Screen>
    );
  }

  const distance = Math.round(distanceToKaaba(location.latitude, location.longitude));

  return (
    <Screen title={t.qibla.title} subtitle={location.city}>
      <View style={styles.center}>
        <Compass heading={supported ? heading : null} bearing={bearing} aligned={aligned} />
      </View>

      <View style={styles.center}>
        <AppText weight="bold" size={40} color={aligned ? colors.primary : colors.text}>
          {formatNumber(Math.round(bearing), lang)}°
        </AppText>
        <AppText muted>{t.qibla.fromNorth}</AppText>
      </View>

      <Card style={styles.status}>
        {!supported ? (
          <AppText center>{t.qibla.notSupported} {formatNumber(Math.round(bearing), lang)}°</AppText>
        ) : (
          <AppText weight="semibold" center color={aligned ? colors.primary : colors.text}>
            {aligned ? t.qibla.aligned : t.qibla.turn}
          </AppText>
        )}
        {supported && accuracy < 2 ? (
          <AppText size={13} center color={colors.danger}>
            {t.qibla.calibrate}
          </AppText>
        ) : null}
        <AppText muted size={13} center>
          {t.qibla.distance}: {formatNumber(distance.toLocaleString('en-US'), lang)} {t.qibla.km}
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingTop: spacing.xl },
  status: { gap: spacing.sm, marginTop: spacing.md },
});
