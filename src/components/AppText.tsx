import { Text, type TextProps, type TextStyle } from 'react-native';
import { fonts, useTheme } from '@/theme';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

type Props = TextProps & {
  weight?: Weight;
  size?: number;
  muted?: boolean;
  color?: string;
  center?: boolean;
};

export function AppText({ weight = 'regular', size = 15, muted, color, center, style, ...rest }: Props) {
  const { colors } = useTheme();
  const base: TextStyle = {
    fontFamily: fonts[weight],
    fontSize: size,
    lineHeight: Math.round(size * 1.6),
    color: color ?? (muted ? colors.textMuted : colors.text),
    textAlign: center ? 'center' : 'auto',
  };
  return <Text {...rest} style={[base, style]} />;
}
