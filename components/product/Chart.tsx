import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, type LayoutChangeEvent } from 'react-native';
import { Canvas, Path, Group, Skia, type SkPath } from '@shopify/react-native-skia';
import { useSkiaReady } from '@/utils/skia';
import type { SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
  runOnUI,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

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

const CHART_HEIGHT = 340;

interface SkiaCanvasProps {
  currentPoints: SharedValue<ChartPoint[]>;
  scale: number;
  scaledHeight: number;
  positive: boolean;
  colors: { contentPositive: string; contentNegative: string };
}

// Isolated so Skia.Path.Make() worklet never runs before CanvasKit WASM is ready.
function SkiaCanvas({ currentPoints, scale, scaledHeight, positive, colors }: SkiaCanvasProps) {
  const skPath = useDerivedValue<SkPath>(() => {
    const pts = currentPoints.value;
    const p = Skia.Path.Make();
    p.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) p.lineTo(pts[i].x, pts[i].y);
    return p;
  });
  return (
    <Canvas style={{ width: scale * CHART_VIEWBOX_W, height: scaledHeight }}>
      <Group transform={[{ scale }]}>
        <Path
          path={skPath}
          style="stroke"
          strokeWidth={1.5}
          color={positive ? colors.contentPositive : colors.contentNegative}
          strokeJoin="round"
          strokeCap="round"
        />
      </Group>
    </Canvas>
  );
}

interface ChartProps {
  initialPrice: number;
  activeTf: Timeframe;
  positive: boolean;
  // Called whenever the live tick produces a new price (and after timeframe changes).
  onSeriesChange: (series: number[], tf: Timeframe) => void;
}

export function StockChart({ initialPrice, activeTf, positive, onSeriesChange }: ChartProps) {
  const { colors } = useTheme();

  const canvasReady = useSkiaReady();

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

  // ── Last-point indicator (dot + horizontal line) — driven by current geometry
  const lastPointStyle = useAnimatedStyle(() => {
    const idx = scrubActive.value === 1 ? scrubIdx.value : MORPH_N - 1;
    const pt = currentPoints.value[idx];
    return {
      left: pt.x * scale - 6,
      top: pt.y * scale - 6,
    };
  });

  const horizontalLineStyle = useAnimatedStyle(() => {
    const last = currentPoints.value[MORPH_N - 1];
    return { top: last.y * scale };
  });

  const verticalLineStyle = useAnimatedStyle(() => {
    const pt = currentPoints.value[scrubIdx.value];
    return {
      left: pt.x * scale,
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
      left,
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
  }, [activeTf]);

  const triggerHaptic = useCallback((kind: 'start' | 'tick') => {
    if (Platform.OS === 'web') return;
    if (kind === 'start') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else Haptics.selectionAsync();
  }, []);

  const pan = useMemo(() => Gesture.Pan()
    .activateAfterLongPress(0)
    .minDistance(0)
    .onBegin((e) => {
      'worklet';
      const widthFrac = TIMEFRAMES[activeTf].widthFrac;
      const scaleW = size.w / CHART_VIEWBOX_W;
      const usableW = CHART_W * widthFrac * scaleW;
      const x = Math.max(0, Math.min(usableW, e.x - CHART_PAD_X * scaleW));
      const idx = Math.round((usableW > 0 ? x / usableW : 0) * (MORPH_N - 1));
      scrubActive.value = 1;
      scrubIdx.value = idx;
      runOnJS(updateScrubLabel)(idx);
      runOnJS(triggerHaptic)('start');
    })
    .onUpdate((e) => {
      'worklet';
      const widthFrac = TIMEFRAMES[activeTf].widthFrac;
      const scaleW = size.w / CHART_VIEWBOX_W;
      const usableW = CHART_W * widthFrac * scaleW;
      const x = Math.max(0, Math.min(usableW, e.x - CHART_PAD_X * scaleW));
      const idx = Math.round((usableW > 0 ? x / usableW : 0) * (MORPH_N - 1));
      if (idx !== scrubIdx.value) {
        scrubIdx.value = idx;
        runOnJS(updateScrubLabel)(idx);
        runOnJS(triggerHaptic)('tick');
      }
    })
    .onFinalize(() => {
      'worklet';
      scrubActive.value = 0;
      scrubIdx.value = MORPH_N - 1;
    }),
  [activeTf, size.w, updateScrubLabel, triggerHaptic, scrubActive, scrubIdx]);

  return (
    <View style={[styles.chart, { height: CHART_HEIGHT }]} onLayout={onLayout}>
      <GestureDetector gesture={pan}>
        <View style={StyleSheet.absoluteFill}>
          {size.w > 0 && canvasReady && (
            <SkiaCanvas
              currentPoints={currentPoints}
              scale={scale}
              scaledHeight={scaledHeight}
              positive={positive}
              colors={colors}
            />
          )}

          {/* Horizontal LTP line */}
          <Animated.View
            pointerEvents="none"
            style={[styles.hline, { borderTopColor: colors.chartGrid }, horizontalLineStyle]}
          />

          {/* Vertical scrub line */}
          <Animated.View
            pointerEvents="none"
            style={[styles.vline, { borderLeftColor: colors.chartGrid }, verticalLineStyle]}
          />

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

          {/* Last-point dot */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.dot,
              {
                backgroundColor: positive ? colors.contentPositive : colors.contentNegative,
                shadowColor: positive ? colors.contentPositive : colors.contentNegative,
              },
              lastPointStyle,
            ]}
          />
        </View>
      </GestureDetector>

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
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  vline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
  },
  tooltip: {
    position: 'absolute',
    top: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    // Halo via elevation/shadow — RN doesn't render box-shadow with spread directly.
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  expand: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
