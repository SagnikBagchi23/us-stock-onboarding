import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing, radius } from '@/constants/tokens';
import { Icon } from '@/components/ui/Icon';

interface HoldingsCardProps {
  shares: number;
  limitPrice: string;          // formatted
  value: string;               // formatted USD
  change: string;              // formatted change string
  changePositive: boolean;
}

export function HoldingsCard({ shares, limitPrice, value, change, changePositive }: HoldingsCardProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.backgroundSurfaceZ1, borderColor: colors.borderPrimary },
        ]}
      >
        <View style={styles.left}>
          <View style={styles.sharesRow}>
            <Text style={[textStyles.bodyBaseHeavy, { color: colors.contentPrimary }]}>
              {shares} shares
            </Text>
            <Icon name="arrowRight" size={16} color={colors.contentSecondary} />
          </View>
          <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>
            Limit at price {limitPrice}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={[textStyles.bodyBaseHeavy, { color: colors.contentPrimary }]}>{value}</Text>
          <Text
            style={[
              textStyles.bodySmallHeavy,
              { color: changePositive ? colors.contentPositive : colors.contentNegative },
            ]}
          >
            {change}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    gap: 2,
  },
  right: {
    gap: 2,
    alignItems: 'flex-end',
  },
  sharesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
