import { ReactNode, Ref, ComponentPropsWithoutRef } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';

interface ListTitleOwnProps {
  /** Title content (typically a short uppercase label). */
  children?: ReactNode;
  /** Extra classes for the title root. */
  className?: string;
  /** Forwarded to the underlying `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

export type ListTitleProps = ListTitleOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof ListTitleOwnProps>;

/** Shape of `ListTitle` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type ListTitleDefaultProps = Partial<
  Omit<ListTitleOwnProps, 'children' | 'ref'>
>;

export const ListTitle = (props: ListTitleProps) => {
  const {
    children,
    className = '',
    ref,
    ...rest
  } = useComponentDefaults('ListTitle', props);

  return (
    <div
      ref={ref}
      className={cn(
        'cladd-list-title flex items-end gap-4 p-2 text-cladd-xs font-medium text-cladd-fg-soft uppercase select-none',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
