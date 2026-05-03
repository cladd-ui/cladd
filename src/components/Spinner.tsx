import { useAccentColor } from '../hooks/use-accent-color';
import { cn } from '../shared/cn';
import { nestedSizeClasses } from '../shared/size-utls';
import { Color } from '../types';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

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
    sm: 'border',
    md: 'border-1',
    lg: 'border-[1.5px]',
    xl: 'border-2',
    '2xl': 'border-2',
  }[size];

  const positionClasses = {
    sm: 'left-0.5 right-0.5',
    md: 'left-0.5 right-0.5',
    lg: 'left-1 right-1',
    xl: 'left-1 right-1',
    '2xl': 'left-1 right-1',
  }[size];

  return (
    <div
      className={cn(
        'cladd-spinner',
        'relative',
        `cladd-color-${color}`,
        sizeClass,
        className,
      )}
    >
      <div className="cladd-spinner-wrap absolute inset-0">
        <div
          className={cn(
            'absolute top-1/2 left-0 aspect-16/10 w-full -translate-y-1/2 rounded-full border-cladd-primary',
            borderWidth,
          )}
        />
        <div
          className={cn(
            'absolute top-1/2 aspect-2/1 -translate-y-1/2 rounded-full',
            positionClasses,
          )}
        >
          <div className="cladd-spinner-knob absolute top-0 left-0 h-full w-1/2 rounded-full bg-cladd-primary" />
        </div>
      </div>
    </div>
  );
}
