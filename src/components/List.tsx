import { ReactNode, Ref, HTMLAttributes } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  /** List rows (typically `ListButton`, `ListItem`, `ListTitle`, or `ListSeparator`). */
  children?: ReactNode;
  /** Extra classes for the list root. */
  className?: string;
  /** Forwarded to the underlying `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

/** Shape of `List` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type ListDefaultProps = Partial<Omit<ListProps, 'children' | 'ref'>>;

export const List = (props: ListProps) => {
  const { children, className = '', ref, ...rest } = useComponentDefaults(
    'List',
    props,
  );

  return (
    <div
      ref={ref}
      className={cn('cladd-list flex flex-col p-2', className)}
      {...rest}
    >
      {children}
    </div>
  );
};
