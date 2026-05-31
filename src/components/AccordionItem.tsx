import { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { useAccordionContext } from './AccordionContext';
import { CollapsibleContextProvider } from './CollapsibleContext';

interface AccordionItemOwnProps {
  /** The item's trigger, panel and (optional) indicator. */
  children?: ReactNode;
  /** Extra classes for the item wrapper. */
  className?: string;
  /** Identifies this item - matched against the accordion's open value(s). */
  value: string;
  /** Disable just this item. Combined with the accordion's own `disabled`. */
  disabled?: boolean;
  /** Forwarded to the underlying `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

export type AccordionItemProps = AccordionItemOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof AccordionItemOwnProps>;

/** Shape of `AccordionItem` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type AccordionItemDefaultProps = Partial<
  Omit<AccordionItemOwnProps, 'children' | 'value' | 'ref'>
>;

/**
 * One disclosure within an `AccordionRoot`. Binds a `value`, derives its open
 * state from the surrounding accordion, and republishes it as a
 * `CollapsibleContextValue` - so the same `CollapsibleTrigger`/`CollapsiblePanel`
 * /`CollapsibleIndicator` (and their `Accordion*` aliases) work inside it.
 *
 * Renders a single `<div>` wrapper carrying `data-open` / `data-disabled`.
 */
export const AccordionItem = (props: AccordionItemProps) => {
  const accordion = useAccordionContext();
  const {
    children,
    className = '',
    value,
    disabled: itemDisabled = false,
    ref,
    ...rest
  } = useComponentDefaults('AccordionItem', props);

  const disabled = accordion.disabled || itemDisabled;
  const open = accordion.isItemOpen(value);

  const setOpen = (next: boolean) => {
    if (disabled || next === open) return;
    accordion.toggleItem(value);
  };

  return (
    <CollapsibleContextProvider
      value={{
        open,
        toggle: () => {
          if (!disabled) accordion.toggleItem(value);
        },
        setOpen,
        disabled,
        triggerId: `${accordion.baseId}-trigger-${value}`,
        panelId: `${accordion.baseId}-panel-${value}`,
      }}
    >
      <div
        ref={ref}
        data-open={open || undefined}
        data-disabled={disabled || undefined}
        className={cn('cladd-accordion-item', className)}
        {...rest}
      >
        {children}
      </div>
    </CollapsibleContextProvider>
  );
};
