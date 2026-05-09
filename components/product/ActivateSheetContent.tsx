import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { Button } from '@/components/ui/Button';

interface ActivateSheetContentProps {
  onStart: () => void;
}

// Inner content of the Activate US Stocks bottom sheet.
// Layout per Figma node 2588:152989: 24px top pad, illustration, title, body, primary CTA, home indicator slot.
export function ActivateSheetContent({ onStart }: ActivateSheetContentProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrap}>
      <Image
        source={require('../../assets/intro-illo.png')}
        style={styles.illo}
        resizeMode="contain"
      />

      <View style={styles.copy}>
        <Text style={[textStyles.headingLarge, styles.center, { color: colors.contentPrimary }]}>
          Activate US Stocks
        </Text>
        <Text style={[textStyles.bodyBase, styles.center, { color: colors.contentSecondary }]}>
          Start onboarding to buy your first US stock on Groww.
        </Text>
        <Text style={[textStyles.bodyBase, styles.center, { color: colors.contentSecondary }]} numberOfLines={1}>
          It&rsquo;ll just take a minute.
        </Text>
      </View>

      <View style={[styles.cta, { paddingBottom: 16 + 12 + insets.bottom }]}>
        <Button onPress={onStart}>Start now</Button>
      </View>
    </View>
  );
}

// Approximate height of the sheet — used by BottomSheet to compute slide distance.
// 24 (top) + 263 (illo) + 16 (gap) + ~64 (title+body) + 16+48+16+12 (CTA) + ~34 safe area ≈ 493
export const ACTIVATE_SHEET_HEIGHT = 526;

const styles = StyleSheet.create({
  wrap: {
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  illo: {
    width: 360,
    height: 263,
  },
  copy: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: 2,
    width: '100%',
  },
  center: {
    textAlign: 'center',
  },
  cta: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
});
