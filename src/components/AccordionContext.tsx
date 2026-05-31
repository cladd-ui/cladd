import { createContext, useContext, ReactNode } from 'react';

/**
 * Group state published by `AccordionRoot` to its `AccordionItem`s. Each item
 * derives its own open state from this and, in turn, publishes a
 * `CollapsibleContextValue` to the disclosure parts inside it.
 */
export interface AccordionContextValue {
  /** Whether the item with the given value is currently open. */
  isItemOpen: (value: string) => boolean;
  /** Toggle the item with the given value, honoring single/`multiple` mode. */
  toggleItem: (value: string) => void;
  /** Whether the whole accordion is disabled. */
  disabled: boolean;
  /** Stable id base used to wire each item's trigger and panel. */
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(
      'Cladd: `AccordionItem` must be rendered inside an `AccordionRoot`.',
    );
  }
  return ctx;
}

export function AccordionContextProvider(props: {
  value: AccordionContextValue;
  children: ReactNode;
}) {
  return (
    <AccordionContext.Provider value={props.value}>
      {props.children}
    </AccordionContext.Provider>
  );
}
