import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing, radius } from '@/constants/tokens';
import { Icon } from '@/components/ui/Icon';
import { fmtUsd } from '@/utils/format';

interface PerfRow {
  lowLabel: string;
  lowValue: string;
  highLabel: string;
  highValue: string;
  markerPct: number; // 0..100
}

interface PerformanceSectionProps {
  todayLow: number;
  todayHigh: number;
  todayMarkerPct: number;
  week52Low: number;
  week52High: number;
  week52MarkerPct: number;
  openPrice: number;
  previousClose: number;
  todayVolume: string;
}

export function PerformanceSection(props: PerformanceSectionProps) {
  const { colors } = useTheme();

  const rows: PerfRow[] = [
    {
      lowLabel: "Today's low",
      lowValue: fmtUsd(props.todayLow),
      highLabel: "Today's high",
      highValue: fmtUsd(props.todayHigh),
      markerPct: props.todayMarkerPct,
    },
    {
      lowLabel: '52 week low',
      lowValue: fmtUsd(props.week52Low),
      highLabel: '52 week high',
      highValue: fmtUsd(props.week52High),
      markerPct: props.week52MarkerPct,
    },
  ];

  return (
    <View style={[styles.wrap, { borderBottomColor: colors.borderPrimary }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionLeft}>
          <Text style={[textStyles.headingBase, { color: colors.contentPrimary }]}>Performance</Text>
          <Icon name="informationCircle" size={20} color={colors.contentSecondary} />
        </View>
        <Icon name="arrowUp" size={20} color={colors.contentSecondary} />
      </View>

      <View style={styles.rows}>
        {rows.map((row, i) => (
          <View key={row.lowLabel} style={styles.row}>
            <View style={styles.head}>
              <View>
                <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>{row.lowLabel}</Text>
                <Text style={[textStyles.bodyBaseHeavy, { color: colors.contentPrimary }]}>{row.lowValue}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>{row.highLabel}</Text>
                <Text style={[textStyles.bodyBaseHeavy, { color: colors.contentPrimary }]}>{row.highValue}</Text>
              </View>
            </View>
            <View style={styles.bar}>
              <View style={[styles.track, { backgroundColor: colors.contentAccent }]} />
              <View
                style={[
                  styles.marker,
                  { backgroundColor: colors.contentPrimary, left: `${row.markerPct}%` },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.triplet}>
        <View style={styles.cell}>
          <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>Open price</Text>
          <Text style={[textStyles.bodyBaseHeavy, { color: colors.contentPrimary }]}>{fmtUsd(props.openPrice)}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>Previous close</Text>
          <Text style={[textStyles.bodyBaseHeavy, { color: colors.contentPrimary }]}>{fmtUsd(props.previousClose)}</Text>
        </View>
        <View style={[styles.cell, { alignItems: 'flex-end' }]}>
          <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>Today's volume</Text>
          <Text style={[textStyles.bodyBaseHeavy, { color: colors.contentPrimary }]}>{props.todayVolume}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rows: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.xxl,
  },
  row: {
    gap: spacing.sm,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  bar: {
    height: 22,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    borderRadius: radius.full,
  },
  marker: {
    position: 'absolute',
    width: 2,
    height: 18,
    borderRadius: 2,
    transform: [{ translateX: -1 }],
  },
  triplet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  cell: {
    flex: 1,
    gap: 2,
  },
});
