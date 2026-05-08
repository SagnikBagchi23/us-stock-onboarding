import React from 'react';
import { Pressable, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { Icon } from './Icon';

interface OptionListProps {
  options: readonly string[];
  selected: string;
  onSelect: (option: string) => void;
}

// List of selectable rows; tap commits + caller closes the sheet.
// Selected row gets backgroundAccentSubtle + tick icon; others are flat.
export function OptionList({ options, selected, onSelect }: OptionListProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{ maxHeight: 320 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {options.map((option, idx) => {
        const isSelected = option === selected;
        const isLast = idx === options.length - 1;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: isSelected
                  ? colors.backgroundAccentSubtle
                  : pressed
                    ? colors.backgroundSurfaceZ2
                    : 'transparent',
                borderBottomColor: colors.borderPrimary,
                borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
              },
            ]}
          >
            <Text
              style={[
                isSelected ? textStyles.bodyBaseHeavy : textStyles.bodyBase,
                styles.label,
                { color: colors.contentPrimary },
              ]}
            >
              {option}
            </Text>
            {isSelected && <Icon name="tick" size={20} color={colors.contentAccent} />}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  label: {
    flex: 1,
  },
});
