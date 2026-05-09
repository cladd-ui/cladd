import { useAccentColor } from '../hooks/use-accent-color';
import { cn } from '../shared/cn';
import { nestedSizeClasses } from '../shared/size-utls';
import { Color } from '../types';

export type SpinnerSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface SpinnerProps {
  /** Spinner dimension. Default `'sm'`. Drives the size, knob position, and border thickness. */
  size?: SpinnerSize;
  /** Accent color for the spinning knob and ring. Default: theme accent. */
  color?: Color;
  /** Extra classes for the spinner root element. */
  className?: string;
}

export function Spinner(props: SpinnerProps) {
  const accentColor = useAccentColor();
  const { size = 'sm', color = accentColor, className } = props;
  const sizeClass = nestedSizeClasses(size, 'size');
  const borderWidth = {
    '2xs': 'border',
    xs: 'border',
    sm: 'border-[1.5px]',
    md: 'border-2',
    lg: 'border-[2.5px]',
    xl: 'border-3',
    '2xl': 'border-[3.5px]',
  }[size];

  return (
    <div
      className={cn(
        'cladd-spinner relative animate-cladd-spinner rounded-full border-cladd-primary border-r-transparent',
        `cladd-color-${color}`,
        borderWidth,
        sizeClass,
        className,
      )}
    />
  );
}
