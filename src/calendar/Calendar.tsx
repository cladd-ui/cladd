import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  DayPicker,
  type ChevronProps,
  type ClassNames,
  type DayButtonProps,
  type DayPickerProps,
  type DropdownNavProps,
  type DropdownProps,
  type ModifiersClassNames,
  type NavProps,
  type NextMonthButtonProps,
  type PreviousMonthButtonProps,
  type RootProps,
} from 'react-day-picker';

import { Button, ButtonSize } from '../components/Button';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { Select } from '../components/Select';
import { Toolbar } from '../components/Toolbar';
import { ToolbarButton } from '../components/ToolbarButton';
import { cn } from '../shared/cn';
import { Color } from '../types';

export type CalendarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type SizeTokens = {
  box: string;
  col: string;
  dayText: string;
  weekdayText: string;
  captionText: string;
};

const SIZES: Record<CalendarSize, SizeTokens> = {
  sm: {
    box: 'size-cladd-sm',
    col: 'w-cladd-sm',
    dayText: 'text-cladd-2xs',
    weekdayText: 'text-cladd-2xs',
    captionText: 'text-cladd-xs',
  },
  md: {
    box: 'size-cladd-md',
    col: 'w-cladd-md',
    dayText: 'text-cladd-xs',
    weekdayText: 'text-cladd-2xs',
    captionText: 'text-cladd-xs',
  },
  lg: {
    box: 'size-cladd-lg',
    col: 'w-cladd-lg',
    dayText: 'text-cladd-xs',
    weekdayText: 'text-cladd-xs',
    captionText: 'text-cladd-xs',
  },
  xl: {
    box: 'size-cladd-xl',
    col: 'w-cladd-xl',
    dayText: 'text-cladd-sm',
    weekdayText: 'text-cladd-xs',
    captionText: 'text-cladd-sm',
  },
  '2xl': {
    box: 'size-cladd-2xl',
    col: 'w-cladd-2xl',
    dayText: 'text-cladd-sm',
    weekdayText: 'text-cladd-xs',
    captionText: 'text-cladd-sm',
  },
};

export type CalendarProps = DayPickerProps & {
  /** Sizing token. Drives day-cell size and font sizes. Default `'md'`. */
  size?: CalendarSize;
  /** Size of the nav buttons and caption dropdowns. Default `'sm'`. */
  controlSize?: ButtonSize;
  /** Accent color token. Sets the `cladd-color-{name}` class - drives selected fill, today, and focus ring. Default: theme accent. */
  color?: Color;
  /** Mark today's date with an accent ring and label. Default `true`. */
  showToday?: boolean;
  /** Custom content rendered above the calendar grid, inside the calendar container (mirrors `footer`). */
  header?: ReactNode;
  /** Extra classes for the `header` wrapper. */
  headerClassName?: string;
  /** Extra classes for the `footer` element. */
  footerClassName?: string;
};

const CHEVRON_ROTATION: Record<
  NonNullable<ChevronProps['orientation']>,
  string
> = {
  left: 'rotate-0',
  right: 'rotate-180',
  up: 'rotate-90',
  down: '-rotate-90',
};

const Chevron = ({ orientation = 'left', className }: ChevronProps) => {
  return (
    <ChevronLeftIcon className={cn(className, CHEVRON_ROTATION[orientation])} />
  );
};

type CalendarContextValue = {
  size: CalendarSize;
  controlSize: ButtonSize;
  hasNavigation: boolean;
  navLayout?: 'around' | 'after';
  color: Color;
  showToday: boolean;
  header?: ReactNode;
  headerClassName?: string;
};

const CalendarContext = createContext<CalendarContextValue>({
  size: 'lg',
  controlSize: 'sm',
  hasNavigation: true,
  navLayout: 'after',
  color: 'brand',
  showToday: true,
});

const PreviousMonthButton = ({
  className,
  onClick,
}: PreviousMonthButtonProps) => {
  const { controlSize } = useContext(CalendarContext);
  return (
    <Toolbar size={controlSize} className={className}>
      <ToolbarButton square onClick={onClick}>
        <ChevronLeftIcon />
      </ToolbarButton>
    </Toolbar>
  );
};
const NextMonthButton = ({ className, onClick }: NextMonthButtonProps) => {
  const { controlSize } = useContext(CalendarContext);
  return (
    <Toolbar size={controlSize} className={className}>
      <ToolbarButton square onClick={onClick}>
        <ChevronLeftIcon className="rotate-180" />
      </ToolbarButton>
    </Toolbar>
  );
};
const Nav = ({
  className,
  onPreviousClick,
  onNextClick,
  previousMonth,
  nextMonth,
  ...rest
}: NavProps) => {
  const { controlSize } = useContext(CalendarContext);
  return (
    <Toolbar
      as="nav"
      size={controlSize}
      className={cn('cladd-calendar-nav', className)}
      {...rest}
    >
      <ToolbarButton
        type="button"
        square
        aria-label="Go to previous month"
        disabled={!previousMonth}
        onClick={onPreviousClick}
      >
        <ChevronLeftIcon />
      </ToolbarButton>
      <ToolbarButton
        type="button"
        square
        aria-label="Go to next month"
        disabled={!nextMonth}
        onClick={onNextClick}
      >
        <ChevronLeftIcon className="rotate-180" />
      </ToolbarButton>
    </Toolbar>
  );
};

const DropdownNav = ({ className, children, ...rest }: DropdownNavProps) => {
  const { controlSize, hasNavigation } = useContext(CalendarContext);
  return (
    <Toolbar
      size={controlSize}
      className={cn(hasNavigation && 'max-w-[calc(100%-3.5rem)]', className)}
      contentClassName={cn(
        hasNavigation && 'w-full',
        '[&>span]:px-1.5 [&>span]:text-cladd-xs [&>span]:font-medium',
      )}
      {...rest}
    >
      {children}
    </Toolbar>
  );
};

const Dropdown = ({
  options = [],
  value,
  onChange,
  'aria-label': ariaLabel,
}: DropdownProps) => {
  const { controlSize, hasNavigation } = useContext(CalendarContext);
  const labelFor = (v: number | undefined) =>
    options.find((o) => o.value === v)?.label ?? '';
  const searchable = options.length > 20;

  return (
    <Select<number>
      size={controlSize}
      className={cn(hasNavigation && 'w-auto min-w-0 shrink')}
      rounded
      variant="transparent"
      outline={false}
      aria-label={ariaLabel}
      value={value as number}
      options={options.map((o) => o.value)}
      isOptionDisabled={(v) => !!options.find((o) => o.value === v)?.disabled}
      renderOption={({ value: v }) => labelFor(v)}
      keyboardHints={false}
      search={searchable}
      searchFocus={searchable}
      onSearch={(query) =>
        options
          .filter((o) =>
            o.label.toLowerCase().includes(query.trim().toLowerCase()),
          )
          .map((o) => o.value)
      }
      onChange={(v) =>
        onChange?.({
          target: { value: String(v) },
        } as unknown as React.ChangeEvent<HTMLSelectElement>)
      }
      popoverClassName="max-h-72 w-40"
      contentClassName={cn(hasNavigation && '', 'gap-0.5 pr-0.5 pl-1.5')}
      valueClassName={cn(hasNavigation && 'truncate')}
      scrollToSelected
    >
      {labelFor(value as number)}
    </Select>
  );
};

const DayButton = ({
  day: _day,
  modifiers,
  className,
  ...rest
}: DayButtonProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const { size, color, showToday } = useContext(CalendarContext);
  const inRangeMiddle = !!modifiers.range_middle;
  const isFilled = !!modifiers.selected && !inRangeMiddle;
  const isToday = showToday && !!modifiers.today;
  const roundedEnd =
    modifiers.range_start && !modifiers.range_end
      ? 'rounded-r-none'
      : modifiers.range_end && !modifiers.range_start
        ? 'rounded-l-none'
        : '';

  return (
    <Button
      {...rest}
      ref={ref}
      color={isFilled || isToday ? color : undefined}
      square
      rounded
      size={size}
      outline={false}
      variant={isFilled ? 'gradient-fill' : 'transparent'}
      disabled={!!modifiers.disabled}
      className={cn(
        'font-medium',
        SIZES[size].dayText,
        isFilled && cn('font-semibold', roundedEnd),
        isToday &&
          !isFilled &&
          cn(
            'font-semibold ring-1 ring-inset',
            modifiers.outside
              ? 'ring-current'
              : 'text-cladd-primary ring-cladd-primary/60',
          ),
        modifiers.outside && !modifiers.selected && 'text-cladd-fg-softer',
        modifiers.disabled && 'text-cladd-fg-softest',
        className,
      )}
    />
  );
};

const Root = ({ rootRef, children, ...rest }: RootProps) => {
  const { header, headerClassName } = useContext(CalendarContext);
  return (
    <div ref={rootRef} {...rest}>
      {header && (
        <div className={cn('cladd-calendar-header mb-2', headerClassName)}>
          {header}
        </div>
      )}
      {children}
    </div>
  );
};

export const Calendar = (props: CalendarProps) => {
  const {
    size = 'lg',
    controlSize = 'sm',
    navLayout = 'after',
    hideNavigation,
    disableNavigation,
    color = 'brand',
    showToday = true,
    header,
    headerClassName,
    footerClassName,
    className,
    classNames,
    components,
    modifiersClassNames,
    showOutsideDays = true,
    ...rest
  } = props;

  const hasNavigation = !hideNavigation;

  const t = SIZES[size];

  const baseClassNames: Partial<ClassNames> = {
    footer: cn('mt-2 text-cladd-xs text-cladd-fg-soft', footerClassName),
    months: 'relative flex gap-4',
    month: 'flex flex-col gap-4',

    month_caption: cn(
      'flex min-h-8 items-center',
      navLayout === 'after' && 'pr-1',
      hasNavigation && navLayout === 'around' && 'justify-center',
    ),
    caption_label: cn(
      'font-semibold text-cladd-fg',
      (navLayout === 'after' || !hasNavigation) && 'pl-2',
      t.captionText,
    ),
    button_previous: 'absolute z-10 left-0 top-0',
    button_next: 'absolute z-10 right-0 top-0',
    nav: 'absolute top-0 right-0 z-10',

    chevron: 'size-4',
    month_grid: 'border-collapse',
    weekdays: 'flex',
    weekday: cn(
      'flex items-center justify-center pb-1 font-normal text-cladd-fg-soft',
      t.col,
      t.weekdayText,
    ),
    week: 'mt-0.5 flex',
    day: cn('relative flex items-center justify-center p-0', t.box),
    hidden: 'invisible',
  };

  const baseModifierClassNames: ModifiersClassNames = {
    range_middle: cn('bg-cladd-primary/10', color && `cladd-color-${color}`),
  };

  return (
    <CalendarContext.Provider
      value={{
        size,
        controlSize,
        hasNavigation,
        navLayout,
        color,
        showToday,
        header,
        headerClassName,
      }}
    >
      <DayPicker
        navLayout={navLayout}
        hideNavigation={hideNavigation}
        disableNavigation={disableNavigation}
        showOutsideDays={showOutsideDays}
        className={cn('cladd-calendar', className)}
        classNames={{ ...baseClassNames, ...classNames }}
        modifiersClassNames={{
          ...baseModifierClassNames,
          ...modifiersClassNames,
        }}
        components={{
          Root,
          Chevron,
          DayButton,
          PreviousMonthButton,
          NextMonthButton,
          Nav,
          Dropdown,
          DropdownNav,
          ...components,
        }}
        {...(rest as DayPickerProps)}
      />
    </CalendarContext.Provider>
  );
};
