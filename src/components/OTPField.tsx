import {
  Children,
  ChangeEvent,
  ClipboardEvent,
  ComponentPropsWithoutRef,
  FocusEvent,
  KeyboardEvent,
  ReactNode,
  Ref,
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { cn } from '../shared/cn';
import { roundedClasses } from '../shared/rounded-classes';
import { FocusableLayer } from './FocusableLayer';
import { InputSize } from './Input';
import { OTPFieldContextProvider } from './OTPFieldContext';
import { OTPFieldInput } from './OTPFieldInput';

interface OTPFieldOwnProps {
  /** OTP cells - one or more `OTPFieldInput`, with optional `OTPFieldSeparator` between. */
  children?: ReactNode;
  /** Extra classes for the field container. */
  className?: string;
  /** Forwarded to the field container. */
  ref?: Ref<HTMLDivElement>;
  /** Controlled value. The character at index `i` populates cell `i`. */
  value?: string;
  /** Fires whenever the OTP value changes (typing, backspace, paste, clear). */
  onChange?: (value: string) => void;
  /**
   * Maximum number of characters / cells. When omitted, inferred from the count of `OTPFieldInput` children.
   */
  maxLength?: number;
  /** Cell size. Default `'lg'`. */
  size?: InputSize;
  /**
   * Regex source that matches a single allowed character. Default `'[0-9]'`.
   *
   * Applied as a filter for typed and pasted input.
   */
  pattern?: string;
  /**
   * Validity state. Default `true`. When `false`, the entire field renders a single red focus ring around all cells.
   */
  valid?: boolean;
  /** Visually dim the field and disable interaction with all cells. */
  disabled?: boolean;
  /** Make every cell non-editable but still focusable. */
  readOnly?: boolean;
  /** Forwarded to each underlying `<input>`. Default `'numeric'` (matches the digits-only default pattern). */
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
}

export type OTPFieldProps = OTPFieldOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof OTPFieldOwnProps>;

const isOTPInputElement = (
  child: ReactNode,
): child is React.ReactElement<{ index?: number }> =>
  isValidElement(child) &&
  (child.type as unknown as { __OTPFieldInput?: boolean })?.__OTPFieldInput ===
    true;

export const OTPField = (props: OTPFieldProps) => {
  const {
    children,
    className,
    ref,
    value = '',
    onChange = () => {},
    maxLength,
    size = 'lg',
    pattern = '[0-9]',
    valid = true,
    disabled = false,
    readOnly = false,
    inputMode = 'numeric',
    ...rest
  } = props;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Stable refs to the latest props - keeps every callback below stable so the
  // context value stays referentially equal across renders.
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const maxLengthPropRef = useRef<number | undefined>(maxLength);
  maxLengthPropRef.current = maxLength;
  const totalCellsRef = useRef(0);

  const charRegex = useMemo(() => {
    try {
      return new RegExp(`^(?:${pattern})$`);
    } catch {
      return null;
    }
  }, [pattern]);

  const charRegexRef = useRef(charRegex);
  charRegexRef.current = charRegex;

  const isAllowed = useCallback((ch: string) => {
    const re = charRegexRef.current;
    if (!re) return true;
    return re.test(ch);
  }, []);

  const childInputCount = useMemo(() => {
    let count = 0;
    Children.forEach(children, (child) => {
      if (isOTPInputElement(child)) count++;
    });
    return count;
  }, [children]);

  const totalCells = maxLength ?? childInputCount;
  totalCellsRef.current = totalCells;

  const indexedChildren = useMemo(() => {
    if (childInputCount === 0 && totalCells > 0) {
      return Array.from({ length: totalCells }).map((_, i) => (
        <OTPFieldInput key={i} index={i} />
      ));
    }
    let inputIndex = 0;
    return Children.map(children, (child) => {
      if (isOTPInputElement(child)) {
        const idx = inputIndex++;
        return cloneElement(child, { index: idx });
      }
      return child;
    });
    // `value` is intentionally in deps: when no children are supplied we
    // auto-generate `OTPFieldInput`s whose element identity would otherwise be
    // stable across value changes, leaving cells stuck reading a stale value.
  }, [children, childInputCount, totalCells, value]);

  const focusCell = useCallback((i: number) => {
    const el = inputRefs.current[i];
    if (!el) return;
    if (document.activeElement !== el) el.focus();
    try {
      const len = el.value.length;
      el.setSelectionRange(len, len);
    } catch {
      /* noop */
    }
  }, []);

  const setCharAt = useCallback(
    (str: string, i: number, ch: string): string => {
      const total = totalCellsRef.current;
      if (ch === '') {
        if (i >= str.length) return str;
        return str.slice(0, i) + str.slice(i + 1);
      }
      if (i > str.length) return str;
      if (i === str.length) return (str + ch).slice(0, total);
      return (str.slice(0, i) + ch + str.slice(i + 1)).slice(0, total);
    },
    [],
  );

  const handleCellChange = useCallback(
    (index: number, raw: string, _event: ChangeEvent<HTMLInputElement>) => {
      const cur = valueRef.current;
      if (raw === '') {
        const next = setCharAt(cur, index, '');
        if (next !== cur) onChangeRef.current(next);
        return;
      }
      const ch = raw.slice(-1);
      if (!isAllowed(ch)) return;
      const next = setCharAt(cur, index, ch);
      if (next !== cur) onChangeRef.current(next);
      if (index < totalCellsRef.current - 1) focusCell(index + 1);
    },
    [setCharAt, isAllowed, focusCell],
  );

  const handleCellKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        const cur = valueRef.current;
        const ch = cur[index] ?? '';
        if (ch) {
          e.preventDefault();
          onChangeRef.current(setCharAt(cur, index, ''));
          return;
        }
        if (index > 0) {
          e.preventDefault();
          onChangeRef.current(setCharAt(cur, index - 1, ''));
          focusCell(index - 1);
        }
        return;
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        focusCell(index - 1);
        return;
      }
      if (e.key === 'ArrowRight' && index < totalCellsRef.current - 1) {
        e.preventDefault();
        focusCell(index + 1);
      }
    },
    [setCharAt, focusCell],
  );

  const handleCellFocus = useCallback(
    (_index: number, e: FocusEvent<HTMLInputElement>) => {
      const el = e.currentTarget;
      // Select existing content so the next typed char overwrites it.
      // Direct call is safe - setSelectionRange does not refire focus events.
      if (el.value.length === 0) return;
      try {
        el.setSelectionRange(0, el.value.length);
      } catch {
        /* noop */
      }
    },
    [],
  );

  const handleCellPaste = useCallback(
    (index: number, e: ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData('text');
      if (!text) return;
      e.preventDefault();
      const filtered = Array.from(text).filter(isAllowed).join('');
      if (!filtered) return;

      const cur = valueRef.current;
      const total = totalCellsRef.current;
      const startAt = Math.min(index, cur.length);
      let next = cur.slice(0, startAt);
      for (const ch of filtered) {
        if (next.length >= total) break;
        next += ch;
      }
      if (next !== cur) onChangeRef.current(next);
      focusCell(Math.min(next.length, total - 1));
    },
    [isAllowed, focusCell],
  );

  const registerInput = useCallback(
    (index: number, el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    [],
  );

  const getCellValue = useCallback(
    (index: number) => valueRef.current[index] ?? '',
    [],
  );

  const { focusRoundedClasses } = roundedClasses(size);

  const contextValue = useMemo(
    () => ({
      size,
      pattern,
      valid,
      disabled,
      readOnly,
      inputMode,
      getCellValue,
      registerInput,
      onCellChange: handleCellChange,
      onCellKeyDown: handleCellKeyDown,
      onCellFocus: handleCellFocus,
      onCellPaste: handleCellPaste,
    }),
    [
      size,
      pattern,
      valid,
      disabled,
      readOnly,
      inputMode,
      getCellValue,
      registerInput,
      handleCellChange,
      handleCellKeyDown,
      handleCellFocus,
      handleCellPaste,
    ],
  );

  return (
    <OTPFieldContextProvider value={contextValue}>
      <div
        ref={ref}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={valid === false || undefined}
        className={cn(
          'cladd-otp-field relative flex items-center gap-1',
          className,
        )}
        {...rest}
      >
        {!readOnly && !disabled && !valid && (
          <FocusableLayer
            className={cn(focusRoundedClasses)}
            force
            color="red"
          />
        )}
        {indexedChildren}
      </div>
    </OTPFieldContextProvider>
  );
};
