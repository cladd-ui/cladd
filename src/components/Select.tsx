import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  ReactNode,
  Ref,
  MouseEvent,
} from 'react';

import { useDevice } from '../hooks/use-device';
import { cn } from '../shared/cn';
import { Button, buttonIconSizes, ButtonSize } from './Button';
import { Checkbox } from './Checkbox';
import { DropdownIcon } from './icons/DropdownIcon';
import { List } from './List';
import { ListButton } from './ListButton';
import { Popover, PopoverOffset, PopoverPosition } from './Popover';
import { Radio } from './Radio';
import { SearchField } from './SearchField';
import { SectionTitle } from './SectionTitle';

interface SelectOptionRenderParams<T> {
  value: T;
  index: number;
  selected: boolean;
}

import { Color } from '../types';
import { ButtonProps } from './Button';
import { Shortcut, ShortcutSize } from './Shortcut';
import { SurfaceVariant } from './Surface';

interface SelectOwnProps<T = string> {
  /** Selected value (single-select) or array of selected values (when `multiple`). */
  value?: T | T[];
  placeholder?: ReactNode;
  /** Title shown at the top of the popover (above the search bar, if any). */
  title?: string;
  /** All available options. Compared against `value` via `getOptionValue` (default: identity). */
  options?: T[];
  /** Multi-select mode - uses `Checkbox` instead of `Radio` and emits `T[]` to `onChange`. */
  multiple?: boolean;
  /** Visually dim the trigger and prevent the popover from opening. */
  disabled?: boolean;
  /** Show the trigger with the current value but block opening the popover. */
  readOnly?: boolean;

  // STYLING
  /** Accent color for the trigger button. Forwarded to `Button.color`. */
  color?: Color;
  /** Pill-style trigger button. Forwarded to `Button.rounded`. */
  rounded?: boolean;
  /** Trigger button size. Forwarded to `Button.size`. */
  size?: ButtonSize;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Extra classes for the trigger button's inner content row. */
  contentClassName?: string;
  /** Extra classes for the value display inside the trigger button. */
  valueClassName?: string;
  /**
   * Trigger button surface type, forwarded to the underlying `Button.surface`: `'surface'` (default) for a regular button, `'cut'` for an inset/recessed look.
   */
  surface?: 'surface' | 'cut';
  /** Reverse the visual order of `icon` ↔ value inside the trigger button. */
  reverse?: boolean;
  /** Icon node rendered inside the trigger button. */
  icon?: ReactNode;
  /** Show the chevron-down indicator on the right of the trigger. Default `true`. */
  dropdownIcon?: boolean;
  /** Forwarded to the trigger `Button` - allows wrapping the value across multiple lines. */
  multiline?: boolean;
  placeholderClassName?: string;
  /**
   * Custom node rendered inside the trigger button in place of `String(value) || placeholder`.
   *
   * Use to render a richer value display (e.g. with icons or formatting).
   */
  children?: ReactNode;
  /** Slot rendered inside the popover, **above** the option list (after title/search field). */
  beforeOptions?: ReactNode;
  /** Slot rendered inside the popover, **below** the option list. */
  afterOptions?: ReactNode;

  /** Render a search bar at the top of the popover. Pair with `onSearch` to filter options. */
  search?: boolean;
  /** Default `'Search'`. */
  searchPlaceholder?: string;
  /** Empty-state text. Default `'Nothing found'`. */
  searchNotFound?: string;
  /** Auto-focus the search input when the popover opens (skipped on iOS/Android to avoid keyboard popup). */
  searchFocus?: boolean;
  /**
   * Filter callback invoked with the current query - return the filtered list of options.
   *
   * The Select does not maintain any internal filter state; callers control matching.
   */
  onSearch?: (query: string) => T[];

  popoverColor?: Color;
  /** Default `'bottom-end'`. */
  popoverPosition?: PopoverPosition;
  /** Default `['-50%', 4]` - half-width inward shift on the cross axis, 4px main-axis gap. */
  popoverOffset?: PopoverOffset;
  /** Default `'w-auto min-w-[160px]'`. */
  popoverClassName?: string;
  /**
   * Surface level for the popover.
   *
   * Default same as Popover's `surfaceLevel` prop.
   */
  popoverSurfaceLevel?: number | string;
  /**
   * External anchor ref. When provided, the trigger button is **not rendered** - useful when the popover should anchor to an existing element controlled by the caller (the caller is then responsible for the trigger and `popoverState` wiring).
   */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** Controlled popover open state. Pair with `onPopoverState`. */
  popoverState?: boolean;
  /** Controlled popover open-state setter. */
  onPopoverState?: (state: boolean) => void;

  /** Fires after a selection. In single-select mode receives `T`; in `multiple` receives `T[]`. */
  onChange?: (value: T | T[]) => void;
  /** Fires when the trigger button is clicked (before the popover state toggles). */
  onClick?: (e: MouseEvent) => void;

  // OPTIONS
  /**
   * Show numeric quick-pick hints (0–9) next to options, and bind `0`–`9` keys to select them.
   *
   * Default `true`. See `noneOptionValue` for how the digits map to options.
   */
  keyboardHints?: boolean;
  keyboardHintsVariant?: SurfaceVariant;
  keyboardHintsOutline?: boolean;
  keyboardHintsClassName?: string;
  keyboardHintsSize?: ShortcutSize;
  /** Default color for the per-option indicator (Radio/Checkbox). Overridden per-option by `optionIndicatorColor`. */
  indicatorColor?: Color;
  /** Per-option indicator color. Return `undefined` to fall back to `indicatorColor`. */
  optionIndicatorColor?: (
    params: SelectOptionRenderParams<T>,
  ) => Color | undefined;
  /** Custom "is this option selected?" predicate - overrides the built-in equality check. */
  isChecked?: (value: T) => boolean;
  isOptionDisabled?: (value: T) => boolean;
  /**
   * Extracts the comparable key from an option object. Default: identity.
   *
   * Use when `T` is an object and selection should compare by `id` rather than reference.
   */
  getOptionValue?: (option: T) => unknown;
  /**
   * Inverse of `getOptionValue` - given a key, return the matching option from `options`.
   *
   * Required for multi-select with object options so emitted `value[]` arrays can be rebuilt.
   */
  getOptionByValue?: (options: T[], value: unknown) => T;
  /** Slot rendered above each option (e.g. group header before the first item in a section). */
  renderBeforeOption?: (value: T, index: number) => ReactNode;
  /** Slot rendered below each option. */
  renderAfterOption?: (value: T, index: number) => ReactNode;
  /** Custom option label renderer. Default: `String(value)`. */
  renderOption?: (params: SelectOptionRenderParams<T>) => ReactNode;
  /** Subtext rendered under the option label. */
  renderOptionInfo?: (params: SelectOptionRenderParams<T>) => ReactNode;

  /**
   * Value of the "none/initial" option that should be mapped to the 0 key.
   *
   *  If set, this option gets hint "0" and remaining options get 1-9 in order.
   *
   *  If not set, straight ordering: 1, 2, 3, ..., 9, 0 (for 10th).
   */
  noneOptionValue?: T;

  // FUNCTIONALITY
  /** Close the popover after a single-select pick. Default `true`. Has no effect when `multiple`. */
  closeOnSelect?: boolean;
  /** Scroll the popover so the currently selected option is centered when it opens. */
  scrollToSelected?: boolean;

  /** Forwarded to the trigger button. Ignored when `anchorRef` is provided (no trigger is rendered). */
  ref?: Ref<HTMLElement>;
}

export type SelectProps<T = string> = SelectOwnProps<T> &
  Omit<ButtonProps, keyof SelectOwnProps<T>>;

export function Select<T = string>(props: SelectProps<T>) {
  const {
    value = '' as T,
    placeholder = '',
    title = '',
    options = [],
    multiple,
    disabled,
    readOnly,

    // STYLING
    color,
    rounded,
    size = 'md',
    className,
    contentClassName,
    valueClassName,
    surface,
    reverse,
    icon,
    dropdownIcon = true,
    multiline,
    placeholderClassName = '',

    // CONTENT
    children,
    beforeOptions,
    afterOptions,

    // SEARCH RELATED PROPS
    search,
    searchPlaceholder = 'Search',
    searchNotFound = 'Nothing found',
    searchFocus,
    onSearch,

    // POPOVER RELATED PROPS
    popoverColor,
    popoverPosition = 'bottom-end',
    popoverOffset = ['-50%', 4],
    popoverClassName = 'w-auto min-w-[160px]',
    popoverSurfaceLevel,
    anchorRef: elRefExternal,
    popoverState: popoverStateExternal,
    onPopoverState: setPopoverStateExternal,

    // CALLBACKS
    onChange = () => {},
    onClick = () => {},

    // OPTIONS
    keyboardHints = true,
    keyboardHintsVariant = 'transparent',
    keyboardHintsSize = 'md',
    keyboardHintsOutline = false,
    keyboardHintsClassName = '',

    indicatorColor,
    optionIndicatorColor = () => undefined,
    isChecked,
    isOptionDisabled,
    getOptionValue = (option: T) => option as unknown,
    getOptionByValue,
    renderBeforeOption,
    renderAfterOption,
    renderOption = ({ value }: SelectOptionRenderParams<T>) => String(value),
    renderOptionInfo,

    /** Value of the "none/initial" option that should be mapped to the 0 key.
     *  If set, this option gets hint "0" and remaining options get 1-9 in order.
     *  If not set, straight ordering: 1, 2, 3, ..., 9, 0 (for 10th). */
    noneOptionValue,

    // FUNCTIONALITY
    closeOnSelect = true,
    scrollToSelected,

    ref,

    ...rest
  } = props;

  const elRef = useRef<HTMLElement | null>(null);
  const listElRef = useRef<HTMLDivElement | null>(null);
  const searchFieldRef = useRef<HTMLElement | null>(null);
  const device = useDevice();
  const reactId = useId();
  const listboxId = `select-listbox-${reactId}`;
  const optionIdPrefix = `select-option-${reactId}`;

  const [searchQuery, setSearchQuery] = useState('');
  const [popoverState, setPopoverState] = useState<boolean>(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const onChangeInternal = (optionValue: T, checked: boolean) => {
    if (!multiple) {
      onChange(getOptionValue(optionValue) as T);
    } else {
      const newValues = getOptionByValue
        ? [...(value as T[])].map((opt) => getOptionValue(opt))
        : [...(value as unknown[])];
      if (checked) newValues.push(getOptionValue(optionValue));
      else if (newValues.includes(getOptionValue(optionValue))) {
        newValues.splice(newValues.indexOf(getOptionValue(optionValue)), 1);
      }
      onChange(
        getOptionByValue
          ? newValues.map((optValue) => getOptionByValue(options, optValue))
          : (newValues as T[]),
      );
    }
    if (!multiple && closeOnSelect) {
      if (setPopoverStateExternal) setPopoverStateExternal(false);
      else setPopoverState(false);
    }
  };

  const InputComponent = multiple ? Checkbox : Radio;

  const displayOptions = search && onSearch ? onSearch(searchQuery) : options;

  const getOptionIsChecked = (optionValue: T): boolean => {
    if (isChecked) return isChecked(optionValue);
    const optKey = getOptionValue(optionValue);
    if (multiple) {
      const arr = (value as unknown[]) ?? [];
      if (getOptionByValue) {
        return arr.some((v) => getOptionValue(v as T) === optKey);
      }
      return arr.includes(optKey);
    }
    if (getOptionByValue && value !== undefined && value !== '') {
      return getOptionValue(value as T) === optKey;
    }
    return value === optKey;
  };

  const effectivePopoverState = popoverStateExternal ?? popoverState;

  const scrollPopoverToElement = (
    scrollToEl?: HTMLElement,
    dir?: 'up' | 'down',
  ) => {
    if (!scrollToEl && scrollToSelected && listElRef.current) {
      const checkedEl = listElRef.current.querySelector('input[checked]');
      if (!checkedEl) return;
      const labelEl = checkedEl.closest('label');
      if (!labelEl) return;
      labelEl.scrollIntoView({ block: 'center' });
    } else if (scrollToEl && listElRef.current) {
      const scrollEl = scrollToEl.closest('.overflow-auto') as HTMLElement;
      if (!scrollEl) return;
      if (dir === 'up') {
        if (scrollEl.scrollTop > scrollToEl.offsetTop) {
          scrollToEl.scrollIntoView({
            block: 'start',
            behavior: 'smooth',
          });
        }
      } else {
        if (scrollEl.scrollTop + scrollEl.offsetHeight < scrollToEl.offsetTop) {
          scrollToEl.scrollIntoView({
            block: 'end',
            behavior: 'smooth',
          });
        }
      }
    }
  };

  const focusSearchOnOpened = () => {
    if (searchFocus && searchFieldRef.current) {
      if (device.ios || device.android) return;
      const input = searchFieldRef.current.querySelector('input');
      if (input) input.focus();
    }
  };

  const onKeyDown = (e: globalThis.KeyboardEvent) => {
    if (device.mobile) return;
    if (!effectivePopoverState) return;

    // Numeric quick-pick: 0-9 selects the corresponding option
    // Skip when search input is focused so digits can be typed
    if (
      keyboardHints &&
      /^[0-9]$/.test(e.key) &&
      !searchFieldRef.current?.querySelector('input:focus')
    ) {
      e.preventDefault();
      const digit = parseInt(e.key);
      let targetIndex = -1;
      if (noneOptionValue !== undefined) {
        // Semantic mode: 0 = none/initial option, 1-9 = other options in order
        if (digit === 0) {
          targetIndex = displayOptions.findIndex(
            (o) => getOptionValue(o) === noneOptionValue,
          );
        } else {
          let rank = 0;
          for (let i = 0; i < displayOptions.length; i++) {
            if (getOptionValue(displayOptions[i]) !== noneOptionValue) {
              rank++;
              if (rank === digit) {
                targetIndex = i;
                break;
              }
            }
          }
        }
      } else {
        // Straight mode: 1=first, 2=second, ..., 9=ninth, 0=tenth
        targetIndex = digit === 0 ? 9 : digit - 1;
      }
      if (targetIndex >= 0 && targetIndex < displayOptions.length) {
        if (!multiple) {
          onChangeInternal(displayOptions[targetIndex], true);
        } else {
          onChangeInternal(
            displayOptions[targetIndex],
            !getOptionIsChecked(displayOptions[targetIndex]),
          );
        }
      }
      return;
    }

    if (
      e.key !== 'ArrowUp' &&
      e.key !== 'Tab' &&
      e.key !== 'ArrowDown' &&
      e.key !== 'Enter' &&
      e.key !== ' '
    ) {
      return;
    }
    const maxIndex = displayOptions.length - 1;
    const minIndex = 0;

    let newIndex = selectedItemIndex;
    if (selectedItemIndex < 0) {
      newIndex = displayOptions.findIndex(getOptionIsChecked);
    }
    let dir: 'up' | 'down' | undefined;
    if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
      dir = 'up';
      newIndex -= 1;
      e.preventDefault();
      if (newIndex < minIndex) {
        dir = 'down';
        newIndex = maxIndex;
      }
    }
    if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
      dir = 'down';
      newIndex += 1;
      e.preventDefault();
      if (newIndex > maxIndex) {
        dir = 'up';
        newIndex = 0;
      }
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Tab') {
      setSelectedItemIndex(newIndex);
      if (listElRef.current) {
        const el = listElRef.current.querySelectorAll('.list label')[
          newIndex
        ] as HTMLElement;
        if (el) {
          el.focus();
          scrollPopoverToElement(el, dir);
        }
      }
    }
    if ((e.key === 'Enter' || e.key === ' ') && selectedItemIndex >= 0) {
      if (
        document.activeElement ===
        searchFieldRef.current?.querySelector('input')
      ) {
        return; // Don't select option when pressing Enter/Space in search input
      }
      e.preventDefault();
      if (!multiple) {
        onChangeInternal(displayOptions[selectedItemIndex], true);
      } else {
        onChangeInternal(
          displayOptions[selectedItemIndex],
          !getOptionIsChecked(displayOptions[selectedItemIndex]),
        );
      }
    }
  };

  const onPopoverOpen = () => {
    scrollPopoverToElement();
  };
  const onPopoverOpened = () => {
    focusSearchOnOpened();
  };
  const onPopoverClosed = () => {
    setSelectedItemIndex(-1);
    if (!device.mobile && elRef.current) {
      elRef.current.focus();
    }
  };

  useEffect(() => {
    if (effectivePopoverState) {
      setSearchQuery('');
    }
  }, [effectivePopoverState]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <>
      {!elRefExternal && (
        <Button
          data-part="trigger"
          className={cn('cladd-select w-full', className)}
          ref={(el: HTMLElement | null) => {
            elRef.current = el;
            if (ref && typeof ref === 'function') ref(el);
            else if (ref && typeof ref === 'object')
              (ref as React.RefObject<HTMLElement | null>).current = el;
          }}
          size={size}
          rounded={rounded}
          color={color}
          disabled={disabled}
          multiline={multiline}
          surface={surface}
          readOnly={readOnly}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={effectivePopoverState}
          aria-controls={effectivePopoverState ? listboxId : undefined}
          aria-activedescendant={
            effectivePopoverState && selectedItemIndex >= 0
              ? `${optionIdPrefix}-${selectedItemIndex}`
              : undefined
          }
          aria-disabled={disabled || undefined}
          aria-readonly={readOnly || undefined}
          onClick={(e: MouseEvent) => {
            onClick(e);
            const currentState = popoverStateExternal ?? popoverState;
            if (setPopoverStateExternal) setPopoverStateExternal(!currentState);
            else setPopoverState(!currentState);
          }}
          contentClassName={cn(dropdownIcon && 'pr-1.5')}
          {...rest}
        >
          <div
            className={cn(
              'flex w-full min-w-0 shrink items-center justify-between gap-2',
              reverse && 'flex-row-reverse',
              contentClassName,
            )}
          >
            {icon && (
              <div data-part="icon" className={buttonIconSizes[size]}>
                {icon}
              </div>
            )}
            <div
              data-part="value"
              className={cn(
                'w-full min-w-0 shrink',
                !children && !String(value) && 'text-cladd-fg-softer',
                placeholderClassName,
                valueClassName,
              )}
            >
              {children || String(value) || placeholder}
            </div>
            {dropdownIcon && (
              <DropdownIcon
                data-part="dropdown-icon"
                className={cn('size-4', 'shrink-0 text-cladd-fg-softer')}
              />
            )}
          </div>
        </Button>
      )}

      {!readOnly && !disabled && (
        <Popover
          open={popoverStateExternal || popoverState}
          onOpenChange={setPopoverStateExternal || setPopoverState}
          anchorRef={elRefExternal || elRef}
          position={popoverPosition}
          offset={popoverOffset}
          color={popoverColor}
          surfaceLevel={popoverSurfaceLevel}
          className={popoverClassName}
          onOpen={onPopoverOpen}
          onOpened={onPopoverOpened}
          onClosed={onPopoverClosed}
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          {title && <SectionTitle className="px-4 pt-4">{title}</SectionTitle>}
          {search && (
            <SearchField
              value={searchQuery}
              placeholder={searchPlaceholder}
              inset={!!title}
              ref={searchFieldRef}
              className={cn(title && 'mt-2')}
              onChange={setSearchQuery}
            />
          )}
          {beforeOptions}
          <List
            ref={listElRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiple || undefined}
          >
            {search && onSearch && searchQuery && !displayOptions.length && (
              <div
                data-part="empty"
                className={cn(
                  'mb-2 flex h-8 w-full items-center pr-4 pl-4 text-cladd-xs font-medium text-cladd-fg-softer',
                )}
              >
                {searchNotFound}
              </div>
            )}
            {displayOptions.map((optionValue, optionIndex) => (
              <Fragment key={options.indexOf(optionValue)}>
                {renderBeforeOption &&
                  renderBeforeOption(optionValue, optionIndex)}
                <ListButton
                  selected={optionIndex === selectedItemIndex}
                  as="label"
                  contentClassName="pl-1"
                  disabled={isOptionDisabled && isOptionDisabled(optionValue)}
                  outline={false}
                  rounded
                  id={`${optionIdPrefix}-${optionIndex}`}
                  role="option"
                  aria-selected={getOptionIsChecked(optionValue)}
                  aria-disabled={
                    (isOptionDisabled && isOptionDisabled(optionValue)) ||
                    undefined
                  }
                >
                  <div className="flex w-full items-center gap-3">
                    <InputComponent
                      as="div"
                      className="shrink-0"
                      focusable={false}
                      hoverable={false}
                      input={
                        !isOptionDisabled || !isOptionDisabled(optionValue)
                      }
                      color={
                        optionIndicatorColor({
                          value: optionValue,
                          index: options.indexOf(optionValue),
                          selected: getOptionIsChecked(optionValue),
                        }) || indicatorColor
                      }
                      disabled={
                        isOptionDisabled && isOptionDisabled(optionValue)
                      }
                      checked={getOptionIsChecked(optionValue)}
                      onChange={(checked: boolean) =>
                        onChangeInternal(optionValue, checked)
                      }
                    />
                    <div className={cn('w-full min-w-0 shrink')}>
                      {renderOption({
                        value: optionValue,
                        index: options.indexOf(optionValue),
                        selected: getOptionIsChecked(optionValue),
                      })}
                      {renderOptionInfo &&
                        renderOptionInfo({
                          value: optionValue,
                          index: options.indexOf(optionValue),
                          selected: getOptionIsChecked(optionValue),
                        }) && (
                          <div className="text-cladd-xs font-normal text-cladd-fg-soft">
                            {renderOptionInfo({
                              value: optionValue,
                              index: options.indexOf(optionValue),
                              selected: getOptionIsChecked(optionValue),
                            })}
                          </div>
                        )}
                    </div>
                    {keyboardHints &&
                      displayOptions.length > 1 &&
                      !device.mobile &&
                      (() => {
                        let hint: number | null = null;
                        if (noneOptionValue !== undefined) {
                          if (getOptionValue(optionValue) === noneOptionValue) {
                            hint = 0;
                          } else {
                            let rank = 0;
                            for (let i = 0; i <= optionIndex; i++) {
                              if (
                                getOptionValue(displayOptions[i]) !==
                                noneOptionValue
                              )
                                rank++;
                            }
                            hint = rank <= 9 ? rank : null;
                          }
                        } else {
                          if (optionIndex < 9) hint = optionIndex + 1;
                          else if (optionIndex === 9) hint = 0;
                        }
                        return hint !== null ? (
                          <Shortcut
                            className="ml-auto shrink-0 tabular-nums"
                            keyClassName={cn(
                              'font-normal text-cladd-fg-soft',
                              keyboardHintsClassName,
                            )}
                            size={keyboardHintsSize}
                            variant={keyboardHintsVariant}
                            outline={keyboardHintsOutline}
                          >
                            {hint}
                          </Shortcut>
                        ) : null;
                      })()}
                  </div>
                </ListButton>
                {renderAfterOption &&
                  renderAfterOption(optionValue, optionIndex)}
              </Fragment>
            ))}
          </List>
          {afterOptions}
        </Popover>
      )}
    </>
  );
}
