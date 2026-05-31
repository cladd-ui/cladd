import { ComponentPropsWithoutRef, ElementType, ReactNode, Ref } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { useCollapsibleContext } from './CollapsibleContext';

/** Disclosure state passed to a `CollapsibleIndicator` render function. */
export interface CollapsibleIndicatorState {
  /** Whether the disclosure is currently expanded. */
  open: boolean;
  /** Whether the disclosure is disabled. */
  disabled: boolean;
}

interface CollapsibleIndicatorOwnProps<C extends ElementType = 'span'> {
  /**
   * Indicator content. Either static markup (rotate or restyle it off the `data-open` attribute in CSS), or a render function receiving `{ open, disabled }` so you can swap glyphs entirely (chevron, plus↔minus, a spinning `×`, whatever).
   */
  children?: ReactNode | ((state: CollapsibleIndicatorState) => ReactNode);
  /** Extra classes for the indicator root. */
  className?: string;
  /** Polymorphic root element. Defaults to `'span'`. */
  as?: C;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
}

export type CollapsibleIndicatorProps<C extends ElementType = 'span'> =
  CollapsibleIndicatorOwnProps<C> &
    Omit<ComponentPropsWithoutRef<C>, keyof CollapsibleIndicatorOwnProps<C>>;

/** Shape of `CollapsibleIndicator` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type CollapsibleIndicatorDefaultProps = Partial<
  Omit<CollapsibleIndicatorOwnProps, 'as' | 'ref' | 'children'>
>;

/**
 * Optional, decorative slot for a disclosure's open/closed affordance. Renders
 * an `aria-hidden` element carrying `data-open`, so static children can be
 * rotated purely in CSS - or pass a render function to swap content based on the
 * live `{ open, disabled }` state.
 *
 * Brings no glyph of its own (Cladd is for apps, not FAQ pages) - drop in
 * whatever icon you want.
 *
 * @example
 * <CollapsibleIndicator className="transition-transform data-[open]:rotate-90">
 *   <ChevronLeftIcon />
 * </CollapsibleIndicator>
 *
 * @example
 * <CollapsibleIndicator>
 *   {({ open }) => (open ? <MinusIcon /> : <PlusIcon />)}
 * </CollapsibleIndicator>
 */
export const CollapsibleIndicator = <C extends ElementType = 'span'>(
  props: CollapsibleIndicatorProps<C>,
) => {
  const { open, disabled } = useCollapsibleContext();
  const {
    children,
    className = '',
    as: Component = 'span' as ElementType<any>,
    ref,
    ...rest
  } = useComponentDefaults('CollapsibleIndicator', props);

  return (
    <Component
      ref={ref}
      aria-hidden="true"
      data-open={open || undefined}
      data-disabled={disabled || undefined}
      className={cn('cladd-collapsible-indicator inline-flex', className)}
      {...rest}
    >
      {typeof children === 'function'
        ? (children as (state: CollapsibleIndicatorState) => ReactNode)({
            open,
            disabled,
          })
        : children}
    </Component>
  );
};
