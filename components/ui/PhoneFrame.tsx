import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

// iPhone 17 (2025) — 402×874 logical pixels, Dynamic Island.
const PHONE_W = 402;
const PHONE_H = 874;
const BEZEL = 14;
const SCREEN_RADIUS = 48;
const ISLAND_W = 124;
const ISLAND_H = 36;

interface PhoneFrameProps {
  children: React.ReactNode;
}

// Renders a device chrome around the app on web; passes through on native.
export function PhoneFrame({ children }: PhoneFrameProps) {
  if (Platform.OS !== 'web') return <>{children}</>;

  return (
    <View style={styles.stage}>
      <View style={styles.phone}>
        <View style={styles.screen}>
          {children}
          <View style={styles.homeIndicator} pointerEvents="none" />
        </View>
        <View style={styles.island} pointerEvents="none" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    padding: 32,
    minHeight: '100%' as unknown as number,
  },
  phone: {
    width: PHONE_W + BEZEL * 2,
    height: PHONE_H + BEZEL * 2,
    borderRadius: SCREEN_RADIUS + BEZEL,
    backgroundColor: '#0a0a0a',
    padding: BEZEL,
    position: 'relative',
    // Outer ring + drop shadows. Box-shadow strings work on web only.
    ...(Platform.OS === 'web'
      ? ({
          boxShadow:
            '0 0 0 2px #1c1c1e, 0 30px 60px -20px rgba(0,0,0,.5), 0 18px 36px -18px rgba(0,0,0,.35)',
        } as object)
      : {}),
  },
  screen: {
    width: PHONE_W,
    height: PHONE_H,
    borderRadius: SCREEN_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#060809',
  },
  island: {
    position: 'absolute',
    top: BEZEL + 12,
    left: '50%',
    width: ISLAND_W,
    height: ISLAND_H,
    marginLeft: -(ISLAND_W / 2),
    backgroundColor: '#000',
    borderRadius: ISLAND_H / 2,
    zIndex: 50,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    width: 134,
    height: 4,
    marginLeft: -67,
    borderRadius: 2,
    backgroundColor: '#F2F5F7',
    opacity: 0.9,
  },
});
