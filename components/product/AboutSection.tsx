import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { Icon } from '@/components/ui/Icon';

interface AboutRow {
  label: string;
  value: string;
}

interface AboutSectionProps {
  rows: readonly AboutRow[];
  description: string;
}

export function AboutSection({ rows, description }: AboutSectionProps) {
  const { colors } = useTheme();
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={[textStyles.headingBase, { color: colors.contentPrimary }]}>About</Text>
        <Icon name="arrowUp" size={20} color={colors.contentSecondary} />
      </View>

      <View style={styles.body}>
        <View style={styles.rows}>
          {rows.map((r) => (
            <View key={r.label} style={styles.row}>
              <Text style={[textStyles.bodyBase, { color: colors.contentSecondary }]}>{r.label}</Text>
              <Text style={[textStyles.bodyBaseHeavy, { color: colors.contentPrimary }]}>{r.value}</Text>
            </View>
          ))}
        </View>

        <View>
          <Text style={[textStyles.bodyBase, { color: colors.contentSecondary }]}>{description}</Text>
          <Pressable style={styles.more}>
            <Text style={[textStyles.bodySmallHeavy, { color: colors.contentAccent }]}>Read more</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  rows: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  more: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
