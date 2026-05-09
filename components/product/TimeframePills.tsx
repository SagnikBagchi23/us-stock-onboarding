import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/constants/theme';
import { textStyles, motion, easing, radius } from '@/constants/tokens';
import { TIMEFRAME_ORDER, type Timeframe } from '@/utils/chart';

interface TimeframePillsProps {
  active: Timeframe;
  onChange: (tf: Timeframe) => void;
}

export function TimeframePills({ active, onChange }: TimeframePillsProps) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {TIMEFRAME_ORDER.map((tf) => (
        <Pill key={tf} tf={tf} active={tf === active} onPress={onChange} />
      ))}
    </View>
  );
}

function Pill({ tf, active, onPress }: { tf: Timeframe; active: boolean; onPress: (tf: Timeframe) => void }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handle = useCallback(() => onPress(tf), [tf, onPress]);

  return (
    <Animated.View style={aStyle}>
      <Pressable
        onPressIn={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          scale.value = withTiming(0.96, { duration: motion.press, easing: easing.out });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: motion.press, easing: easing.out });
        }}
        onPress={handle}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        style={[
          styles.pill,
          active && {
            backgroundColor: colors.backgroundTertiary,
            borderColor: colors.contentPrimary,
          },
        ]}
      >
        <Text
          style={[
            textStyles.bodySmallHeavy,
            { color: active ? colors.contentPrimary : colors.contentSecondary },
          ]}
        >
          {tf}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pill: {
    height: 24,
    paddingHorizontal: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
