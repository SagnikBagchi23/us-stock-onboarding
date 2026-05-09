import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import { textStyles, spacing, easing, motion } from '@/constants/tokens';
import { StatusBar } from '@/components/ui/StatusBar';
import { AppBar } from '@/components/ui/AppBar';
import { SelectField } from '@/components/ui/SelectField';
import { Button } from '@/components/ui/Button';
import { StickyCTA } from '@/components/product/StickyCTA';
import { SelectorSheet } from '@/components/product/SelectorSheet';
import {
  EMPLOYMENT_STATUS,
  ANNUAL_INCOME,
  TOTAL_NET_WORTH,
  LIQUID_NET_WORTH,
  SOURCE_OF_FUNDS,
  PERSONAL_DETAILS_DEFAULTS as DEFAULTS,
} from '@/data/personalDetails';

const COLLAPSE_THRESHOLD = 40;

type SheetKey =
  | 'employment'
  | 'annualIncome'
  | 'totalNetWorth'
  | 'liquidNetWorth'
  | 'sourceOfFunds'
  | null;

export default function ActivateScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [employment, setEmployment] = useState<string>(DEFAULTS.employment);
  const [annualIncome, setAnnualIncome] = useState<string>(DEFAULTS.annualIncome);
  const [totalNetWorth, setTotalNetWorth] = useState<string>(DEFAULTS.totalNetWorth);
  const [liquidNetWorth, setLiquidNetWorth] = useState<string>(DEFAULTS.liquidNetWorth);
  const [sourceOfFunds, setSourceOfFunds] = useState<string>(DEFAULTS.sourceOfFunds);

  const [sheet, setSheet] = useState<SheetKey>(null);
  const closeSheet = () => setSheet(null);

  const scrollY = useSharedValue(0);
  const scrolled = useDerivedValue<number>(() => {
    const target = scrollY.value > COLLAPSE_THRESHOLD ? 1 : 0;
    return withTiming(target, { duration: motion.appbarFade, easing: easing.out });
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar scrolled={scrolled} />
      <AppBar onBack={() => router.back()} scrolled={scrolled} />

      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.titleBlock}>
          <Text style={[textStyles.headingLarge, { color: colors.contentPrimary }]}>Personal details</Text>
          <Text style={[textStyles.bodyBase, { color: colors.contentSecondary, marginTop: 2 }]}>
            Ensure your details are up to date
          </Text>
        </View>

        <SelectField
          label="Employment status"
          value={employment}
          onPress={() => setSheet('employment')}
          isOpen={sheet === 'employment'}
        />
        <SelectField
          label="Annual income"
          value={annualIncome}
          onPress={() => setSheet('annualIncome')}
          isOpen={sheet === 'annualIncome'}
        />
        <SelectField
          label="Total net worth"
          value={totalNetWorth}
          onPress={() => setSheet('totalNetWorth')}
          isOpen={sheet === 'totalNetWorth'}
        />
        <SelectField
          label="Liquid net worth"
          value={liquidNetWorth}
          onPress={() => setSheet('liquidNetWorth')}
          isOpen={sheet === 'liquidNetWorth'}
        />
        <SelectField
          label="Primary source of funds"
          value={sourceOfFunds}
          onPress={() => setSheet('sourceOfFunds')}
          isOpen={sheet === 'sourceOfFunds'}
        />
      </Animated.ScrollView>

      <StickyCTA floating>
        <Button onPress={() => router.push('/affiliation')}>Continue</Button>
      </StickyCTA>

      <SelectorSheet
        visible={sheet === 'employment'}
        onClose={closeSheet}
        title="Employment status"
        options={EMPLOYMENT_STATUS}
        selected={employment}
        onSelect={setEmployment}
      />
      <SelectorSheet
        visible={sheet === 'annualIncome'}
        onClose={closeSheet}
        title="Annual income"
        options={ANNUAL_INCOME}
        selected={annualIncome}
        onSelect={setAnnualIncome}
      />
      <SelectorSheet
        visible={sheet === 'totalNetWorth'}
        onClose={closeSheet}
        title="Total net worth"
        options={TOTAL_NET_WORTH}
        selected={totalNetWorth}
        onSelect={setTotalNetWorth}
      />
      <SelectorSheet
        visible={sheet === 'liquidNetWorth'}
        onClose={closeSheet}
        title="Liquid net worth"
        options={LIQUID_NET_WORTH}
        selected={liquidNetWorth}
        onSelect={setLiquidNetWorth}
      />
      <SelectorSheet
        visible={sheet === 'sourceOfFunds'}
        onClose={closeSheet}
        title="Primary source of funds"
        options={SOURCE_OF_FUNDS}
        selected={sourceOfFunds}
        onSelect={setSourceOfFunds}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.xl,
  },
  titleBlock: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
