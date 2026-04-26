import { ClipboardEvent, Ref } from 'react';

import { cn } from '../shared/cn';
import { Input, InputSize } from './Input';
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

const widthClasses: Record<InputSize, string> = {
  sm: 'w-6',
  md: 'w-7',
  lg: 'w-8',
  xl: 'w-10',
  '2xl': 'w-12',
};

export const OTPFieldInput = (props: OTPFieldInputProps) => {
  const { placeholder, className, inputClassName, ref, index = 0 } = props;
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
      className={cn(widthClasses[size], className)}
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
