import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { fonts, useTheme } from '@/theme';
import { AppText } from './AppText';

type Props = {
  /** Device heading from true North (degrees), or null when no compass is available. */
  heading: number | null;
  /** Qibla bearing from true North (degrees). */
  bearing: number;
  aligned: boolean;
  size?: number;
};

const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);
const CARDINALS = [
  { label: 'N', angle: 0 },
  { label: 'E', angle: 90 },
  { label: 'S', angle: 180 },
  { label: 'W', angle: 270 },
];

/** Full-size layer rotated around the dial centre; children sit at the top edge. */
function Layer({ angle, children }: { angle: number; children: ReactNode }) {
  return <View style={[StyleSheet.absoluteFill, styles.layer, { transform: [{ rotate: `${angle}deg` }] }]}>{children}</View>;
}

export function Compass({ heading, bearing, aligned, size = 280 }: Props) {
  const { colors } = useTheme();
  const dialRotation = -(heading ?? 0);
  const ring = aligned ? colors.primary : colors.border;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Fixed pointer showing where the phone is facing. */}
      <View style={styles.pointer}>
        <Ionicons name="caret-down" size={22} color={aligned ? colors.primary : colors.text} />
      </View>

      <View
        style={[
          styles.dial,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: ring,
            backgroundColor: colors.card,
            transform: [{ rotate: `${dialRotation}deg` }],
          },
        ]}
      >
        {TICKS.map((angle) => (
          <Layer key={angle} angle={angle}>
            <View
              style={{
                width: angle % 30 === 0 ? 2 : 1,
                height: angle % 90 === 0 ? 14 : angle % 30 === 0 ? 10 : 6,
                marginTop: 6,
                backgroundColor: angle % 90 === 0 ? colors.text : colors.textMuted,
              }}
            />
          </Layer>
        ))}
        {CARDINALS.map(({ label, angle }) => (
          <Layer key={label} angle={angle}>
            <AppText
              weight="bold"
              size={16}
              color={label === 'N' ? colors.danger : colors.text}
              style={{ marginTop: 22, fontFamily: fonts.bold }}
            >
              {label}
            </AppText>
          </Layer>
        ))}

        {/* Qibla needle */}
        <Layer angle={bearing}>
          <View style={[styles.kaaba, { backgroundColor: aligned ? colors.primary : colors.text }]}>
            <FontAwesome5 name="kaaba" size={18} color={colors.card} />
          </View>
          <View style={[styles.needle, { backgroundColor: colors.primary, height: size / 2 - 92 }]} />
        </Layer>
        <View style={[styles.hub, { backgroundColor: colors.primary, borderColor: colors.card }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dial: { borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  layer: { alignItems: 'center' },
  pointer: { position: 'absolute', top: -26, alignSelf: 'center', zIndex: 2 },
  kaaba: {
    marginTop: 48,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needle: { width: 3, borderRadius: 2 },
  hub: { width: 16, height: 16, borderRadius: 8, borderWidth: 3 },
});
