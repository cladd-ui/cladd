import { ReactNode, Ref, HTMLAttributes } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Row content. Non-interactive list row (use `ListButton` for clickable rows). */
  children?: ReactNode;
  /** Extra classes for the row root. */
  className?: string;
  /** Forwarded to the underlying `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

/** Shape of `ListItem` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type ListItemDefaultProps = Partial<
  Omit<ListItemProps, 'children' | 'ref'>
>;

export const ListItem = (props: ListItemProps, ref?: Ref<HTMLDivElement>) => {
  const {
    children,
    className = '',
    ...rest
  } = useComponentDefaults('ListItem', props);

  return (
    <div
      ref={ref}
      className={cn(
        'cladd-list-item flex min-h-9 items-center gap-4 px-2 py-1 text-cladd-xs font-medium',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
