import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  type SharedValue,
  type DerivedValue,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { IconButton } from './IconButton';

interface AppBarProps {
  onBack?: () => void;
  scrolled?: SharedValue<number> | DerivedValue<number>;
}

// Simple scroll-aware app bar — back button only.
// Pass `scrolled` (0→1) to animate background + hairline divider on scroll.
export function AppBar({ onBack, scrolled }: AppBarProps) {
  const { colors } = useTheme();

  const containerStyle = useAnimatedStyle(() => {
    const v = scrolled?.value ?? 0;
    return {
      backgroundColor: interpolateColor(v, [0, 1], [colors.backgroundPrimary, colors.backgroundSurfaceDocked]),
      borderBottomColor: interpolateColor(v, [0, 1], ['transparent', colors.borderPrimary]),
    };
  });

  return (
    <Animated.View style={[styles.bar, containerStyle]}>
      <IconButton name="arrowLeft" onPress={onBack} ariaLabel="Back" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
