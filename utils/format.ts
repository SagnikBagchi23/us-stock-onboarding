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

// Tooltip label for the scrub indicator.
// `idx` is the position in the full series; `total` is series.length.
export function scrubLabel(tf: Timeframe, idx: number, total: number): string {
  const ago = total - 1 - idx;
  const now = new Date();
  if (tf === '1D') {
    const t = new Date(now.getTime() - ago * 5 * 60 * 1000);
    return t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  if (tf === '1W') {
    const t = new Date(now.getTime() - ago * 60 * 60 * 1000 * 2);
    return t.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  }
  if (tf === '1M' || tf === '3M' || tf === '6M') {
    const t = new Date(now.getTime() - ago * 24 * 60 * 60 * 1000);
    return t.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  const t = new Date(now);
  t.setMonth(t.getMonth() - ago);
  return t.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
