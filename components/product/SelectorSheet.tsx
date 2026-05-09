import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

  // Header (~56) + rows × 56 + CTA region (16 top + 48 button + 28 bottom + ~20 home indicator slot).
  const rowsHeight = options.length * 56;
  const sheetHeight = 56 + rowsHeight + 16 + 48 + 28 + 20;

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

      <View style={styles.footer}>
        <Button onPress={handleDone}>Done</Button>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 28,
  },
});
