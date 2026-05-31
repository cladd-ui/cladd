import { createContext, useContext, ReactNode } from 'react';

/**
 * Selection state published by `Tabs` to its descendant `TabsList`, `Tab`, and `TabPanel`.
 *
 * Each reads it via `useTabsContext()` - `Tab` to derive its `active` state and wire selection, `TabPanel` to decide whether to mount.
 */
interface TabsContextValue {
  /** Currently selected tab value (`undefined` when nothing is selected). */
  value: string | undefined;
  /** Select a tab by its `value`. No-ops when the value is already selected. */
  setValue: (value: string) => void;
  /** Stable id used to wire `aria-controls`/`aria-labelledby` between tabs and panels. */
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(
      'Cladd: `TabsList`, `Tab` and `TabPanel` must be rendered inside a `Tabs` root.',
    );
  }
  return ctx;
}

export function TabsContextProvider(props: {
  value: TabsContextValue;
  children: ReactNode;
}) {
  return (
    <TabsContext.Provider value={props.value}>
      {props.children}
    </TabsContext.Provider>
  );
}

/** Id of the `Tab` button for a given value, within a `Tabs` instance. */
export const tabId = (baseId: string, value: string) =>
  `${baseId}-tab-${value}`;

/** Id of the `TabPanel` for a given value, within a `Tabs` instance. */
export const tabPanelId = (baseId: string, value: string) =>
  `${baseId}-panel-${value}`;
