import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';
import { textStyles } from '@/constants/tokens';
import { Icon } from '@/components/ui/Icon';

export default function CompleteScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Pressable
      style={[
        styles.container,
        { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      onPress={() => router.replace('/')}
    >
      <View style={styles.lockup}>
        <View style={[styles.outerCircle, { backgroundColor: colors.backgroundPositiveSubtle }]}>
          <View style={[styles.innerCircle, { backgroundColor: colors.backgroundPositive }]}>
            <Icon name="tick" size={48} color={colors.contentOnColour} />
          </View>
        </View>

        <View style={styles.copy}>
          <Text style={[textStyles.displaySmall, styles.center, { color: colors.contentPrimary }]}>
            Your global investing journey starts now
          </Text>
          <Text style={[textStyles.bodyBase, styles.center, { color: colors.contentSecondary }]}>
            Buy your first US Stock on Groww
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockup: {
    alignItems: 'center',
    gap: 24,
    width: 301,
  },
  outerCircle: {
    width: 112,
    height: 112,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: 8,
    width: '100%',
  },
  center: {
    textAlign: 'center',
  },
});
