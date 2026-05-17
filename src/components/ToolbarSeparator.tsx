import { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';

interface ToolbarSeparatorOwnProps {
  /** Optional content rendered inside the separator (rare - the separator is normally just a thin rule). */
  children?: ReactNode;
  /** Extra classes for the separator element. */
  className?: string;
  /** Forwarded to the separator `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

export type ToolbarSeparatorProps = ToolbarSeparatorOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof ToolbarSeparatorOwnProps>;

/** Shape of `ToolbarSeparator` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type ToolbarSeparatorDefaultProps = Partial<
  Omit<ToolbarSeparatorOwnProps, 'children' | 'ref'>
>;

export const ToolbarSeparator = (props: ToolbarSeparatorProps) => {
  const { children, className = '', ref, ...rest } = useComponentDefaults(
    'ToolbarSeparator',
    props,
  );

  return (
    <div
      ref={ref}
      className={cn(
        'cladd-toolbar-separator mx-1 h-1/2 w-px bg-cladd-outline',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
