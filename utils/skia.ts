import { Platform } from 'react-native';
import React from 'react';

let skiaPromise: Promise<boolean> | null = null;

export function ensureSkiaLoaded(): Promise<boolean> {
  if (Platform.OS !== 'web') return Promise.resolve(true);
  if (!skiaPromise) {
    skiaPromise = import('@shopify/react-native-skia/lib/module/web')
      .then(({ LoadSkiaWeb }) => LoadSkiaWeb({ locateFile: (file: string) => `/${file}` }))
      .then(() => true)
      .catch((err) => {
        console.error('[skia] LoadSkiaWeb failed:', err);
        return false;
      });
  }
  return skiaPromise;
}

export function useSkiaReady(): boolean {
  const [ready, setReady] = React.useState(Platform.OS !== 'web');
  React.useEffect(() => {
    if (Platform.OS !== 'web') return;
    ensureSkiaLoaded().then(ok => { if (ok) setReady(true); });
  }, []);
  return ready;
}
