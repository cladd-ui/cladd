import { Ref, ChangeEvent } from 'react';

import { cn } from '../shared/cn';
import { SearchIcon } from './icons/SearchIcon';
import { Input, InputSize } from './Input';
import { Surface, SurfaceProps } from './Surface';

interface SearchFieldOwnProps {
  /** Controlled query string. Default `''`. */
  value?: string;
  /**
   * Layout mode:
   * - `false` (default) - a sticky header bar that sits flush at the top of a list
   *   (uses `surface level "+1"`, top-rounded corners, outlined).
   * - `true` - a floating pill **inset** within the parent surface (uses `surface level "+0"`,
   *   `rounded-full`, no outline, inset margins). Use inside a list/popover where the
   *   search field should look like one item among many.
   */
  inset?: boolean;
  size?: InputSize;
  /** Default `'Search'`. */
  placeholder?: string;
  /** Extra classes for the search field `Surface`. */
  className?: string;
  /** Fires on every keystroke. Also fires with `''` when the clear button is pressed. */
  onChange?: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
  /** Forwarded to the search field `Surface` root. */
  ref?: Ref<HTMLElement>;
}

export type SearchFieldProps = SearchFieldOwnProps &
  Omit<SurfaceProps, keyof SearchFieldOwnProps>;

export const SearchField = (props: SearchFieldProps) => {
  const {
    value = '',
    inset = false,
    size = 'md',
    placeholder = 'Search',
    className = '',
    onChange = () => {},
    ref,
    ...rest
  } = props;

  return (
    <Surface
      level={inset ? '+0' : '+1'}
      className={cn(
        'cladd-search-field sticky z-20',
        !inset && 'top-0 ml-px rounded-t-3xl',
        inset && 'top-2 mx-2 w-auto rounded-full',
        className,
      )}
      outline={!inset}
      ref={ref}
      {...rest}
    >
      <div className={cn('flex items-center', !inset && 'p-1.5')}>
        <Input
          className="w-full"
          placeholder={placeholder}
          onChange={(v: string, e: ChangeEvent<HTMLInputElement>) =>
            onChange(v, e)
          }
          contentClassName="pl-6.5"
          value={value}
          clearButton
          rounded
          onClear={() => onChange('')}
        />
        <SearchIcon
          className={cn(
            'pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-cladd-fg-softer',
            inset ? 'left-2' : 'left-4',
          )}
        />
      </div>
    </Surface>
  );
};
