// Ported verbatim from reference/index.html:763-849.
// Pure JS — no DOM, no React. Safe to call from worklets if needed.

export type ChartPoint = { x: number; y: number };

// Chart geometry (viewBox coords) — matches the SVG viewBox in the HTML.
export const CHART_VIEWBOX_W = 360;
export const CHART_VIEWBOX_H = 340;
export const CHART_PAD_X = 16;
export const CHART_PAD_TOP = 40;
export const CHART_PAD_BOTTOM = 40;
export const CHART_W = CHART_VIEWBOX_W - CHART_PAD_X * 2;
export const CHART_H = CHART_VIEWBOX_H - CHART_PAD_TOP - CHART_PAD_BOTTOM;

// Resampled point count for fluid morphing.
export const MORPH_N = 96;

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | '10Y';

type TfConfig = { points: number; vol: number; drift: number; widthFrac: number };

export const TIMEFRAMES: Record<Timeframe, TfConfig> = {
  '1D':  { points: 78,  vol: 0.0030, drift: 0.00012, widthFrac: 0.60 },
  '1W':  { points: 60,  vol: 0.0080, drift: 0.00020, widthFrac: 1.00 },
  '1M':  { points: 80,  vol: 0.0140, drift: 0.00060, widthFrac: 1.00 },
  '3M':  { points: 90,  vol: 0.0220, drift: 0.00080, widthFrac: 1.00 },
  '6M':  { points: 100, vol: 0.0260, drift: 0.00060, widthFrac: 1.00 },
  '1Y':  { points: 120, vol: 0.0320, drift: 0.00050, widthFrac: 1.00 },
  '3Y':  { points: 140, vol: 0.0420, drift: 0.00080, widthFrac: 1.00 },
  '5Y':  { points: 160, vol: 0.0500, drift: 0.00100, widthFrac: 1.00 },
  '10Y': { points: 180, vol: 0.0650, drift: 0.00120, widthFrac: 1.00 },
};

export const TIMEFRAME_ORDER: Timeframe[] = ['1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y', '10Y'];

// Deterministic PRNG so each timeframe is consistent across renders.
export function mulberry32(seed: number): () => number {
  let s = seed;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashTf(tf: string): number {
  let h = 0;
  for (let i = 0; i < tf.length; i++) h = (h * 31 + tf.charCodeAt(i)) >>> 0;
  return h || 1;
}

// Generate a price series ending at endPrice, working backwards.
export function generateSeries(tf: Timeframe, endPrice: number, seed: number): number[] {
  const cfg = TIMEFRAMES[tf];
  const n = cfg.points;
  const rnd = mulberry32(seed);
  const series = new Array<number>(n);
  series[n - 1] = endPrice;
  for (let i = n - 2; i >= 0; i--) {
    // gaussian-ish noise via three uniforms
    const u = (rnd() + rnd() + rnd() - 1.5) * 2;
    const step = (endPrice * cfg.vol * u) / Math.sqrt(n) - (endPrice * cfg.drift) / n;
    series[i] = Math.max(1, series[i + 1] - step);
  }
  return series;
}

// Resample a price series to MORPH_N evenly-spaced points and project to viewBox coords.
export function projectSeries(s: number[], widthFrac: number): ChartPoint[] {
  const min = Math.min(...s);
  const max = Math.max(...s);
  const range = Math.max(max - min, 0.0001);
  const n = s.length;
  const usableW = CHART_W * widthFrac;
  const out = new Array<ChartPoint>(MORPH_N);
  for (let i = 0; i < MORPH_N; i++) {
    const tf = i / (MORPH_N - 1);
    const sf = tf * (n - 1);
    const i0 = Math.floor(sf);
    const i1 = Math.min(n - 1, i0 + 1);
    const frac = sf - i0;
    const v = s[i0] * (1 - frac) + s[i1] * frac;
    out[i] = {
      x: CHART_PAD_X + tf * usableW,
      y: CHART_PAD_TOP + (1 - (v - min) / range) * CHART_H,
    };
  }
  return out;
}

// Build an SVG-style path string from {x,y} points. Used as a fallback or for snapshots —
// the live chart uses Skia.Path.moveTo/lineTo for performance.
export function buildPathString(points: ChartPoint[]): string {
  let d = '';
  for (let i = 0; i < points.length; i++) {
    d += (i === 0 ? 'M ' : ' L ') + points[i].x.toFixed(2) + ',' + points[i].y.toFixed(2);
  }
  return d;
}
