import { useContext } from 'react';

import { ComponentDefaults, ThemeContext } from '../components/ThemeContext';

/**
 * Returns the default props registered for a component via
 * `CladdProvider`'s `defaults` prop.
 *
 * When called with `props`, returns a merged props object where explicit
 * (non-`undefined`) props win over context defaults. Passing `undefined`
 * explicitly still falls back to the default — important so that wrapper
 * components forwarding `prop={prop}` don't clobber app-wide defaults.
 *
 * When called without `props`, returns just the registered defaults (or `{}`).
 */
export function useComponentDefaults<
  K extends keyof ComponentDefaults,
  P extends object,
>(componentName: K, props: P): P;
export function useComponentDefaults<K extends keyof ComponentDefaults>(
  componentName: K,
): NonNullable<ComponentDefaults[K]>;
export function useComponentDefaults<
  K extends keyof ComponentDefaults,
  P extends object,
>(componentName: K, props?: P): P | NonNullable<ComponentDefaults[K]> {
  const defaults = useContext(ThemeContext).defaults[componentName];
  if (props === undefined) {
    return (defaults ?? {}) as NonNullable<ComponentDefaults[K]>;
  }
  if (!defaults) return props;
  const merged = { ...defaults } as Record<string, unknown>;
  for (const key in props) {
    const value = (props as Record<string, unknown>)[key];
    if (value !== undefined) merged[key] = value;
  }
  return merged as P;
}
