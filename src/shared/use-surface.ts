import { useContext } from 'react';

import { SurfaceContext } from '../components/SurfaceContext';

export function useSurface(): number {
  return (useContext(SurfaceContext) || { level: 0 }).level;
}
