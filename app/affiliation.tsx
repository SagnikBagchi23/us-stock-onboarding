import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { StatusBar } from '@/components/ui/StatusBar';
import { IconButton } from '@/components/ui/IconButton';
import { CheckboxRow } from '@/components/ui/CheckboxRow';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { AFFILIATION_OPTIONS } from '@/data/personalDetails';

export default function AffiliationScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selected, setSelected] = useState<Set<number>>(new Set());

  function toggleOption(index: number) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar />

      <View style={styles.appbar}>
        <IconButton name="arrowLeft" onPress={() => router.back()} ariaLabel="Back" />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleBlock}>
          <Text style={[textStyles.headingLarge, { color: colors.contentPrimary }]}>
            Do any of these scenarios apply to you?
          </Text>
        </View>

        <View style={styles.optionsList}>
          {AFFILIATION_OPTIONS.map((option, i) => (
            <CheckboxRow
              key={i}
              label={option}
              checked={selected.has(i)}
              onToggle={() => toggleOption(i)}
            />
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.docked,
          {
            backgroundColor: colors.backgroundSurfaceDocked,
            paddingBottom: spacing.lg + insets.bottom,
          },
        ]}
      >
        <View style={styles.badge}>
          <View style={[styles.badgeLine, { backgroundColor: colors.borderPrimary }]} />
          <Icon name="shieldCheck" size={16} color={colors.contentTertiary} />
          <View style={[styles.badgeLine, { backgroundColor: colors.borderPrimary }]} />
        </View>
        <Text style={[textStyles.bodySmall, styles.badgeText, { color: colors.contentTertiary }]}>
          {'Your information is secure and will solely be\nutilised for verification purposes'}
        </Text>
        <Button disabled={selected.size === 0} onPress={() => {}}>
          Continue
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  titleBlock: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  optionsList: {
    gap: spacing.xxl,
    paddingTop: spacing.sm,
  },
  docked: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badgeLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  badgeText: {
    textAlign: 'center',
  },
});
