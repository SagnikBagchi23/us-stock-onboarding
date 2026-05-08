import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, interpolateColor, type SharedValue, type DerivedValue } from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { textStyles } from '@/constants/tokens';
import { IconButton } from './IconButton';
import type { IconName } from './Icon';

interface ProductAppBarProps {
  // 0 = expanded (transparent), 1 = collapsed (filled w/ subtitle visible)
  scrolled: SharedValue<number> | DerivedValue<number>;
  name: string;
  price: string;          // formatted, e.g. "$390.85"
  change: string;         // formatted, e.g. "+22.96 (10.16%)"
  changePositive: boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  onLeadingPress?: () => void;
  onTrailingPress?: () => void;
}

// Collapsing app bar — driven by a parent ScrollView's scrollY shared value.
// Mirrors .product__appbar + .appbar-title-stack from reference/index.html:233-272.
export function ProductAppBar({
  scrolled,
  name,
  price,
  change,
  changePositive,
  leadingIcon = 'arrowLeft',
  trailingIcon = 'search',
  onLeadingPress,
  onTrailingPress,
}: ProductAppBarProps) {
  const { colors } = useTheme();

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrolled.value,
      [0, 1],
      [colors.backgroundPrimary, colors.backgroundSurfaceZ1],
    ),
    borderBottomColor: interpolateColor(
      scrolled.value,
      [0, 1],
      ['transparent', colors.borderPrimary],
    ),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrolled.value, [0, 1], [16, 0]) }],
    opacity: interpolate(scrolled.value, [0, 1], [0, 1]),
  }));

  return (
    <Animated.View style={[styles.bar, containerStyle]}>
      <IconButton name={leadingIcon} onPress={onLeadingPress} ariaLabel="Back" />

      <View style={styles.titleStack}>
        <Animated.View style={titleStyle}>
          <Text
            style={[textStyles.headingXSmall, { color: colors.contentPrimary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          <View style={styles.subRow}>
            <Text style={[textStyles.bodySmallHeavy, { color: colors.contentPrimary }]}>{price} </Text>
            <Text
              style={[
                textStyles.bodySmallHeavy,
                { color: changePositive ? colors.contentPositive : colors.contentNegative },
              ]}
            >
              {change}
            </Text>
          </View>
        </Animated.View>
      </View>

      <IconButton name={trailingIcon} onPress={onTrailingPress} ariaLabel="Search" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titleStack: {
    flex: 1,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
