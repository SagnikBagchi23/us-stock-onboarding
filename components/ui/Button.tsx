import React from 'react';
import { Pressable, Text, StyleSheet, type ViewStyle, type GestureResponderEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { textStyles, radius, motion, easing } from '@/constants/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  variant?: Variant;
  onPress?: (e: GestureResponderEvent) => void;
  children: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Mirrors .btn / .btn--{primary,secondary,ghost} from reference/index.html:181-202.
export function Button({ variant = 'primary', onPress, children, style, disabled }: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const bg =
    variant === 'primary'
      ? colors.backgroundAccent
      : variant === 'secondary'
        ? colors.backgroundTertiary
        : 'transparent';
  const fg =
    variant === 'primary'
      ? colors.contentOnColour
      : variant === 'secondary'
        ? colors.contentPrimary
        : colors.contentAccent;

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: motion.press, easing: easing.out });
        opacity.value = withTiming(0.92, { duration: motion.press, easing: easing.out });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: motion.press, easing: easing.out });
        opacity.value = withTiming(1, { duration: motion.press, easing: easing.out });
      }}
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: bg }, style, animatedStyle]}
    >
      <Text style={[styles.label, { color: fg }]}>{children}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  label: {
    ...textStyles.bodyBaseHeavy,
  },
});
