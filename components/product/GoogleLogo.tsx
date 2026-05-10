import React from 'react';
import { Image } from 'expo-image';

export function GoogleLogo({ size = 22 }: { size?: number }) {
  return (
    <Image
      source={require('@/assets/google-logo.png')}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}
