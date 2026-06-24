import { ChangeEvent, KeyboardEvent } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { SearchIcon } from './icons/SearchIcon';
import { Input, InputProps } from './Input';

interface SearchFieldOwnProps {
  /** Fires on every keystroke. Also fires with `''` when the clear button is pressed. */
  onChange?: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
}

export type SearchFieldProps = SearchFieldOwnProps &
  Omit<InputProps, keyof SearchFieldOwnProps>;

/** Shape of `SearchField` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type SearchFieldDefaultProps = Partial<
  Omit<
    SearchFieldProps,
    | 'as'
    | 'ref'
    | 'inputRef'
    | 'inputComponent'
    | 'inputComponentProps'
    | 'value'
    | 'onChange'
    | 'onClear'
  >
>;

export const SearchField = (props: SearchFieldProps) => {
  const {
    value = '',
    size = 'lg',
    rounded = true,
    clearButton = true,
    placeholder = 'Search',
    icon,
    className,
    onChange = () => {},
    onClear,
    onKeyDown,
    ...rest
  } = useComponentDefaults('SearchField', props);

  const clear = onClear ?? (() => onChange(''));

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    // Escape clears the field; only swallow it when there's something to clear
    // so an empty field still lets Escape bubble (e.g. to close a Popover).
    if (event.defaultPrevented || event.key !== 'Escape' || !value) return;
    event.preventDefault();
    event.stopPropagation();
    clear();
  };

  return (
    <Input
      {...rest}
      value={value}
      size={size}
      rounded={rounded}
      clearButton={clearButton}
      placeholder={placeholder}
      icon={icon ?? <SearchIcon className="text-cladd-fg-softer" />}
      onChange={onChange}
      onClear={clear}
      onKeyDown={handleKeyDown}
      className={cn('cladd-search-field w-full', className)}
    />
  );
};
