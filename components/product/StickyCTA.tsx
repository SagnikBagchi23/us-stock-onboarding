import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@/constants/theme';

interface StickyCTAProps {
  children: React.ReactNode;
  floating?: boolean;
  atBottom?: boolean;
  noDivider?: boolean;
  style?: ViewStyle;
}

export function StickyCTA({ children, floating = false, atBottom = false, noDivider = false, style }: StickyCTAProps) {
  const { colors } = useTheme();

  const hasElevation = !atBottom;
  const bg = hasElevation ? colors.backgroundSurfaceZ1 : 'transparent';
  const showDivider = hasElevation && !noDivider;

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: bg },
        showDivider
          ? {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.borderPrimary,
            }
          : null,
        style ?? null,
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
    paddingBottom: 28,
  },
});
