import { useEffect, RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'audio[controls]',
  'video[controls]',
  'iframe',
  'object',
  'embed',
  'summary',
].join(',');

const isVisible = (el: HTMLElement) => {
  if (el.hidden) return false;
  if ((el as HTMLInputElement).disabled) return false;
  if (el.getAttribute('aria-hidden') === 'true') return false;
  if (typeof el.checkVisibility === 'function') return el.checkVisibility();
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
};

const getFocusable = (container: HTMLElement): HTMLElement[] => {
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  );
  return nodes.filter(isVisible);
};

export const useFocusTrap = ({
  active,
  containerRef,
  initialFocusRef,
  restoreFocus = true,
  setInitialFocus = true,
}: {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  restoreFocus?: boolean;
  setInitialFocus?: boolean;
}) => {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusInitial = () => {
      const initial = initialFocusRef?.current;

      if (initial && container.contains(initial)) {
        initial.focus();
        return;
      }
      const focusables = getFocusable(container);
      if (focusables.length > 0) {
        focusables[0].focus();
        return;
      }
      if (!container.hasAttribute('tabindex')) {
        container.setAttribute('tabindex', '-1');
      }
      container.focus();
    };

    if (!container.contains(document.activeElement) && setInitialFocus) {
      focusInitial();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!container.isConnected) return;

      // Only trap if this container is the topmost modal layer
      const allModals = document.querySelectorAll(
        '.cladd-dialog, .cladd-popup',
      );
      if (allModals.length > 0) {
        const lastModal = allModals[allModals.length - 1];
        if (lastModal !== container && !container.contains(lastModal)) return;
      }

      const focusables = getFocusable(container);
      if (focusables.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (activeEl === first || !container.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (activeEl === last || !container.contains(activeEl)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (
        restoreFocus &&
        previouslyFocused &&
        typeof previouslyFocused.focus === 'function' &&
        document.contains(previouslyFocused)
      ) {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef, initialFocusRef, restoreFocus]);
};
