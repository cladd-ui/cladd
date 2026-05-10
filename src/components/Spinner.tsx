import { useAccentColor } from '../hooks/use-accent-color';
import { cn } from '../shared/cn';
import { nestedSizeClasses } from '../shared/size-utls';
import { Color } from '../types';

export type SpinnerSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface SpinnerProps {
  /** Spinner dimension. Default `'sm'`. */
  size?: SpinnerSize;
  /** Accent color for the spinning ring. Default: theme accent. */
  color?: Color;
  /** Extra classes for the spinner root element. */
  className?: string;
}

export function Spinner(props: SpinnerProps) {
  const accentColor = useAccentColor();
  const { size = 'sm', color = accentColor, className } = props;
  const sizeClass = nestedSizeClasses(size, 'size');

  return (
    <span
      className={cn(
        'cladd-spinner cladd-spinner relative',
        `cladd-color-${color}`,
        sizeClass,
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={cn('h-full w-full animate-cladd-spinner text-cladd-primary')}
      >
        <path d="M9.045 2.078q-1.04.135-1.609.33a7.982 7.982 0 1 0 10.236 9.9q.15-.49.256-1.356c.069-.568.55-.997 1.122-.997h.008c.56 0 .995.486.937 1.041q-.113 1.068-.279 1.663c-1.18 4.233-5.064 7.338-9.674 7.338C4.496 19.997 0 15.501 0 9.955 0 5.382 3.058 1.522 7.24.31Q7.868.13 9 .006a.94.94 0 0 1 1.042.933v.008c0 .574-.428 1.058-.997 1.131" />
      </svg>
    </span>
  );
}
