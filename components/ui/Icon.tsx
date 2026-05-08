import React from 'react';
import { Text, type TextStyle } from 'react-native';

// Hugeicons stroke icons used in the prototype.
// Codepoints lifted from hugeicons-min.css (matching .hgi-stroke.<name>::before).
// All codepoints are in the SMP-A plane (above U+FFFF), so use fromCodePoint.
const CODEPOINTS = {
  arrowLeft: 0xf161c,        // hgi-arrow-left-01
  arrowRight: 0xf162d,       // hgi-arrow-right-01
  arrowUp: 0xf163c,          // hgi-arrow-up-01
  arrowExpand: 0xf1616,      // hgi-arrow-expand-01
  search: 0xf254c,           // hgi-search-01
  signal: 0xf2608,           // hgi-signal
  wifi: 0xf29f1,             // hgi-wifi-01
  batteryFull: 0xf16dc,      // hgi-battery-full
  informationCircle: 0xf1eba, // hgi-information-circle
} as const;

export type IconName = keyof typeof CODEPOINTS;

const GLYPHS: Record<IconName, string> = Object.fromEntries(
  Object.entries(CODEPOINTS).map(([k, v]) => [k, String.fromCodePoint(v)]),
) as Record<IconName, string>;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: TextStyle;
}

export function Icon({ name, size = 20, color, style }: IconProps) {
  return (
    <Text
      allowFontScaling={false}
      style={[
        {
          fontFamily: 'HugeiconsStroke',
          fontSize: size,
          lineHeight: size,
          width: size,
          height: size,
          color,
          textAlign: 'center',
          includeFontPadding: false,
        },
        style,
      ]}
    >
      {GLYPHS[name]}
    </Text>
  );
}
