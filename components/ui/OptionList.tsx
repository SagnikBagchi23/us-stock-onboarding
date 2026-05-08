import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { Radio } from './Radio';

interface OptionListProps {
  options: readonly string[];
  selected: string;
  onSelect: (option: string) => void;
}

// MDS icon-list-item — leading 24px radio + label.
// 56h rows; hairline divider between rows, inset 52px (16 padding + 24 radio + 12 gap).
// Radio is the only selection indicator; label weight does not change.
export function OptionList({ options, selected, onSelect }: OptionListProps) {
  const { colors } = useTheme();

  return (
    <View>
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
              { backgroundColor: pressed ? colors.backgroundSurfaceZ2 : 'transparent' },
            ]}
          >
            <Radio selected={isSelected} />
            <View style={styles.labelWrap}>
              <Text style={[textStyles.bodyBaseHeavy, { color: colors.contentPrimary }]} numberOfLines={1}>
                {option}
              </Text>
              {!isLast && (
                <View
                  style={[
                    styles.divider,
                    { borderBottomColor: colors.borderPrimary },
                  ]}
                />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    gap: spacing.md,
  },
  labelWrap: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    paddingRight: spacing.lg,
  },
  divider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
