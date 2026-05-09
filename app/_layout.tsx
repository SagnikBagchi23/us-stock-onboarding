import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: dark.backgroundPrimary }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: dark.backgroundPrimary }}>
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
    </View>
  );
}
