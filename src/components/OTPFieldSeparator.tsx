import { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';

import { cn } from '../shared/cn';

interface OTPFieldSeparatorOwnProps {
  /** Override the separator content. Default: `'-'`. */
  children?: ReactNode;
  /** Extra classes for the separator element. */
  className?: string;
  /** Forwarded to the separator `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

export type OTPFieldSeparatorProps = OTPFieldSeparatorOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof OTPFieldSeparatorOwnProps>;

export const OTPFieldSeparator = (props: OTPFieldSeparatorProps) => {
  const { children, className, ref, ...rest } = props;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        'cladd-otp-field-separator flex items-center text-cladd-outline select-none',
        className,
      )}
      {...rest}
    >
      {children ?? <span className="h-0.5 w-2 bg-cladd-outline" />}
    </div>
  );
};
