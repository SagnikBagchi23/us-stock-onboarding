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

  // When content sits underneath the docked CTA (floating, or scrolled with overflow),
  // surface it on backgroundSurfaceZ1 with a borderPrimary divider so the button is
  // visually separated from the content. atBottom = page fully visible, no content
  // underneath, so use the page background with no divider.
  const bg = atBottom ? colors.backgroundPrimary : colors.backgroundSurfaceZ1;
  const showDivider = !atBottom && !noDivider;

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
