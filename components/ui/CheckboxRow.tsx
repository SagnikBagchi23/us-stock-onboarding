import React, { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing, easing } from '@/constants/tokens';
import { Icon } from './Icon';

interface CheckboxRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CheckboxRow({ label, checked, onToggle }: CheckboxRowProps) {
  const { colors } = useTheme();
  const rowScale = useSharedValue(1);
  const checkScale = useSharedValue(checked ? 1 : 0);
  const checkOpacity = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    if (checked) {
      // Spring pop on check — deliberate, satisfying
      checkScale.value = withSpring(1, { duration: 220, dampingRatio: 0.6 });
      checkOpacity.value = withTiming(1, { duration: 120, easing: easing.out });
    } else {
      // Snap off — fast, responsive
      checkScale.value = withTiming(0, { duration: 100, easing: easing.out });
      checkOpacity.value = withTiming(0, { duration: 80, easing: easing.out });
    }
  }, [checked]);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rowScale.value }],
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        rowScale.value = withTiming(0.99, { duration: 100, easing: easing.out });
      }}
      onPressOut={() => {
        rowScale.value = withTiming(1, { duration: 100, easing: easing.out });
      }}
      onPress={onToggle}
      style={[styles.row, rowStyle]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: checked ? colors.backgroundAccent : 'transparent',
            borderColor: checked ? colors.backgroundAccent : colors.borderPrimary,
          },
        ]}
      >
        <Animated.View style={checkmarkStyle}>
          <Icon name="tick" size={13} color={colors.contentOnColour} />
        </Animated.View>
      </View>
      <Text style={[textStyles.bodyBase, styles.label, { color: colors.contentPrimary }]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  label: {
    flex: 1,
  },
});
