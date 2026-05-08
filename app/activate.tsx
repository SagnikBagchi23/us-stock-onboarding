import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { StatusBar } from '@/components/ui/StatusBar';
import { StickyCTA } from '@/components/product/StickyCTA';

export default function ActivateScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar />
      <AppBar title="Activate US Stocks" onBack={() => router.back()} />

      <View style={styles.body}>
        <Text style={[textStyles.bodyBase, { color: colors.contentSecondary }]}>
          Next screen placeholder. Tell me what comes after “Activate US Stocks” and I'll build it.
        </Text>
        <Text style={[textStyles.bodySmall, { color: colors.contentTertiary }]}>
          Add a new screen at <Text style={textStyles.bodySmallHeavy}>app/&lt;name&gt;.tsx</Text> and link it with{' '}
          <Text style={textStyles.bodySmallHeavy}>router.push('/&lt;name&gt;')</Text>.
        </Text>
      </View>

      <StickyCTA>
        <Button variant="secondary" onPress={() => router.back()}>
          Go back
        </Button>
      </StickyCTA>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: spacing.xxl,
    gap: spacing.md,
  },
});
