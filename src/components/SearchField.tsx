import { ChangeEvent } from 'react';

import { cn } from '../shared/cn';
import { SearchIcon } from './icons/SearchIcon';
import { Input, InputProps } from './Input';

interface SearchFieldOwnProps {
  /** Fires on every keystroke. Also fires with `''` when the clear button is pressed. */
  onChange?: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
}

export type SearchFieldProps = SearchFieldOwnProps &
  Omit<InputProps, keyof SearchFieldOwnProps>;

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
    ...rest
  } = props;

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
      onClear={onClear ?? (() => onChange(''))}
      className={cn('cladd-search-field w-full', className)}
    />
  );
};
