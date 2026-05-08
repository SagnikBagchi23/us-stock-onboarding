import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';

interface StickyCTAProps {
  children: React.ReactNode;
  // When true, render with no background fill or top divider.
  // Use on screens where there isn't enough scroll content beneath the CTA
  // for the dock affordance to feel meaningful.
  floating?: boolean;
}

export function StickyCTA({ children, floating = false }: StickyCTAProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: 16 + 12 + insets.bottom,
        },
        floating
          ? null
          : {
              backgroundColor: colors.backgroundSurfaceDocked,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.borderPrimary,
            },
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
