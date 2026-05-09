import React from 'react';
import { Pressable, Text, StyleSheet, type ViewStyle, type GestureResponderEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/constants/theme';
import { textStyles, radius, motion, easing } from '@/constants/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'large' | 'medium';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  onPress?: (e: GestureResponderEvent) => void;
  children: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Mirrors .btn / .btn--{primary,secondary,ghost} from reference/index.html:181-202.
export function Button({ variant = 'primary', size = 'large', onPress, children, style, disabled }: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const bg =
    disabled
      ? colors.backgroundDisabled
      : variant === 'primary'
        ? colors.backgroundAccent
        : variant === 'secondary'
          ? colors.backgroundTertiary
          : 'transparent';
  const fg =
    disabled
      ? colors.contentDisabled
      : variant === 'primary'
        ? colors.contentOnColour
        : variant === 'secondary'
          ? colors.contentPrimary
          : colors.contentAccent;

  return (
    <AnimatedPressable
      onPressIn={() => {
        if (!disabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withTiming(0.97, { duration: motion.press, easing: easing.out });
        opacity.value = withTiming(0.92, { duration: motion.press, easing: easing.out });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { duration: 400, dampingRatio: 0.5 });
        opacity.value = withTiming(1, { duration: motion.press, easing: easing.out });
      }}
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: bg, height: size === 'medium' ? 40 : 48 }, style, animatedStyle]}
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
