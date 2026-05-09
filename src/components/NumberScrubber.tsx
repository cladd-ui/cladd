import {
  useRef,
  ReactNode,
  Ref,
  ComponentPropsWithoutRef,
  useState,
  useEffect,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';

import { cn } from '../shared/cn';
import { Color } from '../types';
import { Button } from './Button';
import { DropdownIcon } from './icons/DropdownIcon';
import { Input, InputSize } from './Input';
import { SurfaceVariant } from './Surface';

export type NumberScrubberSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface NumberScrubberOwnProps {
  /** Optional content rendered after the formatted value (e.g. badges, suffix nodes). */
  children?: ReactNode;
  /** Extra classes for the trigger root (Button when idle, Input when editing). */
  className?: string;
  /** Extra classes for the inner content row of the trigger. */
  contentClassName?: string;
  /** Visually dim and disable all interactions (drag and edit). */
  disabled?: boolean;
  /** Block drag and edit while keeping the trigger visually enabled. */
  readOnly?: boolean;
  /** When `true`, applies fully rounded corners (`rounded-full`). Default size-specific radii are used when `false`. */
  rounded?: boolean;
  /** Trigger size - drives heights, paddings, font, and the inner Input/Button size. Default `'md'`. */
  size?: NumberScrubberSize;
  /** Underlying `Surface` variant used by the idle Button - see `SurfaceVariant`. Defaults to `'gradient'`. */
  variant?: SurfaceVariant;
  /** Accent color token. Sets `cladd-color-{name}` on the trigger - drives text and ring colors. */
  color?: Color;
  /** Render the surface outline ring on the idle Button. Defaults to `true`. */
  outline?: boolean;
  /** Forwarded to the underlying `Surface` as `level` - see `SurfaceProps.level` for the relative-offset (`"+1"`/`"-1"`) syntax. */
  surfaceLevel?: string | number;
  /** Show the chevron-expand indicator on the left of the trigger. Default `true`. */
  scrubberIcon?: boolean;
  /** Minimum allowed value. Default `0`. */
  min?: number;
  /** Maximum allowed value. Default `1_000_000`. */
  max?: number;
  /** Current value (controlled). Default `0`. */
  value?: number;
  /** Increment used both for the keyboard input and to round drag deltas. Default `1`. */
  step?: number;
  /** Value advanced per pixel of drag. Default `step / 5` (5 pixels per step - finer scrubbing). */
  dragStep?: number;
  /** Value advanced per pixel of drag while `Shift` is held. Default `step` (1 pixel per step - coarser scrubbing). Set lower than `dragStep` to invert the gesture. */
  altDragStep?: number;
  /** Format the displayed value, e.g. `(v) => `${v} px``. Defaults to plain stringification. */
  displayValue?: (value: number) => string;
  /** Fires continuously during drag with the in-progress value (already clamped to `[min, max]`). Useful for live previewing the change without committing it to controlled state. */
  onTemporaryChange?: (value: number) => void;
  /** Fires once a drag ends (or after Enter/blur in edit mode), with the final value (already clamped to `[min, max]`). */
  onChange?: (value: number) => void;
  /** Forwarded to the trigger Button root. */
  ref?: Ref<HTMLElement>;
}

export type NumberScrubberProps = NumberScrubberOwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof NumberScrubberOwnProps>;

const CLICK_SUPPRESS_MS = 200;

export const NumberScrubber = (props: NumberScrubberProps) => {
  const {
    children,
    className = '',
    contentClassName = '',
    disabled = false,
    readOnly = false,
    rounded = false,
    size = 'md',
    color = '',
    outline = true,
    variant = 'gradient',
    surfaceLevel,
    scrubberIcon = true,
    displayValue = (v) => String(v),
    min = 0,
    max = 1000000,
    value = 0,
    step = 1,
    dragStep = step / 5,
    altDragStep = step,
    ref,
    onTemporaryChange,
    onChange,
    ...rest
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  const displayValueElRef = useRef<HTMLSpanElement>(null);
  const inputElRef = useRef<HTMLInputElement>(null);
  const pointerDownAtRef = useRef(0);
  const dragEndedAtRef = useRef(0);

  const enableEditing = () => {
    setInputValue(String(value));
    setIsEditing(true);
  };

  const commitInput = () => {
    setIsEditing(false);
    const parsed = parseFloat(inputValue);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(min, Math.min(max, parsed));
    const rounded = Number((Math.round(clamped / step) * step).toFixed(10));
    if (rounded !== value) onChange?.(rounded);
  };

  const cancelInput = () => {
    setIsEditing(false);
    setInputValue(String(value));
  };

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitInput();
    else if (e.key === 'Escape') cancelInput();
  };

  useEffect(() => {
    if (isEditing) inputElRef.current?.select();
  }, [isEditing]);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (disabled || readOnly || isEditing) return;
    pointerDownAtRef.current = Date.now();

    let isMoved = false;
    let lastValue = value;
    let baseX = e.clientX;
    let baseValue = value;
    let baseShift = e.shiftKey;

    const onMove = (ev: PointerEvent) => {
      if (!isMoved) {
        isMoved = true;
        document.documentElement.classList.add('cursor-ew-resize');
      }
      ev.preventDefault();
      // Re-anchor when shift toggles mid-drag so the precision change isn't a jump.
      if (baseShift !== ev.shiftKey) {
        baseX = ev.clientX;
        baseValue = lastValue;
        baseShift = ev.shiftKey;
      }
      const perPx = ev.shiftKey ? altDragStep : dragStep;
      const next = Math.max(
        min,
        Math.min(max, baseValue + (ev.clientX - baseX) * perPx),
      );
      const rounded = Number((Math.round(next / step) * step).toFixed(10));
      if (rounded === lastValue) return;
      lastValue = rounded;
      onTemporaryChange?.(rounded);
      if (displayValueElRef.current) {
        displayValueElRef.current.textContent = displayValue(rounded);
      }
    };

    const cleanup = () => {
      document.documentElement.classList.remove('cursor-ew-resize');
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onCancel);
    };

    const onUp = () => {
      cleanup();
      if (isMoved) {
        dragEndedAtRef.current = Date.now();
        if (lastValue !== value) onChange?.(lastValue);
      }
    };

    const onCancel = () => {
      cleanup();
      if (displayValueElRef.current) {
        displayValueElRef.current.textContent = displayValue(value);
      }
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onCancel);
  };

  const onClick = () => {
    if (disabled || readOnly) return;
    if (Date.now() - dragEndedAtRef.current < CLICK_SUPPRESS_MS) return;
    enableEditing();
  };

  const onFocus = () => {
    if (disabled || readOnly) return;
    // Pointer-driven focus: let onClick handle it (so a drag doesn't open edit).
    if (Date.now() - pointerDownAtRef.current < CLICK_SUPPRESS_MS) return;
    enableEditing();
  };

  if (isEditing) {
    return (
      <Input
        type="number"
        size={size as InputSize}
        value={inputValue}
        min={min}
        max={max}
        step={step}
        autoFocus
        inputRef={inputElRef}
        onBlur={commitInput}
        onKeyDown={onInputKeyDown}
        onChange={setInputValue}
        disabled={disabled}
        rounded={rounded}
        className={cn('cladd-number-scrubber', className)}
        contentClassName={contentClassName}
        inputClassName="text-center"
      />
    );
  }

  return (
    <Button
      className={cn(
        'cladd-number-scrubber',
        !disabled && !readOnly && 'cursor-ew-resize',
        className,
      )}
      contentClassName={cn(scrubberIcon && 'pl-1.5', contentClassName)}
      color={color}
      disabled={disabled}
      readOnly={readOnly}
      rounded={rounded}
      size={size}
      variant={variant}
      outline={outline}
      surfaceLevel={surfaceLevel}
      ref={ref}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onFocus={onFocus}
      {...rest}
    >
      {scrubberIcon && (
        <DropdownIcon className="shrink-0 rotate-90 text-cladd-fg-softer" />
      )}
      <span ref={displayValueElRef}>{displayValue(value)}</span>
      {children}
    </Button>
  );
};
