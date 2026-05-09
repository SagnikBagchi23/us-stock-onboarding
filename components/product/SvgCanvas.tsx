import React, { useEffect } from 'react';
import { Path, Svg, Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { CHART_VIEWBOX_W, CHART_VIEWBOX_H, MORPH_N, type ChartPoint } from '@/utils/chart';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface SvgCanvasProps {
  currentPoints: SharedValue<ChartPoint[]>;
  scale: number;
  scaledHeight: number;
  positive: boolean;
  colors: { contentPositive: string; contentNegative: string };
}

export default function SvgCanvas({ currentPoints, scale, scaledHeight, positive, colors }: SvgCanvasProps) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
  }, [pulse]);

  const pathProps = useAnimatedProps(() => {
    'worklet';
    const pts = currentPoints.value;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i].x} ${pts[i].y}`;
    }
    return { d };
  });

  // 4px solid dot radius, 10px max pulse radius — both in viewBox units
  const dotR = 4 / scale;
  const pulseMaxR = 10 / scale;

  const dotProps = useAnimatedProps(() => {
    'worklet';
    const last = currentPoints.value[MORPH_N - 1];
    return { cx: last.x, cy: last.y };
  });

  const pulseRingProps = useAnimatedProps(() => {
    'worklet';
    const last = currentPoints.value[MORPH_N - 1];
    return {
      cx: last.x,
      cy: last.y,
      r: dotR + pulse.value * (pulseMaxR - dotR),
      opacity: 0.5 * (1 - pulse.value),
    };
  });

  const color = positive ? colors.contentPositive : colors.contentNegative;

  return (
    <Svg
      width={scale * CHART_VIEWBOX_W}
      height={scaledHeight}
      viewBox={`0 0 ${CHART_VIEWBOX_W} ${CHART_VIEWBOX_H}`}
    >
      <AnimatedPath
        animatedProps={pathProps}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* Pulse ring — same coordinate system as the path, zero gap possible */}
      <AnimatedCircle animatedProps={pulseRingProps} r={dotR} fill={color} />
      {/* Solid dot on top */}
      <AnimatedCircle animatedProps={dotProps} r={dotR} fill={color} />
    </Svg>
  );
}
