import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { DUA_FONT, QURAN_FONT, useSettings, type Settings, type ThemeMode } from '@/context/SettingsContext';
import { useT, type Language } from '@/i18n';
import { applyDirection, reloadApp } from '@/lib/direction';
import { detectLocation } from '@/lib/location';
import { requestNotificationPermission } from '@/lib/notifications';
import { METHOD_KEYS, methodForCountry, PRAYER_KEYS, type PrayerKey } from '@/lib/prayerTimes';
import { fonts, radius, spacing, useTheme } from '@/theme';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText weight="semibold" muted size={13} style={styles.sectionTitle}>
        {title}
      </AppText>
      <Card style={styles.sectionCard}>{children}</Card>
    </View>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.segment, { backgroundColor: colors.background }]}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={[styles.segmentItem, active && { backgroundColor: colors.primary }]}
          >
            <AppText size={13} weight="semibold" color={active ? colors.onPrimary : colors.textMuted}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

function Row({ label, children, onPress }: { label: string; children?: ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.row}>
      <AppText weight="medium" style={styles.rowLabel}>
        {label}
      </AppText>
      {children}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const t = useT();
  const { colors } = useTheme();
  const { settings, update } = useSettings();
  const [methodsOpen, setMethodsOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const lang = settings.language;

  const changeLanguage = (next: Language) => {
    if (next === lang) return;
    const apply = async () => {
      await update({ language: next });
      if (applyDirection(next)) await reloadApp();
    };
    if (Platform.OS === 'web') {
      apply();
      return;
    }
    Alert.alert(t.settings.restartTitle, t.settings.restartBody, [
      { text: t.settings.cancel, style: 'cancel' },
      { text: t.settings.ok, onPress: apply },
    ]);
  };

  const toggleNotification = async (key: PrayerKey, value: boolean) => {
    if (value && !(await requestNotificationPermission()) && Platform.OS !== 'web') {
      Alert.alert(t.settings.notifications, t.settings.notifPermissionDenied);
    }
    update({ notifications: { ...settings.notifications, [key]: value } });
  };

  const refreshLocation = async () => {
    setLocating(true);
    const result = await detectLocation();
    setLocating(false);
    if (result.ok) update({ location: result.location });
    else Alert.alert(t.settings.location, t.prayer.locationDenied);
  };

  const autoMethod = methodForCountry(settings.location?.countryCode);
  const methodLabel =
    settings.method === 'auto' ? `${t.methods.auto} (${t.methods[autoMethod]})` : t.methods[settings.method];

  return (
    <Screen title={t.settings.title}>
      <Section title={t.settings.general}>
        <Row label={t.settings.language}>
          <Segmented<Language>
            value={lang}
            onChange={changeLanguage}
            options={[
              { value: 'ar', label: 'العربية' },
              { value: 'en', label: 'English' },
            ]}
          />
        </Row>
        <Divider />
        <Row label={t.settings.theme}>
          <Segmented<ThemeMode>
            value={settings.themeMode}
            onChange={(themeMode) => update({ themeMode })}
            options={[
              { value: 'system', label: t.settings.themeSystem },
              { value: 'light', label: t.settings.themeLight },
              { value: 'dark', label: t.settings.themeDark },
            ]}
          />
        </Row>
      </Section>

      <Section title={t.settings.prayerSection}>
        <Row label={t.settings.location} onPress={refreshLocation}>
          <View style={styles.inline}>
            {locating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <AppText muted size={13} numberOfLines={1} style={styles.value}>
                {settings.location?.city ?? (settings.location ? t.prayer.unknownCity : '—')}
              </AppText>
            )}
            <Ionicons name="refresh" size={18} color={colors.primary} />
          </View>
        </Row>
        <Divider />
        <Row label={t.settings.method} onPress={() => setMethodsOpen((o) => !o)}>
          <Ionicons name={methodsOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
        </Row>
        <AppText size={13} color={colors.primary} style={styles.methodValue}>
          {methodLabel}
        </AppText>
        {methodsOpen ? (
          <View style={styles.methodList}>
            {(['auto', ...METHOD_KEYS] as Settings['method'][]).map((key) => {
              const active = settings.method === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => {
                    update({ method: key });
                    setMethodsOpen(false);
                  }}
                  style={[styles.methodItem, active && { backgroundColor: colors.primarySoft }]}
                >
                  <AppText size={14} color={active ? colors.primary : colors.text} style={styles.flex}>
                    {t.methods[key]}
                  </AppText>
                  {active ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
                </Pressable>
              );
            })}
          </View>
        ) : null}
        <Divider />
        <View style={styles.block}>
          <AppText weight="medium">{t.settings.madhab}</AppText>
          <Segmented<Settings['madhab']>
            value={settings.madhab}
            onChange={(madhab) => update({ madhab })}
            options={[
              { value: 'shafi', label: t.settings.shafi },
              { value: 'hanafi', label: t.settings.hanafi },
            ]}
          />
        </View>
      </Section>

      <Section title={t.settings.notifications}>
        <AppText muted size={13} style={styles.hint}>
          {t.settings.notificationsHint}
        </AppText>
        {PRAYER_KEYS.map((key, i) => (
          <View key={key}>
            {i > 0 ? <Divider /> : null}
            <Row label={t.prayers[key]}>
              <Switch
                value={settings.notifications[key]}
                onValueChange={(v) => toggleNotification(key, v)}
                trackColor={{ true: colors.primary, false: colors.border }}
                thumbColor="#FFFFFF"
              />
            </Row>
          </View>
        ))}
      </Section>

      <Section title={t.settings.reading}>
        <View style={styles.block}>
          <AppText weight="medium">{t.settings.quranFont}</AppText>
          <Text
            style={{
              fontFamily: fonts.quran,
              fontSize: settings.quranFontSize,
              lineHeight: settings.quranFontSize * 2,
              color: colors.text,
              textAlign: 'center',
            }}
          >
            {t.settings.preview}
          </Text>
          <Slider
            minimumValue={QURAN_FONT.min}
            maximumValue={QURAN_FONT.max}
            step={1}
            value={settings.quranFontSize}
            onSlidingComplete={(v) => update({ quranFontSize: v })}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
        </View>
        <Divider />
        <View style={styles.block}>
          <AppText weight="medium">{t.settings.duaFont}</AppText>
          <Text
            style={{
              fontFamily: fonts.quran,
              fontSize: settings.duaFontSize,
              lineHeight: settings.duaFontSize * 2,
              color: colors.text,
              textAlign: 'center',
            }}
          >
            سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
          </Text>
          <Slider
            minimumValue={DUA_FONT.min}
            maximumValue={DUA_FONT.max}
            step={1}
            value={settings.duaFontSize}
            onSlidingComplete={(v) => update({ duaFontSize: v })}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
        </View>
      </Section>

      <Section title={t.settings.about}>
        <View style={styles.block}>
          <AppText muted size={13}>
            {t.settings.aboutBody}
          </AppText>
        </View>
      </Section>
    </Screen>
  );
}

function Divider() {
  const { colors } = useTheme();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { gap: spacing.sm, marginTop: spacing.sm },
  sectionTitle: { paddingHorizontal: spacing.xs },
  sectionCard: { paddingVertical: spacing.xs, paddingHorizontal: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  rowLabel: { flexShrink: 1 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  value: { flexShrink: 1 },
  block: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  hint: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: spacing.lg },
  segment: { flexDirection: 'row', borderRadius: radius.full, padding: 3, gap: 2, flexShrink: 1 },
  segmentItem: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.full, flexShrink: 1, alignItems: 'center' },
  methodValue: { paddingHorizontal: spacing.lg, marginTop: -spacing.sm, paddingBottom: spacing.sm },
  methodList: { paddingHorizontal: spacing.sm, paddingBottom: spacing.sm },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
});
