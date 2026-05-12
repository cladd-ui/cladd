import { ReactNode, Ref, ComponentPropsWithoutRef } from 'react';

import { cn } from '../shared/cn';

interface SectionTitleOwnProps {
  /** Title content (typically a short uppercase section label). */
  children?: ReactNode;
  /** Extra classes for the section title root. */
  className?: string;
  /** Forwarded to the underlying `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

export type SectionTitleProps = SectionTitleOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof SectionTitleOwnProps>;

export const SectionTitle = (props: SectionTitleProps) => {
  const { children, className = '', ref, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn(
        'cladd-section-title flex items-end gap-4 text-cladd-xs font-medium text-cladd-fg-soft uppercase select-none',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
