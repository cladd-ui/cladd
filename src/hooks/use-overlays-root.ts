import { useContext } from 'react';

import { ThemeContext } from '../components/ThemeContext';

export const useOverlaysRoot = () => {
  return useContext(ThemeContext).overlaysRoot;
};
