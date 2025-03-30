import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: Theme;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  theme: DefaultTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // ✅ Detect system theme
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // ✅ Persist system theme changes
  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  // ✅ Toggle between themes
  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = isDark ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
