import { useContext } from 'react';

import { ThemeContext } from '../components/ThemeContext';

export const useTheme = () => {
  return useContext(ThemeContext).theme;
};
