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

import { useAccentColor } from '../hooks/use-accent-color';
import { cn } from '../shared/cn';
import { roundedClasses } from '../shared/rounded-classes';
import { rootSizeClasses } from '../shared/size-utls';
import { Color } from '../types';
import { FocusableLayer } from './FocusableLayer';
import { SurfaceCut, SurfaceCutOwnProps } from './SurfaceCut';

export type TextareaSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface TextareaOwnProps<C extends ElementType = 'div'> {
  /** Polymorphic wrapper element. Defaults to `'div'`. The editable area itself is always a `contenteditable` `<div>`. */
  as?: C;
  /** Forwarded to the `SurfaceCut` root element. */
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
  size?: TextareaSize;
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
   * When `true` (default), syncs the editable `innerText` whenever `value` changes from the outside.
   *
   * Set to `false` for performance-sensitive editors that manage their own DOM (e.g. rich-text editors) - otherwise external `value` updates would stomp on caret position and selection.
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
  /** Validity state. Default `true`.
   *
   * When `false`, switches the focus ring to red and shows `errorMessage`. */
  valid?: boolean;
  /** Floating label shown above the editor on focus. Hidden when `valid === false` or `readOnly`. */
  infoMessage?: ReactNode;
  /** Floating error label. Always visible when `valid === false`. */
  errorMessage?: ReactNode;
  /** Icon node rendered absolutely positioned on the left. */
  icon?: ReactNode;
  /** Reserved - currently not applied in the rendered output. */
  inputPadding?: string;
}

export type TextareaProps<C extends ElementType = 'div'> = TextareaOwnProps<C> &
  Omit<SurfaceCutOwnProps<C>, keyof TextareaOwnProps<C> | 'children'> &
  Omit<ComponentPropsWithoutRef<C>, keyof TextareaOwnProps<C>>;

export const Textarea = <C extends ElementType = 'div'>(
  props: TextareaProps<C>,
) => {
  const accentColor = useAccentColor();
  const {
    as: asProp = 'div',
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
    ...rest
  } = props;

  const fontSizes: Record<TextareaSize, string> = {
    sm: 'text-cladd-xs',
    md: 'text-cladd-xs',
    lg: 'text-cladd-xs',
    xl: 'text-cladd-xs',
    '2xl': 'text-cladd-xs',
  };
  const iconWrapClasses: Record<TextareaSize, string> = {
    sm: 'left-2.5 [&>svg]:size-4 top-1',
    md: 'left-2.5 [&>svg]:size-4 top-1.5',
    lg: 'left-2.5 [&>svg]:size-4 top-2',
    xl: 'left-2.5 [&>svg]:size-4 top-3',
    '2xl': 'left-3.5 [&>svg]:size-4 top-4',
  };
  const inputPaddingNoIcon: Record<TextareaSize, string> = {
    sm: 'px-2.5',
    md: 'px-2.5',
    lg: 'px-2.5',
    xl: 'px-2.5',
    '2xl': 'px-3.5',
  };
  const inputPaddingVertical: Record<TextareaSize, string> = {
    sm: 'py-1',
    md: 'py-1.5',
    lg: 'py-2',
    xl: 'py-3',
    '2xl': 'py-4',
  };
  const inputPaddingWithIcon: Record<TextareaSize, string> = {
    sm: 'pl-8.5 pr-2',
    md: 'pl-8.5 pr-2',
    lg: 'pl-8.5 pr-3',
    xl: 'pl-8.5 pr-3',
    '2xl': 'pl-9.5 pr-4',
  };
  const { itemRoundedClasses, focusRoundedClasses } = roundedClasses(
    size,
    rounded,
    true,
  );
  const height = rootSizeClasses(size, 'min-height');

  const inputPadding = cn(
    inputPaddingVertical[size],
    icon ? inputPaddingWithIcon[size] : inputPaddingNoIcon[size],
  );
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

  const SurfaceCutComponent: ElementType = SurfaceCut;

  return (
    <SurfaceCutComponent
      {...rest}
      as={asProp}
      ref={externalRef}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={valid === false || undefined}
      hoverable={!disabled && !readOnly}
      wrapContent={false}
      className={cn(
        'cladd-textarea group/cladd-textarea relative',
        disabled && 'opacity-50',
        itemRoundedClasses,
        className,
      )}
    >
      {/* focus layer */}
      {!readOnly && !disabled && (
        <FocusableLayer
          className={cn(focusRoundedClasses)}
          force={valid === false}
          color={valid === false ? 'red' : color}
          group="textarea"
        />
      )}

      {/* input */}
      <div
        data-part="wrapper"
        onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
        className={cn('relative flex items-center', contentClassName)}
      >
        {prefix}
        {icon && (
          <div
            data-part="icon"
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
            data-part="control"
            contentEditable={!disabled && !readOnly}
            ref={inputElRef}
            className={cn(
              inputPadding,
              height,
              itemRoundedClasses,
              fontSizes[size],
              'w-full appearance-none border-none bg-transparent font-medium shadow-none outline-none',
              disabled && 'text-cladd-fg-softer',
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
              data-part="placeholder"
              className={cn(
                'pointer-events-none absolute top-0 left-0 h-full w-full text-cladd-fg-softer select-none',
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
      </div>

      {infoMessage && valid !== false && !readOnly && (
        <div
          data-part="info"
          className={cn(
            `cladd-color-${color}`,
            'pointer-events-none absolute -top-1.5 left-2 z-10 translate-y-1 rounded-cladd-sm bg-cladd-primary px-2 py-1.5 text-cladd-2xs leading-none font-semibold text-cladd-on-primary opacity-0 duration-200 group-has-[[contenteditable]:focus]/cladd-textarea:-translate-y-1/2 group-has-[[contenteditable]:focus]/cladd-textarea:opacity-100',
          )}
        >
          {infoMessage}
        </div>
      )}
      {errorMessage && valid === false && (
        <div
          data-part="error"
          className={cn(
            'cladd-color-red pointer-events-none absolute -top-1.5 left-2 z-10 -translate-y-1/2 rounded-cladd-sm bg-cladd-primary px-1 py-0.5 text-cladd-2xs leading-none font-semibold text-cladd-on-primary opacity-100 duration-200',
          )}
        >
          {errorMessage}
        </div>
      )}
    </SurfaceCutComponent>
  );
};
