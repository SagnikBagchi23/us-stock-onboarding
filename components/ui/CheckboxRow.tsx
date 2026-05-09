import React, { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing, easing } from '@/constants/tokens';
import { Icon } from './Icon';

interface CheckboxRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function CheckboxRow({ label, checked, onToggle }: CheckboxRowProps) {
  const { colors } = useTheme();
  const checkScale = useSharedValue(checked ? 1 : 0);
  const checkOpacity = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    if (checked) {
      checkScale.value = withTiming(1, { duration: 150, easing: easing.out });
      checkOpacity.value = withTiming(1, { duration: 120, easing: easing.out });
    } else {
      checkScale.value = withTiming(0, { duration: 100, easing: easing.out });
      checkOpacity.value = withTiming(0, { duration: 80, easing: easing.out });
    }
  }, [checked]);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  return (
    <Pressable
      onPress={onToggle}
      style={styles.row}
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
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
