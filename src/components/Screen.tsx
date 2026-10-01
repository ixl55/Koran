import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, useTheme } from '@/theme';
import { AppText } from './AppText';

type Props = ScrollViewProps & {
  title?: string;
  subtitle?: string;
  scroll?: boolean;
  children: ReactNode;
};

export function Screen({ title, subtitle, scroll = true, children, contentContainerStyle, ...rest }: Props) {
  const { colors } = useTheme();
  const header = title ? (
    <View style={styles.header}>
      <AppText weight="bold" size={26}>
        {title}
      </AppText>
      {subtitle ? <AppText muted>{subtitle}</AppText> : null}
    </View>
  ) : null;

  return (
    <SafeAreaView edges={['top']} style={[styles.flex, { backgroundColor: colors.background }]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          {...rest}
        >
          {header}
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.content]}>
          {header}
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  header: { marginBottom: spacing.sm },
});
