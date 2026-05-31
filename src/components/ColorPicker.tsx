import { MouseEvent, ReactNode, Ref, RefObject, useRef, useState } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import {
  buildColorValue,
  CHECKER,
  ColorEditorValue,
  ColorInput,
  ColorValue,
  GradientInput,
  gradientCss,
  isGradientInput,
  parseColor,
  parseGradient,
} from '../shared/color';
import { Color } from '../types';
import { Button, ButtonProps, buttonIconSizes, ButtonSize } from './Button';
import {
  ColorEditor,
  ColorEditorControlSize,
  ColorEditorFormat,
  ColorEditorProps,
} from './ColorEditor';
import { CloseIcon } from './icons/CloseIcon';
import { DropdownIcon } from './icons/DropdownIcon';
import { Popover, PopoverOffset, PopoverPosition } from './Popover';

/** Swatch box size per field size — kept in step with the icon slot. */
const SWATCH_SIZE: Record<ButtonSize, string> = {
  '2xs': 'size-3',
  xs: 'size-3',
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-4',
  xl: 'size-4',
  '2xl': 'size-5',
};

interface ColorPickerBaseProps {
  /** Value shown when there is no color (or a fully transparent one) and no `children`. */
  placeholder?: ReactNode;
  /** Label rendered for a gradient value in the trigger. Default `'Gradient'`. */
  gradientLabel?: string;
  /** Visually dim the trigger and prevent the popover from opening. */
  disabled?: boolean;
  /** Show the trigger with the current value but block opening the popover. */
  readOnly?: boolean;

  // TRIGGER STYLING (forwarded to the trigger `Button`)
  /** Accent color for the trigger button. Forwarded to `Button.color`. */
  color?: Color;
  /** Pill-style trigger button. Forwarded to `Button.rounded`. */
  rounded?: boolean;
  /** Render the trigger button's surface outline ring. Forwarded to `Button.outline`. */
  outline?: boolean;
  /** Trigger button size — also scales the swatch. Forwarded to `Button.size`. */
  size?: ButtonSize;
  /** Trigger button surface: `'surface'` (default) or `'cut'` (inset/recessed). */
  surface?: 'surface' | 'cut';
  /** Reverse the visual order of the content row (icon/swatch/value ↔ dropdown). */
  reverse?: boolean;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Extra classes for the trigger button's inner content row. */
  contentClassName?: string;
  /** Extra classes for the value display inside the trigger. */
  valueClassName?: string;
  /** Extra classes for the color swatch. */
  swatchClassName?: string;
  /** Extra classes applied to the value container when showing the placeholder. */
  placeholderClassName?: string;
  /** Icon node rendered at the start of the trigger, before the swatch. */
  icon?: ReactNode;
  /** Extra classes for the icon wrapper. */
  iconClassName?: string;
  /** Show the chevron-down indicator on the right of the trigger. Default `true`. */
  dropdownIcon?: boolean;
  /** Forwarded to the trigger `Button` — allows wrapping the value across lines. */
  multiline?: boolean;
  /**
   * Custom node rendered in place of the auto-formatted value (hex / gradient label).
   *
   * Rendered as `data-part="value"` — use to show your own value text, a field label, or richer formatting.
   */
  children?: ReactNode;

  // EDITOR (forwarded to the popover `ColorEditor`)
  /** Show the alpha slider and scrubber. Default `true`. */
  alpha?: boolean;
  /** Show the channel-scrubber row. Default `true`. */
  inputs?: boolean;
  /** Which channels the scrubber row shows. Default `'rgb'`. */
  format?: ColorEditorFormat;
  /** Show the hex input. Default `true`. */
  hexInput?: boolean;
  /** Gradient angle control: a 45°-step button, or a degree scrubber. Default `'scrubber'`. */
  angleControl?: 'button' | 'scrubber';
  /** Preset colors rendered as a row of thumbs in the editor. */
  swatches?: ColorInput[];
  /** Size of the editor's inner controls. Default `'md'`. */
  controlSize?: ColorEditorControlSize;
  /** Render the surface outline on the editor's inner controls. Default `true`. */
  controlOutline?: boolean;
  /** Debounce `onChange` calls in ms. Forwarded to the editor. */
  debounce?: number;
  /** Throttle `onChange` calls in ms. Forwarded to the editor. */
  throttle?: number;
  /** Content rendered above the editor panel, inside the popover. */
  header?: ReactNode;
  /** Content rendered below the editor panel, inside the popover. */
  footer?: ReactNode;
  /** Extra classes for the editor panel root. */
  editorClassName?: string;
  /** Extra classes for the editor's saturation/brightness area. */
  areaClassName?: string;

  // POPOVER
  /** Accent color for the popover. Forwarded to `Popover.color`. */
  popoverColor?: Color;
  /** Default `'bottom-end'`. */
  popoverPosition?: PopoverPosition;
  /** Default `['-50%', 4]`. */
  popoverOffset?: PopoverOffset;
  /** Extra classes for the popover. Default `'w-64 p-3'`. */
  popoverClassName?: string;
  /** Surface level for the popover. Default same as `Popover`'s `surfaceLevel`. */
  popoverSurfaceLevel?: number | string;
  /**
   * External anchor ref. When provided the trigger button is **not rendered** - the caller owns the trigger and `popoverState` wiring.
   */
  anchorRef?: RefObject<HTMLElement | null>;
  /** Controlled popover open state. Pair with `onPopoverState`. */
  popoverState?: boolean;
  /** Fires whenever the popover open state changes. */
  onPopoverState?: (state: boolean) => void;

  /** Fires when the trigger button is clicked (before the popover toggles). */
  onClick?: (e: MouseEvent) => void;
  /** Forwarded to the trigger button. Ignored when `anchorRef` is provided. */
  ref?: Ref<HTMLElement>;
}

type SolidColorPickerProps = ColorPickerBaseProps & {
  /** Enable the Solid/Gradient switch and gradient editing. Default `false`. */
  gradient?: false;
  /** Controlled value. A CSS color string or any one channel set. */
  value?: ColorInput;
  /** Initial value (uncontrolled). */
  defaultValue?: ColorInput;
  /** Fires on every change with the full color. */
  onChange?: (value: ColorValue) => void;
};

type GradientColorPickerProps = ColorPickerBaseProps & {
  gradient: true;
  /** Controlled value. A CSS color/gradient string, a channel set, or a gradient object. */
  value?: ColorInput | GradientInput;
  /** Initial value (uncontrolled). */
  defaultValue?: ColorInput | GradientInput;
  /** Fires on every change with a discriminated `solid` / `linear` value. */
  onChange?: (value: ColorEditorValue) => void;
};

export type ColorPickerProps = (
  | SolidColorPickerProps
  | GradientColorPickerProps
) &
  Omit<
    ButtonProps,
    | keyof ColorPickerBaseProps
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'gradient'
  >;

/** Shape of `ColorPicker` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type ColorPickerDefaultProps = Partial<
  Omit<
    ColorPickerBaseProps,
    | 'ref'
    | 'children'
    | 'icon'
    | 'header'
    | 'footer'
    | 'anchorRef'
    | 'onClick'
    | 'popoverState'
    | 'onPopoverState'
  >
>;

type ResolvedProps = ColorPickerBaseProps & {
  gradient?: boolean;
  value?: ColorInput | GradientInput;
  defaultValue?: ColorInput | GradientInput;
  onChange?: (value: ColorValue | ColorEditorValue) => void;
} & Omit<
    ButtonProps,
    | keyof ColorPickerBaseProps
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'gradient'
  >;

type StoredValue =
  | ColorInput
  | GradientInput
  | ColorValue
  | ColorEditorValue
  | undefined;

type Display =
  | { empty: true }
  | { empty: false; background: string; text: string };

/**
 * Resolve a value (input form *or* the rich form the editor emits) into what the
 * trigger shows: a swatch background + label, or the empty/transparent state.
 */
const resolveDisplay = (input: StoredValue, gradientLabel: string): Display => {
  if (input == null || input === '') return { empty: true };

  // Rich emitted value — already carries its own `css`.
  if (typeof input === 'object' && 'css' in input) {
    if ('type' in input && input.type === 'linear') {
      // A gradient whose every stop is fully transparent reads as no color.
      if (input.stops.every((s) => s.color.rgb.a === 0)) return { empty: true };
      return { empty: false, background: input.css, text: gradientLabel };
    }
    const cv = input as ColorValue;
    return {
      empty: cv.rgb.a === 0,
      background: cv.css,
      text: cv.hex.toUpperCase(),
    };
  }

  // Gradient input (`linear-gradient(...)` string or `{ stops }`).
  if (isGradientInput(input)) {
    const parsed = parseGradient(input);
    if (parsed) {
      if (parsed.stops.every((s) => s.hsva.a === 0)) return { empty: true };
      const stops = parsed.stops.map((s) => ({
        color: buildColorValue(s.hsva),
        position: s.position,
      }));
      return {
        empty: false,
        background: gradientCss(parsed.angle, stops),
        text: gradientLabel,
      };
    }
  }

  // Solid input (CSS string or a single channel set).
  const hsva = parseColor(input as ColorInput);
  const cv = buildColorValue(hsva);
  return {
    empty: hsva.a === 0,
    background: cv.css,
    text: cv.hex.toUpperCase(),
  };
};

export function ColorPicker(props: ColorPickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    gradient,
    placeholder = '',
    gradientLabel = 'Gradient',
    disabled,
    readOnly,

    // TRIGGER STYLING
    color,
    rounded,
    outline,
    size = 'md',
    surface,
    reverse,
    className,
    contentClassName,
    valueClassName,
    swatchClassName,
    placeholderClassName = '',
    icon,
    iconClassName = '',
    dropdownIcon = true,
    multiline,
    children,

    // EDITOR
    alpha,
    inputs,
    format,
    hexInput,
    angleControl,
    swatches,
    controlSize,
    controlOutline,
    debounce,
    throttle,
    header,
    footer,
    editorClassName,
    areaClassName,

    // POPOVER
    popoverColor,
    popoverPosition = 'bottom-end',
    popoverOffset = ['-50%', 4],
    popoverClassName = '',
    popoverSurfaceLevel,
    anchorRef: elRefExternal,
    popoverState: popoverStateExternal,
    onPopoverState: setPopoverStateExternal,

    onClick = () => {},
    ref,

    ...rest
  } = useComponentDefaults('ColorPicker', props) as unknown as ResolvedProps;

  const elRef = useRef<HTMLElement | null>(null);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<StoredValue>(defaultValue);
  const [open, setOpen] = useState(false);

  const effectiveOpen = popoverStateExternal ?? open;
  const setOpenState = (next: boolean) => {
    if (popoverStateExternal === undefined) setOpen(next);
    setPopoverStateExternal?.(next);
  };

  const handleChange = (next: ColorValue | ColorEditorValue) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const display = resolveDisplay(
    isControlled ? value : internalValue,
    gradientLabel,
  );
  const showPlaceholder = !children && display.empty;

  // Only forward props the caller actually set, so provider-level `ColorEditor`
  // defaults survive instead of being clobbered by an explicit `undefined`.
  const editorProps: Record<string, unknown> = {
    alpha,
    inputs,
    format,
    hexInput,
    angleControl,
    swatches,
    controlSize,
    controlOutline,
    debounce,
    throttle,
    header,
    footer,
    areaClassName,
    className: editorClassName,
    onChange: handleChange,
  };
  if (gradient) editorProps.gradient = true;
  if (isControlled) editorProps.value = value;
  else editorProps.defaultValue = defaultValue;
  for (const key of Object.keys(editorProps)) {
    if (editorProps[key] === undefined) delete editorProps[key];
  }

  return (
    <>
      {!elRefExternal && (
        <Button
          data-part="trigger"
          className={cn('cladd-colorpicker w-full', className)}
          ref={(el: HTMLElement | null) => {
            elRef.current = el;
            if (typeof ref === 'function') ref(el);
            else if (ref) (ref as RefObject<HTMLElement | null>).current = el;
          }}
          size={size}
          rounded={rounded}
          outline={outline}
          color={color}
          disabled={disabled}
          multiline={multiline}
          surface={surface}
          readOnly={readOnly}
          aria-haspopup="dialog"
          aria-expanded={effectiveOpen}
          aria-disabled={disabled || undefined}
          aria-readonly={readOnly || undefined}
          onClick={(e: MouseEvent) => {
            onClick(e);
            setOpenState(!effectiveOpen);
          }}
          contentClassName={cn(
            dropdownIcon && 'pr-1.5',
            'flex w-full min-w-0 shrink items-center gap-2',
            reverse && 'flex-row-reverse',
            contentClassName,
          )}
          {...rest}
        >
          {icon && (
            <div
              data-part="icon"
              className={cn('shrink-0', buttonIconSizes[size], iconClassName)}
            >
              {icon}
            </div>
          )}
          {display.empty ? (
            <div
              data-part="swatch"
              className={cn(
                'flex shrink-0 items-center justify-center rounded-cladd-2xs border border-cladd-outline text-cladd-fg-softer',
                SWATCH_SIZE[size],
                swatchClassName,
              )}
            >
              <CloseIcon className="size-3" />
            </div>
          ) : (
            <div
              data-part="swatch"
              className={cn(
                'relative shrink-0 rounded-cladd-2xs',
                SWATCH_SIZE[size],
                swatchClassName,
              )}
              style={{
                background: CHECKER.background.replaceAll('12px', '16px'),
              }}
            >
              <span
                className="absolute inset-0 rounded-cladd-2xs shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] light:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
                style={{ background: display.background }}
              />
            </div>
          )}
          <div
            data-part="value"
            className={cn(
              'w-full min-w-0 shrink truncate',
              showPlaceholder && 'text-cladd-fg-softer',
              placeholderClassName,
              valueClassName,
            )}
          >
            {children ?? (display.empty ? placeholder : display.text)}
          </div>
          {dropdownIcon && (
            <DropdownIcon
              data-part="dropdown-icon"
              className={cn('size-4', 'shrink-0 text-cladd-fg-softer')}
            />
          )}
        </Button>
      )}

      {!readOnly && !disabled && (
        <Popover
          open={effectiveOpen}
          onOpenChange={setOpenState}
          anchorRef={elRefExternal || elRef}
          position={popoverPosition}
          offset={popoverOffset}
          color={popoverColor}
          surfaceLevel={popoverSurfaceLevel}
          className={cn('w-64', popoverClassName)}
          contentClassName="p-4"
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          <ColorEditor {...(editorProps as ColorEditorProps)} />
        </Popover>
      )}
    </>
  );
}
