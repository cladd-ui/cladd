import { useContext } from 'react';

import {
  ComponentDefaults,
  ThemeContext,
} from '../components/ThemeContext';

/**
 * Returns the default props registered for a component via
 * `CladdProvider`'s `defaults` prop, or an empty object if none.
 *
 * Intended usage in a component:
 *
 * ```ts
 * const defaults = useComponentDefaults('Button');
 * const { outline = true, ... } = { ...defaults, ...props };
 * ```
 *
 * Explicit props win because they spread last.
 */
export function useComponentDefaults<K extends keyof ComponentDefaults>(
  componentName: K,
): NonNullable<ComponentDefaults[K]> {
  const value = useContext(ThemeContext).defaults[componentName];
  return (value ?? {}) as NonNullable<ComponentDefaults[K]>;
}
