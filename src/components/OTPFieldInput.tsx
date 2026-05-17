import { ClipboardEvent, Ref } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { rootSizeClasses } from '../shared/size-utls';
import { Input } from './Input';
import { useOTPFieldContext } from './OTPFieldContext';

interface OTPFieldInputOwnProps {
  /** Input placeholder. */
  placeholder?: string;
  /** Extra classes for the cell wrapper. */
  className?: string;
  /** Extra classes for the underlying `<input>` element. */
  inputClassName?: string;
  /** Forwarded to the cell wrapper element. */
  ref?: Ref<HTMLElement>;
  /** Internal: cell index injected by parent `OTPField` via `cloneElement`. */
  index?: number;
}

export type OTPFieldInputProps = OTPFieldInputOwnProps;

/** Shape of `OTPFieldInput` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type OTPFieldInputDefaultProps = Partial<
  Omit<OTPFieldInputOwnProps, 'ref' | 'index'>
>;

export const OTPFieldInput = (props: OTPFieldInputProps) => {
  const {
    placeholder,
    className,
    inputClassName,
    ref,
    index = 0,
  } = useComponentDefaults('OTPFieldInput', props);
  const {
    size,
    pattern,
    disabled,
    readOnly,
    inputMode,
    getCellValue,
    registerInput,
    onCellChange,
    onCellKeyDown,
    onCellFocus,
    onCellPaste,
  } = useOTPFieldContext();

  return (
    <Input
      ref={ref}
      size={size}
      pattern={pattern}
      inputMode={inputMode}
      disabled={disabled}
      readOnly={readOnly}
      maxLength={1}
      value={getCellValue(index)}
      className={cn(
        'cladd-otp-field-input',
        rootSizeClasses(size, 'width'),
        className,
      )}
      inputClassName={cn('px-0 text-center', inputClassName)}
      inputRef={(el) => registerInput(index, el)}
      onChange={(value, event) => onCellChange(index, value, event)}
      onKeyDown={(event) => onCellKeyDown(index, event)}
      onFocus={(event) => onCellFocus(index, event)}
      placeholder={placeholder}
      inputComponentProps={{
        autoComplete: index === 0 ? 'one-time-code' : 'off',
        onPaste: (event: ClipboardEvent<HTMLInputElement>) =>
          onCellPaste(index, event),
      }}
    />
  );
};

(OTPFieldInput as unknown as { __OTPFieldInput: boolean }).__OTPFieldInput =
  true;
