// Number/date formatters — ported from reference/index.html:881-887 + 1053-1072.

export function fmtUsd(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtSigned(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return sign + n.toFixed(2);
}

export function fmtChange(diff: number, pct: number): string {
  return `${fmtSigned(diff)} (${fmtSigned(pct)}%)`;
}

import type { Timeframe } from './chart';

// Per-timeframe time scale, matching reference/index.html:1057-1071.
function pointDate(tf: Timeframe, ago: number): Date {
  const now = new Date();
  if (tf === '1D') return new Date(now.getTime() - ago * 5 * 60 * 1000);
  if (tf === '1W') return new Date(now.getTime() - ago * 2 * 60 * 60 * 1000);
  if (tf === '1M' || tf === '3M' || tf === '6M') {
    return new Date(now.getTime() - ago * 24 * 60 * 60 * 1000);
  }
  const t = new Date(now);
  t.setMonth(t.getMonth() - ago);
  return t;
}

// Format like "9:47AM" — Figma shows no space between minute and AM/PM.
function fmtTime(d: Date): string {
  return d
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .replace(/\s/g, '');
}

// Format like "28 May".
function fmtDay(d: Date): string {
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

// Returns the price-line and time-line shown in the scrub tooltip.
// Per Figma:
//   1D       → price + change%, time-only
//   1W, 1M   → price, "time, day month"
//   3M+      → price, "day month"
export type ScrubTooltip = { price: string; time: string };

export function scrubTooltip(
  tf: Timeframe,
  series: number[],
  idx: number,
): ScrubTooltip {
  const ago = series.length - 1 - idx;
  const value = series[idx];
  const start = series[0];
  const d = pointDate(tf, ago);

  if (tf === '1D') {
    const diff = value - start;
    const pct = (diff / start) * 100;
    return {
      price: `${fmtUsd(value)} (${fmtSigned(pct)}%)`,
      time: fmtTime(d),
    };
  }
  if (tf === '1W' || tf === '1M') {
    return { price: fmtUsd(value), time: `${fmtTime(d)}, ${fmtDay(d)}` };
  }
  return { price: fmtUsd(value), time: fmtDay(d) };
}
