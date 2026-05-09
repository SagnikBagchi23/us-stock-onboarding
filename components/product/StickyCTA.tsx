import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';

interface StickyCTAProps {
  children: React.ReactNode;
  floating?: boolean;
  atBottom?: boolean;
}

export function StickyCTA({ children, floating = false, atBottom = false }: StickyCTAProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const bg = floating
    ? undefined
    : atBottom
      ? colors.backgroundPrimary
      : colors.backgroundSurfaceDocked;

  const showDivider = !floating && !atBottom;

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: 16 + 12 + insets.bottom,
        },
        bg ? { backgroundColor: bg } : null,
        showDivider
          ? {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.borderPrimary,
            }
          : null,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
