import { Pressable, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { radius, spacing, useTheme } from '@/theme';

type Props = ViewProps & {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
};

export function Card({ onPress, style, padded = true, children, ...rest }: Props) {
  const { colors, isDark } = useTheme();
  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: padded ? spacing.lg : 0,
    borderWidth: isDark ? StyleSheet.hairlineWidth : 0,
    borderColor: colors.border,
    ...(isDark ? null : styles.shadow),
  };
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && { opacity: 0.7 }, style]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[cardStyle, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
});
