import { ComponentPropsWithoutRef, ElementType, ReactNode, Ref } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';

interface SurfaceContentOwnProps<C extends ElementType = 'div'> {
  /** Content rendered inside the surface's content layer (above tint/outline, below focus ring). */
  children?: ReactNode;
  /** Extra classes for the content wrapper. */
  className?: string;
  /**
   * Polymorphic root element. Defaults to `'div'`.
   *
   * `Surface` passes `'span'` automatically when the surface renders as phrasing content (e.g. `as="kbd"`), so the wrapper stays valid inside `<p>`, `<button>`, etc.
   */
  as?: C;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
}

export type SurfaceContentProps<C extends ElementType = 'div'> =
  SurfaceContentOwnProps<C> &
    Omit<ComponentPropsWithoutRef<C>, keyof SurfaceContentOwnProps<C>>;

/** Shape of `SurfaceContent` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type SurfaceContentDefaultProps = Partial<
  Omit<SurfaceContentProps, 'as' | 'children' | 'ref'>
>;

export const SurfaceContent = <C extends ElementType = 'div'>(
  props: SurfaceContentProps<C>,
) => {
  const {
    children,
    className = '',
    as: asProp = 'div',
    ref,
    ...rest
  } = useComponentDefaults('SurfaceContent', props);
  const Component = asProp as ElementType;
  return (
    <Component ref={ref} className={cn(`relative h-full`, className)} {...rest}>
      {children}
    </Component>
  );
};
