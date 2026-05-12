import { ReactNode, Ref, HTMLAttributes } from 'react';

import { cn } from '../shared/cn';

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  /** List rows (typically `ListButton`, `ListItem`, `ListTitle`, or `ListSeparator`). */
  children?: ReactNode;
  /** Extra classes for the list root. */
  className?: string;
  /** Forwarded to the underlying `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

export const List = (props: ListProps) => {
  const { children, className = '', ref, ...rest } = props;

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
