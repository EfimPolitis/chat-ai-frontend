import { useContext } from 'react';

import { ThemeContext } from '@/components/layouts/theme/theme.helper';

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'You can use "useTheme" hook only within a <ThemeProvider> component.'
    );
  }

  return context;
};
