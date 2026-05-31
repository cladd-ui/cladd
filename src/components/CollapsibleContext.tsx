import { createContext, useContext, ReactNode } from 'react';

/**
 * Disclosure state published by a `CollapsibleRoot` (or an `AccordionItem`,
 * which publishes the very same shape) to its `CollapsibleTrigger`,
 * `CollapsiblePanel`, and `CollapsibleIndicator`.
 */
export interface CollapsibleContextValue {
  /** Whether the disclosure is currently expanded. */
  open: boolean;
  /** Toggle the open state. No-ops while `disabled`. */
  toggle: () => void;
  /** Set the open state explicitly. No-ops while `disabled` or already in that state. */
  setOpen: (open: boolean) => void;
  /** Whether the disclosure is disabled - the trigger stops toggling. */
  disabled: boolean;
  /** Id of the trigger element - wired to the panel's `aria-labelledby`. */
  triggerId: string;
  /** Id of the panel element - wired to the trigger's `aria-controls`. */
  panelId: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

/**
 * Returns the surrounding disclosure state published by a `CollapsibleRoot` or
 * an `AccordionItem`.
 *
 * Reach for it to drive custom trigger markup from the live `open` state - e.g.
 * swapping an icon - in a spot where a plain `data-open` CSS rule won't do.
 * `CollapsibleIndicator` is the ready-made wrapper around this.
 *
 * Throws when called outside a `CollapsibleRoot` / `AccordionItem`.
 */
export function useCollapsibleContext(): CollapsibleContextValue {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error(
      'Cladd: `useCollapsibleContext`, `CollapsibleTrigger`, `CollapsiblePanel` and `CollapsibleIndicator` must be used inside a `CollapsibleRoot` or `AccordionItem`.',
    );
  }
  return ctx;
}

export function CollapsibleContextProvider(props: {
  value: CollapsibleContextValue;
  children: ReactNode;
}) {
  return (
    <CollapsibleContext.Provider value={props.value}>
      {props.children}
    </CollapsibleContext.Provider>
  );
}
