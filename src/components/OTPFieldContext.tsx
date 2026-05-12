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

/**
 * Internal state shared by the `OTPField` parent with each `OTPFieldInput` cell. Cells
 * don't own their own state - they read their value/handlers from this context.
 */
interface OTPFieldContextValue {
  /** Size token forwarded from the parent `OTPField`. */
  size: InputSize;
  /** Per-cell `pattern` regex (single character match). Default `'[0-9]'`. */
  pattern: string;
  /** Validity state from the parent - drives the cells' red focus ring when `false`. */
  valid: boolean;
  /** Disabled state from the parent - dims and disables every cell. */
  disabled: boolean;
  /** Read-only state from the parent - blocks editing while keeping cells focusable. */
  readOnly: boolean;
  /** Native `inputMode` for every cell. Default `'numeric'`. */
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
  /** Returns the current character for the cell at `index`. */
  getCellValue: (index: number) => string;
  /** Each cell calls this on mount/unmount so the parent can build a ref list (for focus navigation, paste, etc.). */
  registerInput: (index: number, el: HTMLInputElement | null) => void;
  /** Fires when a cell's value changes - parent updates the combined OTP value and advances focus. */
  onCellChange: (
    index: number,
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  /** Handles Backspace/Arrow navigation between cells. */
  onCellKeyDown: (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => void;
  /** Selects the cell's content on focus so typing replaces the existing digit. */
  onCellFocus: (index: number, event: FocusEvent<HTMLInputElement>) => void;
  /** Distributes a pasted string across the remaining cells, starting at `index`. */
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
  /** State values to publish to descendant `OTPFieldInput` cells. */
  value: OTPFieldContextValue;
  /** Subtree that should read these values. */
  children: ReactNode;
}

export function OTPFieldContextProvider(props: OTPFieldContextProviderProps) {
  return (
    <OTPFieldContext.Provider value={props.value}>
      {props.children}
    </OTPFieldContext.Provider>
  );
}
