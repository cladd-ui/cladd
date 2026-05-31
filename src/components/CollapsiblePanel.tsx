import {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  Ref,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { useCollapsibleContext } from './CollapsibleContext';

// Measure and set heights before the browser paints on the client; degrade to a
// passive effect during SSR, where layout effects warn and there's nothing to
// measure anyway.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface CollapsiblePanelOwnProps<C extends ElementType = 'div'> {
  /**
   * Panel content. Put block padding on a **nested** element - the panel itself animates its `height` to zero, so vertical padding on it would keep it from fully collapsing.
   */
  children?: ReactNode;
  /** Extra classes for the panel root. */
  className?: string;
  /**
   * Keep the panel mounted (at `height: 0`) while collapsed instead of unmounting it - preserves internal state and scroll position.
   *
   * Default `false`: the panel still animates closed, then unmounts once the animation finishes.
   */
  keepMounted?: boolean;
  /** Polymorphic root element. Defaults to `'div'`. */
  as?: C;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
}

export type CollapsiblePanelProps<C extends ElementType = 'div'> =
  CollapsiblePanelOwnProps<C> &
    Omit<ComponentPropsWithoutRef<C>, keyof CollapsiblePanelOwnProps<C>>;

/** Shape of `CollapsiblePanel` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type CollapsiblePanelDefaultProps = Partial<
  Omit<CollapsiblePanelOwnProps, 'as' | 'ref' | 'children'>
>;

/**
 * The collapsible content region. Renders a single element whose `height`
 * animates between `0` and its measured natural height (`scrollHeight`),
 * settling on `auto` while open so it reflows with its content. Carries the
 * `region` role and aria wiring back to its trigger, and a `data-open`
 * attribute for styling.
 *
 * Honors `prefers-reduced-motion` (snaps instantly) and skips the animation on
 * first mount.
 */
export const CollapsiblePanel = <C extends ElementType = 'div'>(
  props: CollapsiblePanelProps<C>,
) => {
  const { open, panelId, triggerId } = useCollapsibleContext();
  const {
    children,
    className = '',
    keepMounted = false,
    as: Component = 'div' as ElementType<any>,
    ref,
    ...rest
  } = useComponentDefaults('CollapsiblePanel', props);

  const elRef = useRef<HTMLElement | null>(null);
  const [rendered, setRendered] = useState(open || keepMounted);
  const mounted = useRef(false);
  const prevOpen = useRef(open);

  // Mount the element when opening so its content can be measured and animated.
  useEffect(() => {
    if (open && !rendered) setRendered(true);
  }, [open, rendered]);

  useEffect(() => {
    mounted.current = true;
  }, []);

  useIsomorphicLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Very first paint: settle to the resting height without animating.
    if (!mounted.current) {
      prevOpen.current = open;
      el.style.height = open ? 'auto' : '0px';
      return;
    }

    if (prevOpen.current === open) return;
    prevOpen.current = open;

    const reduce =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    const onEnd = (e: TransitionEvent) => {
      if (e.target !== el || e.propertyName !== 'height') return;
      el.removeEventListener('transitionend', onEnd);
      if (open) el.style.height = 'auto';
      else if (!keepMounted) setRendered(false);
    };

    if (open) {
      const target = el.scrollHeight;
      if (reduce || target === 0) {
        el.style.height = 'auto';
        return;
      }
      el.style.height = '0px';
      void el.offsetHeight; // force reflow so the next change transitions
      el.addEventListener('transitionend', onEnd);
      raf = requestAnimationFrame(() => {
        el.style.height = `${target}px`;
      });
    } else {
      const current = el.scrollHeight;
      if (reduce || current === 0) {
        el.style.height = '0px';
        if (!keepMounted) setRendered(false);
        return;
      }
      el.style.height = `${current}px`;
      void el.offsetHeight;
      el.addEventListener('transitionend', onEnd);
      raf = requestAnimationFrame(() => {
        el.style.height = '0px';
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('transitionend', onEnd);
    };
  }, [open, rendered, keepMounted]);

  if (!rendered) return null;

  const setRefs = (node: HTMLElement | null) => {
    elRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as RefObject<HTMLElement | null>).current = node;
  };

  return (
    <Component
      ref={setRefs}
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      inert={!open || undefined}
      data-open={open || undefined}
      className={cn(
        'cladd-collapsible-panel box-border block overflow-hidden transition-[height] duration-200 ease-out motion-reduce:transition-none',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
