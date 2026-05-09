import React from 'react';
import { Path, Svg } from 'react-native-svg';
import Animated, { useAnimatedProps, type SharedValue } from 'react-native-reanimated';
import { CHART_VIEWBOX_W, CHART_VIEWBOX_H, type ChartPoint } from '@/utils/chart';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SvgCanvasProps {
  currentPoints: SharedValue<ChartPoint[]>;
  scale: number;
  scaledHeight: number;
  positive: boolean;
  colors: { contentPositive: string; contentNegative: string };
}

export default function SvgCanvas({ currentPoints, scale, scaledHeight, positive, colors }: SvgCanvasProps) {
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const pts = currentPoints.value;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i].x} ${pts[i].y}`;
    }
    return { d };
  });

  return (
    <Svg
      width={scale * CHART_VIEWBOX_W}
      height={scaledHeight}
      viewBox={`0 0 ${CHART_VIEWBOX_W} ${CHART_VIEWBOX_H}`}
    >
      <AnimatedPath
        animatedProps={animatedProps}
        stroke={positive ? colors.contentPositive : colors.contentNegative}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
