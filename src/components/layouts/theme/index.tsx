import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { ThemeToggler } from '@/components/ui/theme-toggle';

import {
  StorageKey,
  ThemeContext,
  type Themes,
  getTheme,
  supportedThemes,
} from './theme.helper';

export const ThemeLayout = (props: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Themes>(getTheme);

  useEffect(() => {
    localStorage.setItem(StorageKey, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        supportedThemes,
      }}
    >
      {props.children}
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: theme === 'dark' ? '#303030' : '#ffffff',
            color: theme === 'dark' ? '#d7d7d7' : '000',
            textAlign: 'center',
          },
          duration: 5000,
        }}
      />
    </ThemeContext.Provider>
  );
};

ThemeLayout.ThemeToggler = ThemeToggler;
