import { ReactNode, Ref, ElementType, ComponentPropsWithoutRef } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';

interface SurfaceCutContentOwnProps<C extends ElementType = 'div'> {
  /** Content rendered inside the cut surface's content layer. */
  children?: ReactNode;
  /** Stretch the content to `h-full`. Default `true`. Set `false` for content sized by intrinsic height. */
  fullHeight?: boolean;
  /** Polymorphic root element. Defaults to `'div'`. */
  as?: C;
  /** Extra classes for the wrapper. */
  className?: string;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
}

export type SurfaceCutContentProps<C extends ElementType = 'div'> =
  SurfaceCutContentOwnProps<C> &
    Omit<ComponentPropsWithoutRef<C>, keyof SurfaceCutContentOwnProps<C>>;

/** Shape of `SurfaceCutContent` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type SurfaceCutContentDefaultProps = Partial<
  Omit<SurfaceCutContentOwnProps, 'as' | 'ref' | 'children'>
>;

export const SurfaceCutContent = <C extends ElementType = 'div'>(
  props: SurfaceCutContentProps<C>,
) => {
  const {
    children,
    fullHeight = true,
    as: asProp = 'div',
    className = '',
    ref,
    ...rest
  } = useComponentDefaults('SurfaceCutContent', props);
  const Component = asProp as ElementType;
  return (
    <Component
      ref={ref}
      className={cn(`relative`, fullHeight && 'h-full', className)}
      {...rest}
    >
      {children}
    </Component>
  );
};
