import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';
import { textStyles } from '@/constants/tokens';
import { IconButton } from './IconButton';

interface AppBarProps {
  title: string;
  onBack?: () => void;
}

// Plain (non-collapsing) app bar — placeholder screen.
// Mirrors .appbar in reference/index.html:163-178.
export function AppBar({ title, onBack }: AppBarProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.bar, { backgroundColor: colors.backgroundPrimary }]}>
      <IconButton name="arrowLeft" onPress={onBack} ariaLabel="Back" />
      <Text style={[textStyles.headingBase, styles.title, { color: colors.contentPrimary }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  title: {
    flex: 1,
    paddingHorizontal: 8,
  },
});
