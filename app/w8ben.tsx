import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import { textStyles, spacing, easing, motion } from '@/constants/tokens';
import { StatusBar } from '@/components/ui/StatusBar';
import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { StickyCTA } from '@/components/product/StickyCTA';

const COLLAPSE_THRESHOLD = 40;

const BULLET_ITEMS = [
  'I am the individual that is the beneficial owner (or am authorized to sign for the individual that is the beneficial owner) of all the income to which this form relates or am using this form to document myself as an individual that is an owner or account holder of a foreign financial institution.',
  'The person named on line 1 of this form is not a U.S. person.',
  'The income to which this form relates is not effectively connected with the conduct of a trade or business in the United States or is effectively connected but is not subject to tax under an applicable income tax treaty.',
  'The person named on line 1 of this form is a resident of the treaty country listed on line 9 of the form (if any) within the meaning of the income tax treaty between the United States and that country.',
  'For broker transactions or barter exchanges, the beneficial owner is an exempt foreign person as defined in the instructions.',
];

export default function W8BENScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [hasOverflow, setHasOverflow] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const scrollViewHeight = useRef(0);

  const scrollY = useSharedValue(0);
  const scrolled = useDerivedValue<number>(() => {
    const target = scrollY.value > COLLAPSE_THRESHOLD ? 1 : 0;
    return withTiming(target, { duration: motion.appbarFade, easing: easing.out });
  });

  const checkBottom = useCallback((offset: number, viewport: number, content: number) => {
    setAtBottom(offset + viewport >= content - 20);
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
      runOnJS(checkBottom)(e.contentOffset.y, e.layoutMeasurement.height, e.contentSize.height);
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar scrolled={scrolled} />
      <AppBar onBack={() => router.back()} scrolled={scrolled} title="W-8BEN Certification" />

      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onLayout={({ nativeEvent: { layout } }) => {
          scrollViewHeight.current = layout.height;
        }}
        onContentSizeChange={(_w, contentHeight) => {
          setHasOverflow(contentHeight > scrollViewHeight.current + 1);
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.titleBlock}>
          <Text style={[textStyles.headingLarge, { color: colors.contentPrimary }]}>W-8BEN Certification</Text>
          <Text style={[textStyles.bodyBase, { color: colors.contentSecondary, marginTop: 2 }]}>
            This ensures you get the benefits of the India-US tax treaty
          </Text>
        </View>

        <Text style={[textStyles.bodyBase, { color: colors.contentPrimary }]}>
          Under penalties of perjury, I declare that I have examined the information on this form and to the best of my knowledge and belief it is true, correct, and complete. I further certify under penalties of perjury that:
        </Text>

        <View style={styles.bulletList}>
          {BULLET_ITEMS.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={[styles.bullet, { color: colors.contentPrimary }]}>{'•'}</Text>
              <Text style={[textStyles.bodyBase, styles.bulletText, { color: colors.contentPrimary }]}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={[textStyles.bodyBase, { color: colors.contentPrimary }]}>
          Furthermore, I authorize this form to be provided to any withholding agent that has control, receipt, or custody of the income of which I am the beneficial owner or any withholding agent that can disburse or make payments of the income of which I am the beneficial owner. I agree that I will submit a new form within 30 days if any certification made on this form becomes incorrect.
        </Text>
      </Animated.ScrollView>

      <StickyCTA atBottom={!hasOverflow || atBottom}>
        <Button onPress={() => router.push('/agreements')}>Agree and continue</Button>
      </StickyCTA>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleBlock: {
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  bulletList: {
    gap: spacing.md,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  bullet: {
    ...textStyles.bodyBase,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
  },
});
