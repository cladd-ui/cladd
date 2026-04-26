import {
  createContext,
  useContext,
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  KeyboardEvent,
  ReactNode,
} from 'react';

import { InputSize } from './Input';

interface OTPFieldContextValue {
  size: InputSize;
  pattern: string;
  valid: boolean;
  disabled: boolean;
  readOnly: boolean;
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
  getCellValue: (index: number) => string;
  registerInput: (index: number, el: HTMLInputElement | null) => void;
  onCellChange: (
    index: number,
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onCellKeyDown: (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => void;
  onCellFocus: (index: number, event: FocusEvent<HTMLInputElement>) => void;
  onCellPaste: (index: number, event: ClipboardEvent<HTMLInputElement>) => void;
}

const noop = () => {};

export const OTPFieldContext = createContext<OTPFieldContextValue>({
  size: 'lg',
  pattern: '[0-9]',
  valid: true,
  disabled: false,
  readOnly: false,
  inputMode: 'numeric',
  getCellValue: () => '',
  registerInput: noop,
  onCellChange: noop,
  onCellKeyDown: noop,
  onCellFocus: noop,
  onCellPaste: noop,
});

export function useOTPFieldContext(): OTPFieldContextValue {
  return useContext(OTPFieldContext);
}

interface OTPFieldContextProviderProps {
  value: OTPFieldContextValue;
  children: ReactNode;
}

export function OTPFieldContextProvider(props: OTPFieldContextProviderProps) {
  return (
    <OTPFieldContext.Provider value={props.value}>
      {props.children}
    </OTPFieldContext.Provider>
  );
}
