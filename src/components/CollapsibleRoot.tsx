import { ReactNode, useId, useState } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { CollapsibleContextProvider } from './CollapsibleContext';

interface CollapsibleRootOwnProps {
  /** Trigger, panel and (optional) indicator elements. */
  children?: ReactNode;
  /** Controlled open state. When provided, internal state is bypassed. */
  open?: boolean;
  /** Initial open state (uncontrolled). Default `false`. Ignored when `open` is provided. */
  defaultOpen?: boolean;
  /** Fires whenever the open state should change (trigger click). */
  onOpenChange?: (open: boolean) => void;
  /** Disable the disclosure - the trigger stops toggling and gets `data-disabled`. */
  disabled?: boolean;
}

export type CollapsibleRootProps = CollapsibleRootOwnProps;

/** Shape of `CollapsibleRoot` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type CollapsibleRootDefaultProps = Partial<
  Omit<
    CollapsibleRootOwnProps,
    'children' | 'open' | 'defaultOpen' | 'onOpenChange'
  >
>;

/**
 * Stateful, non-visual root for a single disclosure. Owns the open state
 * (controlled via `open`/`onOpenChange` or uncontrolled via `defaultOpen`) and
 * publishes it to `CollapsibleTrigger`/`CollapsiblePanel`/`CollapsibleIndicator`
 * through context - it renders no DOM of its own.
 *
 * @example
 * <CollapsibleRoot defaultOpen>
 *   <CollapsibleTrigger>
 *     <button>Advanced</button>
 *   </CollapsibleTrigger>
 *   <CollapsiblePanel>
 *     <div className="pt-2">…</div>
 *   </CollapsiblePanel>
 * </CollapsibleRoot>
 */
export const CollapsibleRoot = (props: CollapsibleRootProps) => {
  const baseId = useId();
  const {
    children,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
  } = useComponentDefaults('CollapsibleRoot', props);

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = (next: boolean) => {
    if (disabled || next === open) return;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContextProvider
      value={{
        open,
        toggle: () => setOpen(!open),
        setOpen,
        disabled,
        triggerId: `${baseId}-trigger`,
        panelId: `${baseId}-panel`,
      }}
    >
      {children}
    </CollapsibleContextProvider>
  );
};
