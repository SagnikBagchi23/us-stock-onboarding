import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { OptionList } from '@/components/ui/OptionList';
import { Button } from '@/components/ui/Button';

interface SelectorSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: readonly string[];
  selected: string;
  onSelect: (option: string) => void;
}

// Bottom-sheet selector matching Figma 2590:180947 et al.
// Header: title only (headingBase, 16/8/16 padding).
// Body: radio rows. Tapping a row stages the selection but doesn't close.
// Footer: floating "Done" button commits + closes.
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

  // Local staging so a user can change their mind before tapping Done.
  const [pending, setPending] = useState(selected);

  // Reset staging whenever the sheet (re)opens.
  useEffect(() => {
    if (visible) setPending(selected);
  }, [visible, selected]);

  const handleDone = () => {
    if (pending !== selected) onSelect(pending);
    onClose();
  };

  // Header (~52) + rows × 56 (capped via OptionList scroll at 360) +
  // CTA region (16 + 48 + 12 + safe-area + ~20 home indicator slot).
  const rowsHeight = Math.min(options.length, 7) * 56;
  const sheetHeight = 52 + rowsHeight + 16 + 48 + 12 + insets.bottom + 20;

  return (
    <BottomSheet visible={visible} onClose={onClose} sheetHeight={sheetHeight}>
      <View style={styles.header}>
        <Text style={[textStyles.headingBase, { color: colors.contentPrimary }]}>{title}</Text>
      </View>

      <OptionList
        options={options}
        selected={pending}
        onSelect={setPending}
      />

      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
        <Button onPress={handleDone}>Done</Button>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
