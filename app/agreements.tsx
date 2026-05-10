import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
import { Icon } from '@/components/ui/Icon';
import { CheckboxRow } from '@/components/ui/CheckboxRow';
import { Button } from '@/components/ui/Button';
import { StickyCTA } from '@/components/product/StickyCTA';

const COLLAPSE_THRESHOLD = 40;

const DOCUMENTS = [
  { label: 'Groww Agreement' },
  { label: 'Alpaca Customer Agreement' },
];

const AGREEMENTS = [
  'I have read, understood, and agree to be bound by Alpaca Securities LLC and Groww LLC account terms, and all other terms, disclosures and disclaimers applicable to me, as referenced in the Alpaca Customer Agreement.',
  'I also acknowledge that the Alpaca Customer Agreement contains a pre-dispute arbitration clause in Section 44.',
  'I understand I am signing this agreement electronically, and that my electronic signature will have the same effect as physically signing and returning the Application Agreement.',
];

export default function AgreementsScreen() {
  const { colors } = useTheme();
  const { back, push } = useRouter();
  const insets = useSafeAreaInsets();

  const [checked, setChecked] = useState<boolean[]>(() => AGREEMENTS.map(() => true));

  const [hasOverflow, setHasOverflow] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const scrollViewHeight = useRef(0);
  const scrollContentHeight = useRef(0);

  const scrollY = useSharedValue(0);
  const scrolled = useDerivedValue<number>(() => {
    const target = scrollY.value > COLLAPSE_THRESHOLD ? 1 : 0;
    return withTiming(target, { duration: motion.appbarFade, easing: easing.out });
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
      runOnJS(setAtBottom)(e.contentOffset.y + e.layoutMeasurement.height >= e.contentSize.height - 20);
    },
  });

  function toggle(i: number) {
    setChecked(prev => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar scrolled={scrolled} />
      <AppBar onBack={back} scrolled={scrolled} />

      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onLayout={({ nativeEvent: { layout } }) => {
          scrollViewHeight.current = layout.height;
          setHasOverflow(scrollContentHeight.current > layout.height + 1);
        }}
        onContentSizeChange={(_w, contentHeight) => {
          scrollContentHeight.current = contentHeight;
          if (scrollViewHeight.current > 0) {
            setHasOverflow(contentHeight > scrollViewHeight.current + 1);
          }
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.titleBlock}>
          <Text style={[textStyles.headingLarge, { color: colors.contentPrimary }]}>General agreements</Text>
          <Text style={[textStyles.bodyBase, { color: colors.contentSecondary, marginTop: 2 }]}>
            Ensures you get the benefits of the India-US tax treaty
          </Text>
        </View>

        {/* Document links */}
        <View style={[styles.docsCard, { borderColor: colors.borderPrimary }]}>
          {DOCUMENTS.map((doc, i) => (
            <View key={doc.label}>
              <Pressable style={styles.docRow}>
                <Icon name="file" size={20} color={colors.contentSecondary} />
                <Text style={[textStyles.bodyBaseHeavy, styles.docLabel, { color: colors.contentPrimary }]}>
                  {doc.label}
                </Text>
                <Icon name="squareArrowUpRight" size={20} color={colors.contentAccent} />
              </Pressable>
              {i < DOCUMENTS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.borderPrimary }]} />
              )}
            </View>
          ))}
        </View>

        {/* Agreement checkboxes */}
        <View style={styles.checkboxList}>
          {AGREEMENTS.map((text, i) => (
            <CheckboxRow key={text} label={text} checked={checked[i]} onToggle={() => toggle(i)} />
          ))}
        </View>
      </Animated.ScrollView>

      <StickyCTA atBottom={!hasOverflow || atBottom}>
        <Button onPress={() => push('/complete')} disabled={!checked.every(Boolean)}>Agree and continue</Button>
      </StickyCTA>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  titleBlock: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  docsCard: {
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.lg,
    minHeight: 56,
  },
  docLabel: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 52,
  },
  checkboxList: {
    gap: spacing.xxl,
    paddingTop: spacing.sm,
  },
});
