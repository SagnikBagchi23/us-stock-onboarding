import React, { useEffect } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing, radius, easing, motion } from '@/constants/tokens';
import { Icon } from './Icon';

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
  isOpen?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Bordered tap-target with a label above and a chevron-down on the right.
// Mirrors mds-input-textfield/default in select mode (Figma 2590:180519).
export function SelectField({ label, value, placeholder, onPress, isOpen = false }: SelectFieldProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const chevronRotation = useSharedValue(0);

  useEffect(() => {
    chevronRotation.value = withTiming(isOpen ? 180 : 0, { duration: 200, easing: easing.out });
  }, [isOpen]);

  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  const showPlaceholder = !value;

  return (
    <View style={styles.wrap}>
      <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>{label}</Text>
      <AnimatedPressable
        onPressIn={() => {
          scale.value = withTiming(0.99, { duration: motion.press, easing: easing.out });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: motion.press, easing: easing.out });
        }}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: value || placeholder }}
        style={[
          styles.field,
          {
            backgroundColor: colors.backgroundPrimary,
            borderColor: colors.borderPrimary,
          },
          aStyle,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            textStyles.bodyBaseHeavy,
            styles.value,
            { color: showPlaceholder ? colors.contentSecondary : colors.contentPrimary },
          ]}
        >
          {value || placeholder}
        </Text>
        <View style={styles.chevronSlot}>
          <Animated.View style={chevronStyle}>
            <Icon name="arrowDown" size={24} color={colors.contentSecondary} />
          </Animated.View>
        </View>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  field: {
    height: 56,
    borderWidth: 1,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
  },
  value: {
    flex: 1,
  },
  chevronSlot: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
