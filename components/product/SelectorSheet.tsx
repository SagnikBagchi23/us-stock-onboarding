import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { OptionList } from '@/components/ui/OptionList';

interface SelectorSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: readonly string[];
  selected: string;
  onSelect: (option: string) => void;
}

// Generic bottom-sheet selector: title header + radio-style option list.
// Sized to fit the longest list while still anchoring to the bottom.
export function SelectorSheet({
  visible,
  onClose,
  title,
  options,
  selected,
  onSelect,
}: SelectorSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Approximate sheet height: header (76) + (rows × 56, capped by OptionList scroll)
  // + safe-area bottom. Capped at ~480 so very long lists scroll inside the sheet.
  const rowsHeight = Math.min(options.length, 6) * 56;
  const sheetHeight = 76 + rowsHeight + 12 + insets.bottom;

  return (
    <BottomSheet visible={visible} onClose={onClose} sheetHeight={sheetHeight}>
      <View style={[styles.header]}>
        <Text style={[textStyles.headingLarge, { color: colors.contentPrimary }]}>{title}</Text>
      </View>
      <OptionList
        options={options}
        selected={selected}
        onSelect={(option) => {
          onSelect(option);
          onClose();
        }}
      />
      <View style={{ height: insets.bottom + spacing.md }} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
