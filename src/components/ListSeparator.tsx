import { ReactNode, Ref, HTMLAttributes } from 'react';

import { cn } from '../shared/cn';

export interface ListSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional content rendered on the divider (rarely used). */
  children?: ReactNode;
  /** Extra classes for the separator root. */
  className?: string;
  /** Forwarded to the underlying `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

export const ListSeparator = (props: ListSeparatorProps) => {
  const { children, className = '', ref, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn(
        'cladd-list-separator -mx-2 my-2 h-px bg-cladd-outline',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
