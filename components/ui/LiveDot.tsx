import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface LiveDotProps {
  color: string;
  size?: number;        // outer frame size (default 12)
  innerSize?: number;   // solid dot size (default 8)
}

// Pulsating live indicator: solid dot with an expanding/fading ring.
export function LiveDot({ color, size = 12, innerSize = 8 }: LiveDotProps) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
  }, [pulse]);

  const ringStyle = useAnimatedStyle(() => {
    // Ring expands from innerSize → size, fading from 0.5 → 0
    const scale = 1 + pulse.value * (size / innerSize - 1);
    return {
      transform: [{ scale }],
      opacity: 0.5 * (1 - pulse.value),
    };
  });

  return (
    <View style={[styles.frame, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: color,
          },
          ringStyle,
        ]}
      />
      <View
        style={[
          styles.dot,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  dot: {
    position: 'absolute',
  },
});
