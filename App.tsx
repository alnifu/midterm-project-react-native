import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { JobProvider } from './src/context/JobContext';
import { StatusBar } from 'react-native';

import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';

// Separate AppContent for better readability
const AppContent = () => {
  const themeContext = useContext(ThemeContext);

  // ✅ Apply the theme dynamically based on context
  const theme: Theme = themeContext?.theme || DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <JobProvider>
        <AppContent />
      </JobProvider>
    </ThemeProvider>
  );
}
