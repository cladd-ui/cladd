import { useContext } from 'react';

import { SurfaceContext } from '../components/SurfaceContext';
import { Color } from '../types';

export function useSurface(): number {
  return (useContext(SurfaceContext) || { level: 0 }).level;
}

/**
 * Region color of the nearest enclosing colored surface (the `cladd-color-{name}`
 * cascade, mirrored in context). `''` when no surface up the tree set a color.
 */
export function useSurfaceColor(): Color {
  return (useContext(SurfaceContext) || { color: '' }).color;
}
