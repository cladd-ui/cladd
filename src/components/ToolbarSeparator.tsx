import { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';

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

export const ToolbarSeparator = (props: ToolbarSeparatorProps) => {
  const { children, className = '', ref, ...rest } = props;

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
