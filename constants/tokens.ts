import { Easing } from 'react-native';

// ─── Mint DS — Groww Invest dark tokens (lifted from reference/index.html:69-104)
export const dark = {
  backgroundPrimary: '#060809',
  backgroundSurfaceZ1: '#151819',
  backgroundSurfaceZ2: '#1F2324',
  backgroundSurfaceDocked: '#151819',
  backgroundSecondary: '#151819',
  backgroundTertiary: '#252525',
  backgroundAccent: '#04B488',
  backgroundNegative: '#ED5533',
  backgroundPositive: '#04B488',
  backgroundWarning: '#E7A71E',
  backgroundAccentSubtle: '#0E2A22',
  backgroundNegativeSubtle: '#2C1612',
  backgroundPositiveSubtle: '#0E2A22',
  backgroundWarningSubtle: '#2C2310',
  backgroundDisabled: '#1F2324',
  backgroundTransparent: 'transparent',
  borderPrimary: '#252A2C',
  borderAccent: '#04B488',
  borderNegative: '#ED5533',
  borderDisabled: '#252A2C',
  borderNeutral: '#F2F5F7',
  contentPrimary: '#F2F5F7',
  contentSecondary: '#989EA0',
  contentTertiary: '#696E70',
  contentDisabled: '#4A4F51',
  contentAccent: '#04B488',
  contentPositive: '#0ABB92',
  contentNegative: '#ED5533',
  contentWarning: '#E7A71E',
  contentOnColour: '#FFFFFF',
  contentOnAccentSubtle: '#0ABB92',
  contentOnPositiveSubtle: '#0ABB92',
  contentOnNegativeSubtle: '#ED5533',
  contentOnWarningSubtle: '#E7A71E',
  // Chart helpers
  chartGrid: '#3A3F42',
  chartDotHalo: 'rgba(10,187,146,0.18)',
} as const;

export type Colors = typeof dark;

// ─── Spacing
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// ─── Border radius
export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 99,
} as const;

// ─── Typography
// Font keys must match the keys passed to useFonts() in app/_layout.tsx
export const fonts = {
  heading: 'Sohne',
  body: 'GrowwSans',
  bodyHeavy: 'GrowwSansMedium',
} as const;

// Spread these directly into StyleSheet entries.
// Mirrors the .body-* / .heading-* / .display-* classes in reference/index.html:44-57.
// Setting fontWeight explicitly stops the browser/RNW from applying synthetic bold
// when the loaded font face only declares a single weight axis.
export const textStyles = {
  bodyXSmallHeavy: { fontFamily: fonts.bodyHeavy, fontSize: 10, lineHeight: 12, fontWeight: '500' as const },
  bodySmall:       { fontFamily: fonts.body,      fontSize: 12, lineHeight: 18, fontWeight: '400' as const },
  bodySmallHeavy:  { fontFamily: fonts.bodyHeavy, fontSize: 12, lineHeight: 18, fontWeight: '500' as const },
  bodyBase:        { fontFamily: fonts.body,      fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  bodyBaseHeavy:   { fontFamily: fonts.bodyHeavy, fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  bodyLarge:       { fontFamily: fonts.body,      fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodyLargeHeavy:  { fontFamily: fonts.bodyHeavy, fontSize: 16, lineHeight: 24, fontWeight: '500' as const },

  headingEyebrow:  { fontFamily: fonts.heading, fontSize: 10, lineHeight: 12, letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: '500' as const },
  headingXSmall:   { fontFamily: fonts.heading, fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  headingSmall:    { fontFamily: fonts.heading, fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
  headingBase:     { fontFamily: fonts.heading, fontSize: 18, lineHeight: 28, fontWeight: '500' as const },
  headingLarge:    { fontFamily: fonts.heading, fontSize: 20, lineHeight: 32, fontWeight: '500' as const },
  displaySmall:    { fontFamily: fonts.heading, fontSize: 24, lineHeight: 32, fontWeight: '500' as const },
  displayBase:     { fontFamily: fonts.heading, fontSize: 28, lineHeight: 36, fontWeight: '500' as const },
} as const;

// ─── Easing — Mint motion tokens from reference/index.html:37-41
export const easing = {
  out: Easing.bezier(0.23, 1, 0.32, 1),
  inOut: Easing.bezier(0.77, 0, 0.175, 1),
  drawer: Easing.bezier(0.32, 0.72, 0, 1),
};

// Motion durations
export const motion = {
  morph: 240,         // chart timeframe morph
  appbarFade: 200,    // app bar background swap
  titleSlide: 280,    // app bar title slide-in
  press: 160,         // button press
  pill: 180,          // pill state change
  liveTick: 1800,     // ms between live ticks (4000 if reduce-motion)
} as const;
