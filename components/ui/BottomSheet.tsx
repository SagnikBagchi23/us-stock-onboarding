import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { radius, easing as appEasing } from '@/constants/tokens';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  // Sheet's intrinsic height; the slide travels by this much.
  sheetHeight: number;
}

const SCRIM_MAX = 0.5;
// Drawer feel: iOS-like curve in (deliberate), strong ease-out on release.
const ENTER_MS = 360;
const EXIT_MS = 220;
const ENTER_EASE = Easing.bezier(0.32, 0.72, 0, 1); // matches --ease-drawer
const EXIT_EASE = appEasing.out;

// Reusable bottom sheet: scrim + sliding panel from bottom.
// Stays mounted while the close animation plays, then unmounts to release the layer.
export function BottomSheet({ visible, onClose, children, sheetHeight }: BottomSheetProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0); // 0 = closed, 1 = open
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      const id = requestAnimationFrame(() => {
        progress.value = withTiming(1, { duration: ENTER_MS, easing: ENTER_EASE });
      });
      return () => cancelAnimationFrame(id);
    } else if (mounted) {
      progress.value = withTiming(0, { duration: EXIT_MS, easing: EXIT_EASE }, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
    }
  }, [visible, progress, mounted]);

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: progress.value * SCRIM_MAX,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * sheetHeight }],
  }));

  if (!mounted) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.layer]} pointerEvents="box-none">
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, scrimStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: colors.backgroundSurfaceZ1 },
          sheetStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    zIndex: 100,
  },
  scrim: {
    backgroundColor: '#000',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
});
