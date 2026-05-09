import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
import { easing, motion } from '@/constants/tokens';
import { GOOG } from '@/data/goog';
import { fmtUsd, fmtChange } from '@/utils/format';
import { generateSeries, hashTf, type Timeframe } from '@/utils/chart';

import { StatusBar } from '@/components/ui/StatusBar';
import { ProductAppBar } from '@/components/ui/ProductAppBar';
import { Button } from '@/components/ui/Button';
import { StockHeader } from '@/components/product/StockHeader';
import { StockChart } from '@/components/product/Chart';
import { TimeframePills } from '@/components/product/TimeframePills';
import { HoldingsCard } from '@/components/product/HoldingsCard';
import { PerformanceSection } from '@/components/product/PerformanceSection';
import { AboutSection } from '@/components/product/AboutSection';
import { StickyCTA } from '@/components/product/StickyCTA';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ActivateSheetContent, ACTIVATE_SHEET_HEIGHT } from '@/components/product/ActivateSheetContent';

const COLLAPSE_THRESHOLD = 80;

export default function ProductScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTf, setActiveTf] = useState<Timeframe>('1D');
  const [sheetOpen, setSheetOpen] = useState(false);

  const [hasOverflow, setHasOverflow] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const scrollViewHeight = useRef(0);

  // Series state lifted here so header + holdings card stay in sync with the chart.
  const [series, setSeries] = useState<number[]>(() =>
    generateSeries('1D', GOOG.initialPrice, hashTf('1D')),
  );

  const handleSeriesChange = useCallback((s: number[], _tf: Timeframe) => {
    setSeries(s);
  }, []);

  const start = series[0];
  const end = series[series.length - 1];
  const diff = end - start;
  const pct = (diff / start) * 100;
  const positive = diff >= 0;
  const priceStr = fmtUsd(end);
  const changeStr = fmtChange(diff, pct);

  // Holdings — gain vs avg buy, valued at live price
  const holdValue = end * GOOG.sharesHeld;
  const holdDiff = (end - GOOG.avgBuy) * GOOG.sharesHeld;
  const holdPct = ((end - GOOG.avgBuy) / GOOG.avgBuy) * 100;

  // Scroll → collapsing app bar
  const scrollY = useSharedValue(0);
  const scrolled = useDerivedValue<number>(() => {
    const target = scrollY.value > COLLAPSE_THRESHOLD ? 1 : 0;
    return withTiming(target, { duration: motion.appbarFade, easing: easing.out });
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
      runOnJS(checkBottom)(e.contentOffset.y, e.layoutMeasurement.height, e.contentSize.height);
    },
  });

  const checkBottom = useCallback((offset: number, viewport: number, content: number) => {
    setAtBottom(offset + viewport >= content - 20);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar scrolled={scrolled} />

      <ProductAppBar
        scrolled={scrolled}
        name={GOOG.name}
        price={priceStr}
        change={changeStr}
        changePositive={positive}
        onLeadingPress={() => router.back()}
      />

      <Animated.ScrollView
        style={{ flex: 1 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onLayout={({ nativeEvent: { layout } }) => {
          scrollViewHeight.current = layout.height;
        }}
        onContentSizeChange={(_w, contentHeight) => {
          setHasOverflow(contentHeight > scrollViewHeight.current + 1);
        }}
      >
        <StockHeader
          ticker={GOOG.ticker}
          name={GOOG.name}
          price={priceStr}
          change={changeStr}
          changePositive={positive}
          period={activeTf}
        />

        <StockChart
          initialPrice={GOOG.initialPrice}
          activeTf={activeTf}
          onSeriesChange={handleSeriesChange}
        />

        <TimeframePills active={activeTf} onChange={setActiveTf} />

        <HoldingsCard
          shares={GOOG.sharesHeld}
          limitPrice={fmtUsd(GOOG.limitPrice)}
          value={fmtUsd(holdValue)}
          change={fmtChange(holdDiff, holdPct)}
          changePositive={holdDiff >= 0}
        />

        <PerformanceSection
          todayLow={GOOG.performance.todayLow}
          todayHigh={GOOG.performance.todayHigh}
          todayMarkerPct={GOOG.performance.todayLowPct}
          week52Low={GOOG.performance.week52Low}
          week52High={GOOG.performance.week52High}
          week52MarkerPct={GOOG.performance.week52Pct}
          openPrice={GOOG.performance.openPrice}
          previousClose={GOOG.performance.previousClose}
          todayVolume={GOOG.performance.todayVolume}
        />

        <AboutSection rows={GOOG.about.rows} description={GOOG.about.description} />

        <View style={{ height: 8 }} />
      </Animated.ScrollView>

      <StickyCTA atBottom={!hasOverflow || atBottom}>
        <Button onPress={() => setSheetOpen(true)}>Activate US Stocks</Button>
      </StickyCTA>

      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        sheetHeight={ACTIVATE_SHEET_HEIGHT}
      >
        <ActivateSheetContent
          onStart={() => {
            setSheetOpen(false);
            router.push('/activate');
          }}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
