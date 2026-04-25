import { useContext } from 'react';

import { ThemeContext } from '../components/ThemeContext';

export const useAccentColor = () => {
  return useContext(ThemeContext).accentColor;
};
