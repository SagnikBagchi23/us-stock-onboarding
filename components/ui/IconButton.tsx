import React from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@/constants/theme';
import { radius } from '@/constants/tokens';
import { Icon, type IconName } from './Icon';

interface IconButtonProps {
  name: IconName;
  onPress?: () => void;
  ariaLabel?: string;
  size?: number;
  style?: ViewStyle;
}

// 40×40 round-tap-target icon button — matches .appbar__icon-btn (HTML:170-176).
export function IconButton({ name, onPress, ariaLabel, size = 24, style }: IconButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={ariaLabel}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        pressed && { backgroundColor: colors.backgroundTertiary },
        style,
      ]}
    >
      <Icon name={name} size={size} color={colors.contentPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
