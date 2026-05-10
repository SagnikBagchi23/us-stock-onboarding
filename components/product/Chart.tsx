import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, type LayoutChangeEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
  runOnUI,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';

import { useTheme } from '@/constants/theme';
import { textStyles, motion, easing, radius } from '@/constants/tokens';
import {
  CHART_VIEWBOX_W,
  CHART_VIEWBOX_H,
  CHART_PAD_X,
  CHART_PAD_TOP,
  CHART_H,
  CHART_W,
  MORPH_N,
  TIMEFRAMES,
  generateSeries,
  hashTf,
  projectSeries,
  type ChartPoint,
  type Timeframe,
} from '@/utils/chart';
import { fmtUsd, scrubTooltip } from '@/utils/format';
import { IconButton } from '@/components/ui/IconButton';
import SvgCanvas from './SvgCanvas';

const CHART_HEIGHT = 340;

interface ChartProps {
  initialPrice: number;
  activeTf: Timeframe;
  positive: boolean;
  // Called whenever the live tick produces a new price (and after timeframe changes).
  onSeriesChange: (series: number[], tf: Timeframe) => void;
}

export function StockChart({ initialPrice, activeTf, positive, onSeriesChange }: ChartProps) {
  const { colors } = useTheme();

  // ── JS-side state: the source-of-truth series for the active timeframe.
  const seriesRef = useRef<number[]>(generateSeries(activeTf, initialPrice, hashTf(activeTf)));
  const currentPriceRef = useRef(initialPrice);

  // ── Layout (chart's actual rendered size in px)
  const [size, setSize] = useState({ w: 0, h: CHART_HEIGHT });
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  }, []);

  // ── Shared values driving the morph
  const initialPoints = useMemo(
    () => projectSeries(seriesRef.current, TIMEFRAMES[activeTf].widthFrac),
    // initial only — subsequent updates go through morphTo
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const fromPoints = useSharedValue<ChartPoint[]>(initialPoints);
  const toPoints = useSharedValue<ChartPoint[]>(initialPoints);
  const progress = useSharedValue(1);

  // ── Scrub
  const scrubActive = useSharedValue(0);   // 0 or 1
  const scrubIdx = useSharedValue(MORPH_N - 1);
  const [tooltipText, setTooltipText] = useState({ price: fmtUsd(initialPrice), time: '' });
  // Measured tooltip width drives clamping so the box always hugs its content.
  const tooltipW = useSharedValue(0);

  // ── Derived: interpolated points (UI thread)
  const currentPoints = useDerivedValue<ChartPoint[]>(() => {
    const f = fromPoints.value;
    const t = toPoints.value;
    const e = progress.value;
    const out = new Array<ChartPoint>(MORPH_N);
    for (let i = 0; i < MORPH_N; i++) {
      out[i] = {
        x: f[i].x + (t[i].x - f[i].x) * e,
        y: f[i].y + (t[i].y - f[i].y) * e,
      };
    }
    return out;
  });

  // Scale factor from viewBox coords → screen px
  const scale = size.w > 0 ? size.w / CHART_VIEWBOX_W : 1;
  const scaledHeight = CHART_VIEWBOX_H * scale;

  const horizontalLineStyle = useAnimatedStyle(() => {
    const last = currentPoints.value[MORPH_N - 1];
    return { transform: [{ translateY: last.y * scale }] };
  });

  const verticalLineStyle = useAnimatedStyle(() => {
    const pt = currentPoints.value[scrubIdx.value];
    return {
      transform: [{ translateX: pt.x * scale }],
      opacity: scrubActive.value,
    };
  });

  const tooltipStyle = useAnimatedStyle(() => {
    const w = tooltipW.value || 0;
    const pt = currentPoints.value[scrubIdx.value];
    let left = pt.x * scale - w / 2;
    if (left < 4) left = 4;
    if (w > 0 && left + w > size.w - 4) left = size.w - w - 4;
    return {
      transform: [{ translateX: left }],
      opacity: scrubActive.value,
    };
  });

  // ── morphTo: set a new target and animate from the current interpolated state
  const morphTo = useCallback((nextSeries: number[], nextTf: Timeframe) => {
    const target = projectSeries(nextSeries, TIMEFRAMES[nextTf].widthFrac);
    runOnUI((targetPts: ChartPoint[]) => {
      'worklet';
      // Snapshot current interpolated state into `from`, so we never visually jump.
      const e = progress.value;
      const f = fromPoints.value;
      const t = toPoints.value;
      const snap: ChartPoint[] = new Array(MORPH_N);
      for (let i = 0; i < MORPH_N; i++) {
        snap[i] = {
          x: f[i].x + (t[i].x - f[i].x) * e,
          y: f[i].y + (t[i].y - f[i].y) * e,
        };
      }
      cancelAnimation(progress);
      fromPoints.value = snap;
      toPoints.value = targetPts;
      progress.value = 0;
      progress.value = withTiming(1, { duration: motion.morph, easing: easing.out });
    })(target);
  }, [progress, fromPoints, toPoints]);

  // ── React to timeframe changes from parent
  useEffect(() => {
    const next = generateSeries(activeTf, currentPriceRef.current, hashTf(activeTf));
    seriesRef.current = next;
    morphTo(next, activeTf);
    onSeriesChange(next, activeTf);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTf]);

  // ── Live ticking (skipped while a morph is in flight, mirroring HTML:982-994)
  useEffect(() => {
    const id = setInterval(() => {
      // Skip if a morph is animating
      // (we read progress.value off a worklet via direct access — Reanimated allows JS reads)
      if (progress.value < 1) return;
      const cur = currentPriceRef.current;
      const drift = (390.85 - cur) * 0.02;
      const shock = (Math.random() - 0.5) * cur * 0.0015;
      const next = Math.max(1, cur + drift + shock);
      currentPriceRef.current = next;
      const s = seriesRef.current.slice();
      s[s.length - 1] = next;
      seriesRef.current = s;
      morphTo(s, activeTf);
      onSeriesChange(s, activeTf);
    }, motion.liveTick);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTf]);

  // ── Scrub gesture
  const updateScrubLabel = useCallback((idx: number) => {
    const s = seriesRef.current;
    const seriesIdx = Math.round((idx / (MORPH_N - 1)) * (s.length - 1));
    setTooltipText(scrubTooltip(activeTf, s, seriesIdx));
    Haptics.selectionAsync();
  }, [activeTf]);

  const computeIdx = useCallback((locationX: number) => {
    const widthFrac = TIMEFRAMES[activeTf].widthFrac;
    const scaleW = size.w / CHART_VIEWBOX_W;
    const usableW = CHART_W * widthFrac * scaleW;
    const x = Math.max(0, Math.min(usableW, locationX - CHART_PAD_X * scaleW));
    return Math.round((usableW > 0 ? x / usableW : 0) * (MORPH_N - 1));
  }, [activeTf, size.w]);

  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const idx = computeIdx(e.nativeEvent.locationX);
      scrubActive.value = 1;
      scrubIdx.value = idx;
      updateScrubLabel(idx);
    },
    onPanResponderMove: (e) => {
      const idx = computeIdx(e.nativeEvent.locationX);
      if (idx !== scrubIdx.value) {
        scrubIdx.value = idx;
        updateScrubLabel(idx);
      }
    },
    onPanResponderRelease: () => {
      scrubActive.value = 0;
      scrubIdx.value = MORPH_N - 1;
    },
    onPanResponderTerminate: () => {
      scrubActive.value = 0;
      scrubIdx.value = MORPH_N - 1;
    },
  }), [computeIdx, updateScrubLabel, scrubActive, scrubIdx]);

  return (
    <View style={[styles.chart, { height: CHART_HEIGHT }]} onLayout={onLayout}>
      <View style={StyleSheet.absoluteFill} {...pan.panHandlers}>
          {size.w > 0 && (
            <SvgCanvas
              currentPoints={currentPoints}
              scale={scale}
              scaledHeight={scaledHeight}
              positive={positive}
              colors={colors}
            />
          )}

          {/* Horizontal LTP line — 1D only */}
          {activeTf === '1D' && (
          <Animated.View
            pointerEvents="none"
            style={[styles.hline, { borderTopColor: colors.chartGrid }, horizontalLineStyle]}
          />
          )}

          {/* Vertical scrub line */}
          <Animated.View
            pointerEvents="none"
            style={[styles.vline, verticalLineStyle]}
          >
            <Svg width={1} height={CHART_HEIGHT}>
              <Line
                x1={0.5}
                y1={0}
                x2={0.5}
                y2={CHART_HEIGHT}
                stroke={colors.borderPrimary}
                strokeWidth={1}
                strokeDasharray="3,3"
              />
            </Svg>
          </Animated.View>

          {/* Tooltip — width hugs content, measured via onLayout */}
          <Animated.View
            pointerEvents="none"
            onLayout={(e) => {
              tooltipW.value = e.nativeEvent.layout.width;
            }}
            style={[
              styles.tooltip,
              {
                backgroundColor: colors.backgroundSurfaceZ1,
                borderColor: colors.borderPrimary,
              },
              tooltipStyle,
            ]}
          >
            <Text style={[textStyles.bodySmall, { color: colors.contentPrimary }]}>{tooltipText.price}</Text>
            <Text style={[textStyles.bodyXSmallHeavy, { color: colors.contentTertiary }]}>{tooltipText.time}</Text>
          </Animated.View>

      </View>

      {/* Expand button (decorative — no-op in HTML reference) */}
      <View style={styles.expand}>
        <IconButton
          name="arrowExpand"
          size={20}
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: colors.borderPrimary,
            backgroundColor: colors.backgroundPrimary,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    position: 'relative',
    overflow: 'hidden',
  },
  hline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  vline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 1,
  },
  tooltip: {
    position: 'absolute',
    top: 8,
    left: 0,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  expand: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
