import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue, type DerivedValue, interpolateColor } from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { fonts } from '@/constants/tokens';
import { Icon } from './Icon';

interface StatusBarProps {
  // Optional shared/derived value 0→1 driving the background swap (matches the appbar collapse).
  scrolled?: SharedValue<number> | DerivedValue<number>;
}

// iOS-style status bar — replicates HTML:498-506.
export function StatusBar({ scrolled }: StatusBarProps) {
  const { colors } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    if (!scrolled) return { backgroundColor: colors.backgroundPrimary };
    return {
      backgroundColor: interpolateColor(
        scrolled.value,
        [0, 1],
        [colors.backgroundPrimary, colors.backgroundSurfaceZ1],
      ),
    };
  });

  return (
    <Animated.View style={[styles.bar, animatedStyle]}>
      <Text style={[styles.time, { color: colors.contentPrimary }]}>9:41</Text>
      <View style={styles.right}>
        <Icon name="signal" size={12} color={colors.contentPrimary} />
        <Icon name="wifi" size={12} color={colors.contentPrimary} />
        <Icon name="batteryFull" size={16} color={colors.contentPrimary} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 8,
  },
  time: {
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 18,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.8,
  },
});
