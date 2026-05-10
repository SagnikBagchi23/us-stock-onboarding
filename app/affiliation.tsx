import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { StatusBar } from '@/components/ui/StatusBar';
import { IconButton } from '@/components/ui/IconButton';
import { CheckboxRow } from '@/components/ui/CheckboxRow';
import { Button } from '@/components/ui/Button';
import { StickyCTA } from '@/components/product/StickyCTA';
import { AFFILIATION_OPTIONS } from '@/data/personalDetails';

export default function AffiliationScreen() {
  const { colors } = useTheme();
  const { back, push } = useRouter();
  const insets = useSafeAreaInsets();

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [hasOverflow, setHasOverflow] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const scrollViewHeight = useRef(0);
  const scrollContentHeight = useRef(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    setAtBottom(contentOffset.y + layoutMeasurement.height >= contentSize.height - 20);
  };

  const NONE_INDEX = AFFILIATION_OPTIONS.length - 1;

  function toggleOption(index: number) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else if (index === NONE_INDEX) {
        return new Set([NONE_INDEX]);
      } else {
        next.delete(NONE_INDEX);
        next.add(index);
      }
      return next;
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar />

      <View style={styles.appbar}>
        <IconButton name="arrowLeft" onPress={back} ariaLabel="Back" />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: spacing.xl }]}
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
          <Text style={[textStyles.headingLarge, { color: colors.contentPrimary }]}>
            Do any of these scenarios apply to you?
          </Text>
        </View>

        <View style={styles.optionsList}>
          {AFFILIATION_OPTIONS.map((option, i) => (
            <CheckboxRow
              key={option}
              label={option}
              checked={selected.has(i)}
              onToggle={() => toggleOption(i)}
              labelOffset={i === AFFILIATION_OPTIONS.length - 1 ? 2 : undefined}
            />
          ))}
        </View>
      </ScrollView>

      <StickyCTA atBottom={!hasOverflow || atBottom}>
        <Button disabled={selected.size === 0} onPress={() => push('/w8ben')}>
          Continue
        </Button>
      </StickyCTA>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  scrollContent: {
    paddingTop: spacing.xs,
  },
  titleBlock: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  optionsList: {
    gap: spacing.xxl,
    paddingTop: spacing.sm,
  },
});
