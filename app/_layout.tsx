import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/constants/theme';
import { dark } from '@/constants/tokens';
import { PhoneFrame } from '@/components/ui/PhoneFrame';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Sohne: require('../assets/fonts/Sohne-Kraftig.otf'),
    GrowwSans: require('../assets/fonts/GrowwSans-Regular.otf'),
    GrowwSansMedium: require('../assets/fonts/GrowwSans-Medium.otf'),
    HugeiconsStroke: require('../assets/fonts/hugeicons-stroke-standard.otf'),
    HugeiconsSolid: require('../assets/fonts/hugeicons-solid-standard.otf'),
  });

  // Skia on web needs CanvasKit (WASM) loaded before any <Canvas> mounts.
  // On native this is a no-op. See https://shopify.github.io/react-native-skia/docs/getting-started/web/
  const [skiaReady, setSkiaReady] = useState(Platform.OS !== 'web');
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    let cancelled = false;
    import('@shopify/react-native-skia/lib/module/web')
      .then(({ LoadSkiaWeb }) =>
        LoadSkiaWeb({ locateFile: (file: string) => `/${file}` }),
      )
      .then(() => {
        if (!cancelled) setSkiaReady(true);
      })
      .catch(() => {
        // Skia WASM failed — allow the app to render without the chart.
        if (!cancelled) setSkiaReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if ((!loaded && !error) || !skiaReady) {
    return <View style={{ flex: 1, backgroundColor: dark.backgroundPrimary }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: dark.backgroundPrimary }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ExpoStatusBar style="light" backgroundColor={dark.backgroundPrimary} translucent={false} />
          <PhoneFrame>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: dark.backgroundPrimary },
              }}
            />
          </PhoneFrame>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
