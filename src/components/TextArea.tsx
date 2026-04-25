import {
  useEffect,
  useRef,
  useState,
  ElementType,
  ReactNode,
  Ref,
  FocusEvent,
  KeyboardEvent,
  FormEvent,
  ClipboardEvent,
  MouseEvent,
  ComponentPropsWithoutRef,
} from 'react';

import { cn } from '../shared/cn';
import { useAccentColor } from '../shared/use-accent-color';
import { Color } from '../types';
import { FocusableLayer } from './FocusableLayer';
import { SurfaceCut } from './SurfaceCut';
import { SurfaceCutContent } from './SurfaceCutContent';

type TextAreaSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface TextAreaOwnProps<C extends ElementType = 'div'> {
  /** Polymorphic wrapper element. Defaults to `'div'`. The editable area itself is always a `contenteditable` `<div>`. */
  component?: C;
  /** Forwarded to the wrapper element. */
  ref?: Ref<HTMLElement>;
  /** Controlled value. Synced into the editable `innerText` on change (see `updateContentOnChange`). */
  value?: string;
  placeholder?: string;
  /** Visually dim the textarea and remove `contenteditable`. */
  disabled?: boolean;
  /** Make the textarea non-editable but still selectable. */
  readOnly?: boolean;
  /** Apply pill-style corners. Default `false` - uses size-specific radii. */
  rounded?: boolean;
  size?: TextAreaSize;
  /** Fires on every input event. First arg is the new text, second is the raw event. */
  onChange?: (value: string, event?: FormEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
  /** Accent color token. Drives the focus ring and `infoMessage` colors. Default: theme accent. */
  color?: Color;
  /** Slot rendered before the editable area. */
  prefix?: ReactNode;
  /** Slot rendered after the editable area. */
  suffix?: ReactNode;
  /**
   * When `true` (default), syncs the editable `innerText` whenever `value` changes from
   * the outside. Set to `false` for performance-sensitive editors that manage their own
   * DOM (e.g. rich-text editors) - otherwise external `value` updates would stomp on
   * caret position and selection.
   */
  updateContentOnChange?: boolean;
  /** Extra classes for the outer wrapper. */
  className?: string;
  /** Extra classes for the inner content row (where prefix/editor/suffix live). */
  contentClassName?: string;
  /** Extra classes for the editable `[contenteditable]` `<div>`. */
  inputClassName?: string;
  /** Extra classes for the placeholder layer. */
  placeholderClassName?: string;
  /** Validity state. Default `true`. When `false`, switches the focus ring to red and shows `errorMessage`. */
  valid?: boolean;
  /** Floating label shown above the editor on focus. Hidden when `valid === false` or `readOnly`. */
  infoMessage?: ReactNode;
  /** Floating error label. Always visible when `valid === false`. */
  errorMessage?: ReactNode;
  /** Icon node rendered absolutely positioned on the left. */
  icon?: ReactNode;
  /** Extra classes applied to the inner `SurfaceCut`. */
  surfaceClassName?: string;
  /** Reserved - currently not applied in the rendered output. */
  inputPadding?: string;
}

export type TextAreaProps<C extends ElementType = 'div'> = TextAreaOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof TextAreaOwnProps<C>>;

export const TextArea = <C extends ElementType = 'div'>(
  props: TextAreaProps<C>,
) => {
  const accentColor = useAccentColor();
  const {
    component = 'div',
    ref: externalRef,
    value,
    placeholder,
    disabled = false,
    readOnly,
    rounded = false,
    size = 'lg',
    onChange = () => {},
    onKeyDown = () => {},
    onFocus = () => {},
    onBlur = () => {},
    color = accentColor,
    prefix,
    suffix,
    updateContentOnChange = true,
    className,
    contentClassName,
    inputClassName,
    placeholderClassName = '',
    valid = true,
    infoMessage,
    errorMessage,
    icon,
    surfaceClassName,
  } = props;

  const fontSizes: Record<TextAreaSize, string> = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-xs',
    xl: 'text-xs',
    '2xl': 'text-xs',
  };
  const iconWrapClasses: Record<TextAreaSize, string> = {
    sm: 'left-2.5 [&>svg]:size-4 top-1',
    md: 'left-2.5 [&>svg]:size-4 top-1.5',
    lg: 'left-2.5 [&>svg]:size-4 top-2.5',
    xl: 'left-2.5 [&>svg]:size-4 top-3',
    '2xl': 'left-3.5 [&>svg]:size-4 top-4',
  };
  const inputPaddingNoIcon: Record<TextAreaSize, string> = {
    sm: 'px-2.5',
    md: 'px-2.5',
    lg: 'px-2.5',
    xl: 'px-2.5',
    '2xl': 'px-3.5',
  };
  const inputPaddingVertical: Record<TextAreaSize, string> = {
    sm: 'py-1',
    md: 'py-1.5',
    lg: 'py-2.5',
    xl: 'py-3',
    '2xl': 'py-4',
  };
  const inputPaddingWithIcon: Record<TextAreaSize, string> = {
    sm: 'pl-8.5 pr-2',
    md: 'pl-8.5 pr-2',
    lg: 'pl-8.5 pr-3',
    xl: 'pl-8.5 pr-3',
    '2xl': 'pl-9.5 pr-4',
  };
  const roundedFullSizes: Record<TextAreaSize, string> = {
    sm: 'rounded-[12px]',
    md: 'rounded-[14px]',
    lg: 'rounded-[18px]',
    xl: 'rounded-[20px]',
    '2xl': 'rounded-[24px]',
  };
  const roundedSizes: Record<TextAreaSize, string> = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-[10px]',
    xl: 'rounded-xl',
    '2xl': 'rounded-xl',
  };

  const heights: Record<TextAreaSize, string> = {
    sm: 'min-h-6',
    md: 'min-h-7',
    lg: 'min-h-9',
    xl: 'min-h-10',
    '2xl': 'min-h-12',
  };

  const inputPadding = cn(
    inputPaddingVertical[size],
    icon ? inputPaddingWithIcon[size] : inputPaddingNoIcon[size],
  );
  const elRef = useRef<HTMLElement | null>(null);
  const inputElRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState<string | undefined>();

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData && e.clipboardData.getData) {
      const text = e.clipboardData.getData('text/plain');
      e.preventDefault();
      document.execCommand('insertText', false, text);
    }
  };

  const onInput = (e: FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setText(target.innerText);
    onChange(target.innerText, e);
  };

  useEffect(() => {
    if (text !== value) {
      setText(value);
      if (updateContentOnChange && inputElRef.current) {
        inputElRef.current.innerText = value || '';
      }
    }
  }, [value]);

  const Component = component as ElementType;

  return (
    <Component
      className={cn(
        'input group/textarea relative',
        disabled && 'opacity-50',
        className,
      )}
    >
      {/* focus layer */}
      {!readOnly && !disabled && (
        <FocusableLayer
          className={cn(
            rounded ? roundedFullSizes[size] : roundedSizes[size],
            valid === false && 'color-red',
          )}
          force={valid === false}
          color={valid === false ? 'red' : color}
          group="textarea"
        />
      )}

      {/* input */}
      <SurfaceCut
        className={cn(
          rounded ? roundedFullSizes[size] : roundedSizes[size],
          surfaceClassName,
        )}
        hoverable={!disabled && !readOnly}
        onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
        ref={(el: HTMLElement | null) => {
          elRef.current = el;
          if (externalRef) {
            if (typeof externalRef === 'function') externalRef(el);
            else
              (
                externalRef as React.MutableRefObject<HTMLElement | null>
              ).current = el;
          }
        }}
      >
        <SurfaceCutContent
          className={cn('flex items-center', contentClassName)}
        >
          {prefix}
          {icon && (
            <div
              className={cn(
                'pointer-events-none absolute',
                iconWrapClasses[size],
              )}
            >
              {icon}
            </div>
          )}
          <div className="relative w-full">
            <div
              contentEditable={!disabled && !readOnly}
              ref={inputElRef}
              className={cn(
                inputPadding,
                heights[size],
                roundedSizes,
                fontSizes[size],
                'w-full appearance-none border-none bg-transparent font-medium shadow-none outline-none',
                disabled && 'text-on-surface-darker',
                inputClassName,
              )}
              onPaste={onPaste}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              onInput={onInput}
            />
            {!text && placeholder && (
              <div
                className={cn(
                  'pointer-events-none absolute top-0 left-0 h-full w-full text-on-surface-darker select-none',
                  fontSizes[size],
                  inputPadding,
                  placeholderClassName,
                )}
              >
                {placeholder}
              </div>
            )}
          </div>

          {suffix}
        </SurfaceCutContent>
      </SurfaceCut>

      {infoMessage && valid !== false && !readOnly && (
        <div
          className={cn(
            'pointer-events-none absolute -top-1.5 left-2 z-10 translate-y-1 rounded-lg bg-primary px-2 py-1.5 text-[10px] leading-none font-semibold text-on-primary opacity-0 duration-200 group-has-[[contenteditable]:focus]/textarea:-translate-y-1/2 group-has-[[contenteditable]:focus]/textarea:opacity-100',
            `color-${color}`,
          )}
        >
          {infoMessage}
        </div>
      )}
      {errorMessage && valid === false && (
        <div
          className={cn(
            'pointer-events-none absolute -top-1.5 left-2 z-10 -translate-y-1/2 rounded-sm bg-primary px-1 py-0.5 text-[10px] leading-none font-semibold text-on-primary opacity-100 duration-200',
            `color-red`,
          )}
        >
          {errorMessage}
        </div>
      )}
    </Component>
  );
};
