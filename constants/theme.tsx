import React, { createContext, useContext } from 'react';
import { dark, type Colors } from './tokens';

type ThemeValue = { colors: Colors };

const ThemeContext = createContext<ThemeValue>({ colors: dark });

// Dark-only for v1 — matches the HTML reference, which has no light tokens defined.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{ colors: dark }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
