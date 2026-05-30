import { ReactNode, Ref, useRef, useState } from 'react';
import type { DateRange, PropsBase } from 'react-day-picker';

import { Button, buttonIconSizes, ButtonSize } from '../components/Button';
import { DropdownIcon } from '../components/icons/DropdownIcon';
import { Popover, PopoverOffset, PopoverPosition } from '../components/Popover';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { Calendar, CalendarSize } from './Calendar';
import { CalendarIcon } from './CalendarIcon';

export type DatePickerSize = ButtonSize;

interface DatePickerBaseProps {
  /** Trigger button size. Forwarded to `Button.size`. Default `'md'`. */
  size?: ButtonSize;
  /** Calendar size inside the popover. Default `'lg'`. */
  calendarSize?: CalendarSize;
  /** Accent color token. Drives the trigger and the calendar. Default: theme accent. */
  color?: Color;
  /** Show the chevron indicator on the right of the trigger. Default `true`. */
  dropdownIcon?: boolean;
  /** Shown in the trigger when nothing is selected. Default `'Select date'`. */
  placeholder?: ReactNode;
  /** Dim the trigger and block opening. */
  disabled?: boolean;
  /** Show the value but block opening the popover. */
  readOnly?: boolean;
  /** Pill-style trigger. Forwarded to `Button.rounded`. */
  rounded?: boolean;
  /** Trigger surface outline ring. Forwarded to `Button.outline`. */
  outline?: boolean;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Extra classes for the trigger's inner content row. */
  contentClassName?: string;
  /** Icon node in the trigger. Defaults to a calendar glyph; pass `null` to hide. */
  icon?: ReactNode;
  /** Extra props forwarded to the underlying `Calendar` (e.g. `numberOfMonths`, `disabled`, `startMonth`, `endMonth`). */
  calendarProps?: Omit<Partial<PropsBase>, 'mode' | 'required'> & {
    size?: CalendarSize;
    controlSize?: ButtonSize;
    color?: Color;
  };
  /** Popover anchor side + alignment. Default `'bottom-end'`. */
  popoverPosition?: PopoverPosition;
  /** Popover spacing from the trigger. Default `['-50%', 4]`. */
  popoverOffset?: PopoverOffset;
  /** Extra classes for the popover surface. Default `'w-auto'`. */
  popoverClassName?: string;
  /** Accent color for the popover. Defaults to `color`. */
  popoverColor?: Color;
  /** Surface level for the popover. */
  popoverSurfaceLevel?: number | string;
  /** Controlled popover open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Fires whenever the popover open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Forwarded to the trigger button's root element. */
  ref?: Ref<HTMLElement>;
}

type SingleDatePickerProps = DatePickerBaseProps & {
  /** Selection mode. Default `'single'`. */
  mode?: 'single';
  /** Selected date. */
  value?: Date;
  /** Fires when the selected date changes. */
  onChange?: (value: Date | undefined) => void;
  /** Format the selected date into the trigger label. Default `toLocaleDateString`. */
  format?: (value: Date) => ReactNode;
  /** Close the popover after a pick. Default `true`. */
  closeOnSelect?: boolean;
};

type MultipleDatePickerProps = DatePickerBaseProps & {
  mode: 'multiple';
  /** Selected dates. */
  value?: Date[];
  /** Fires when the selected dates change. */
  onChange?: (value: Date[]) => void;
  /** Format the selected dates into the trigger label. */
  format?: (value: Date[]) => ReactNode;
};

type RangeDatePickerProps = DatePickerBaseProps & {
  mode: 'range';
  /** Selected range. */
  value?: DateRange;
  /** Fires when the selected range changes. */
  onChange?: (value: DateRange | undefined) => void;
  /** Format the selected range into the trigger label. */
  format?: (value: DateRange) => ReactNode;
};

export type DatePickerProps =
  | SingleDatePickerProps
  | MultipleDatePickerProps
  | RangeDatePickerProps;

const formatDate = (d: Date) => d.toLocaleDateString();

export function DatePicker(props: DatePickerProps) {
  const {
    size = 'md',
    calendarSize = 'lg',
    color,
    placeholder = 'Select date',
    disabled,
    readOnly,
    rounded,
    outline,
    className,
    contentClassName,
    icon = <CalendarIcon />,
    dropdownIcon = true,
    calendarProps,
    popoverPosition = 'bottom-end',
    popoverOffset = ['-50%', 4],
    popoverClassName = 'w-auto',
    popoverColor,
    popoverSurfaceLevel,
    open: openProp,
    onOpenChange,
    ref,
  } = props;

  const triggerRef = useRef<HTMLElement | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const setTriggerRef = (el: HTMLElement | null) => {
    triggerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.RefObject<HTMLElement | null>).current = el;
  };

  let label: ReactNode = placeholder;
  let hasValue = false;
  if (props.mode === 'multiple') {
    const v = props.value;
    if (v && v.length > 0) {
      hasValue = true;
      label = props.format ? props.format(v) : v.map(formatDate).join(', ');
    }
  } else if (props.mode === 'range') {
    const v = props.value;
    if (v?.from) {
      hasValue = true;
      label = props.format
        ? props.format(v)
        : v.to
          ? `${formatDate(v.from)} – ${formatDate(v.to)}`
          : formatDate(v.from);
    }
  } else {
    const v = props.value;
    if (v) {
      hasValue = true;
      label = props.format ? props.format(v) : formatDate(v);
    }
  }

  const shared = {
    size: calendarSize,
    ...calendarProps,
    color: calendarProps?.color ?? color,
  };

  let calendar: ReactNode;
  if (props.mode === 'multiple') {
    const onChange = props.onChange;
    calendar = (
      <Calendar
        {...shared}
        mode="multiple"
        selected={props.value}
        onSelect={(v) => onChange?.(v ?? [])}
      />
    );
  } else if (props.mode === 'range') {
    const onChange = props.onChange;
    calendar = (
      <Calendar
        {...shared}
        mode="range"
        selected={props.value}
        onSelect={(v) => onChange?.(v)}
      />
    );
  } else {
    const { onChange, closeOnSelect } = props;
    calendar = (
      <Calendar
        {...shared}
        mode="single"
        selected={props.value}
        onSelect={(v) => {
          onChange?.(v);
          if (closeOnSelect !== false) setOpen(false);
        }}
      />
    );
  }

  return (
    <>
      <Button
        data-part="trigger"
        ref={setTriggerRef}
        className={cn('cladd-date-picker w-full', className)}
        size={size}
        rounded={rounded}
        outline={outline}
        color={color}
        disabled={disabled}
        readOnly={readOnly}
        role="combobox"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        onClick={() => setOpen(!open)}
        contentClassName={cn(
          'flex w-full min-w-0 items-center gap-2',
          dropdownIcon && 'pr-1.5',
          contentClassName,
        )}
      >
        {icon && (
          <div
            data-part="icon"
            className={cn('shrink-0 text-cladd-fg-soft', buttonIconSizes[size])}
          >
            {icon}
          </div>
        )}
        <div
          data-part="value"
          className={cn(
            'w-full min-w-0 shrink truncate text-left',
            !hasValue && 'text-cladd-fg-softer',
          )}
        >
          {label}
        </div>
        {dropdownIcon && (
          <DropdownIcon
            data-part="dropdown-icon"
            className="size-4 shrink-0 text-cladd-fg-softer"
          />
        )}
      </Button>

      {!readOnly && !disabled && (
        <Popover
          open={open}
          onOpenChange={setOpen}
          anchorRef={triggerRef}
          position={popoverPosition}
          offset={popoverOffset}
          className={popoverClassName}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          color={popoverColor ?? color}
          surfaceLevel={popoverSurfaceLevel}
        >
          <div className="p-2">{calendar}</div>
        </Popover>
      )}
    </>
  );
}
