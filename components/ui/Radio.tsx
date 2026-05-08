import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';

interface RadioProps {
  selected: boolean;
  size?: number;
}

// 24px (default) MDS radio button — outer ring, inner dot when selected.
export function Radio({ selected, size = 24 }: RadioProps) {
  const { colors } = useTheme();
  const inner = size * 0.5;
  return (
    <View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: selected ? colors.contentAccent : colors.contentTertiary,
          borderWidth: 2,
        },
      ]}
    >
      {selected && (
        <View
          style={{
            width: inner,
            height: inner,
            borderRadius: inner / 2,
            backgroundColor: colors.contentAccent,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
