import React from 'react';
import { Canvas, Path, Group, Skia, type SkPath } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import { CHART_VIEWBOX_W } from '@/utils/chart';
import type { ChartPoint } from '@/utils/chart';

interface SkiaCanvasProps {
  currentPoints: SharedValue<ChartPoint[]>;
  scale: number;
  scaledHeight: number;
  positive: boolean;
  colors: { contentPositive: string; contentNegative: string };
}

export default function SkiaCanvas({ currentPoints, scale, scaledHeight, positive, colors }: SkiaCanvasProps) {
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
