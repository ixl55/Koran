import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { radius, spacing, useTheme } from '@/theme';
import { AppText } from './AppText';

type Props = {
  name: string;
  time: string;
  passed: boolean;
  isNext: boolean;
  notify: boolean;
  onToggleNotify: () => void;
};

export function PrayerRow({ name, time, passed, isNext, notify, onToggleNotify }: Props) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: isNext ? colors.primarySoft : colors.card, borderColor: isNext ? colors.primary : colors.border },
      ]}
    >
      <View style={styles.nameWrap}>
        {passed ? (
          <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
        ) : (
          <View style={[styles.dot, { backgroundColor: isNext ? colors.primary : colors.border }]} />
        )}
        <AppText weight={isNext ? 'bold' : 'medium'} size={17} color={passed ? colors.textMuted : undefined}>
          {name}
        </AppText>
      </View>
      <View style={styles.end}>
        <AppText weight={isNext ? 'bold' : 'medium'} size={17} color={isNext ? colors.primary : passed ? colors.textMuted : undefined}>
          {time}
        </AppText>
        <Pressable onPress={onToggleNotify} hitSlop={12} accessibilityRole="switch" accessibilityState={{ checked: notify }}>
          <Ionicons
            name={notify ? 'notifications' : 'notifications-off-outline'}
            size={20}
            color={notify ? colors.primary : colors.textMuted}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  nameWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  end: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 5 },
});
