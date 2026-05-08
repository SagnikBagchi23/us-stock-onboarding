import React, { useMemo } from 'react';
import { Canvas, Path, Group, Skia } from '@shopify/react-native-skia';

// Google "G" mark — same SVG paths as reference/index.html:538-543, drawn via Skia.
// Each path corresponds to one of the four quadrant fills of the Google logo.
const PATHS = [
  { fill: '#FFC107', d: 'M43.611 20.083H42V20H24v8h11.303C33.972 32.91 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z' },
  { fill: '#FF3D00', d: 'M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z' },
  { fill: '#4CAF50', d: 'M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.385 0-9.954-3.067-11.297-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z' },
  { fill: '#1976D2', d: 'M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z' },
];

export function GoogleLogo({ size = 22 }: { size?: number }) {
  const scale = size / 48;
  const paths = useMemo(
    () => PATHS.map((p) => ({ skPath: Skia.Path.MakeFromSVGString(p.d), fill: p.fill })),
    [],
  );
  return (
    <Canvas style={{ width: size, height: size }}>
      <Group transform={[{ scale }]}>
        {paths.map((p, i) => (p.skPath ? <Path key={i} path={p.skPath} color={p.fill} /> : null))}
      </Group>
    </Canvas>
  );
}
