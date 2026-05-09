import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { GoogleLogo } from './GoogleLogo';

interface StockHeaderProps {
  ticker: string;
  name: string;
  price: string;
  change: string;
  changePositive: boolean;
  period: string; // "1D", "1W", etc.
}

export function StockHeader({ ticker, name, price, change, changePositive, period }: StockHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <GoogleLogo size={32} />
      </View>

      <View>
        <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>{ticker}</Text>
        <Text style={[textStyles.headingSmall, { color: colors.contentPrimary }]}>{name}</Text>
      </View>

      <View style={styles.priceRow}>
        <View>
          <Text style={[textStyles.displaySmall, { color: colors.contentPrimary }]}>{price}</Text>
          <View style={styles.changeRow}>
            <Text
              style={[
                textStyles.bodySmallHeavy,
                { color: changePositive ? colors.contentPositive : colors.contentNegative },
              ]}
            >
              {change}
            </Text>
            <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>{period}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  logo: {
    width: 32,
    height: 32,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
