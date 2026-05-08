// Static stock metadata for the GOOG screen — mirrors reference/index.html.
// (Real fetch is out of scope for v1.)

export const GOOG = {
  ticker: 'GOOG',
  name: 'Alphabet Class A (Google)',
  initialPrice: 390.85,
  sharesHeld: 10,
  avgBuy: 300.0,
  limitPrice: 300.0,
  performance: {
    todayLow: 386.42,
    todayHigh: 393.18,
    todayLowPct: 65,        // marker position % across the bar
    week52Low: 147.43,
    week52High: 397.5,
    week52Pct: 97,
    openPrice: 388.2,
    previousClose: 387.62,
    todayVolume: '28.4M',
  },
  about: {
    rows: [
      { label: 'CEO', value: 'Sundar Pichai' },
      { label: 'Founded in', value: '1998' },
      { label: 'Symbol', value: 'GOOG' },
    ],
    description:
      'Alphabet is the parent company of Google, headquartered in Mountain View, California. Its businesses span Search, YouTube, Android, Google Cloud, and AI research through DeepMind.',
  },
} as const;
