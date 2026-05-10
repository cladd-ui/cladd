import { useEffect, useState, cloneElement, ReactNode } from 'react';

/**
 * Lifecycle phases of an animated modal:
 * - `'closed'` - not mounted (or pre-mount).
 * - `'opening'` - mounted, currently animating in.
 * - `'opened'` - open, animation complete.
 * - `'closing'` - animating out, will become `'closed'` on `transitionend`.
 */
export type ModalPhase = 'closed' | 'opening' | 'opened' | 'closing';

/**
 * Wraps a single modal child to drive its animation phase from a boolean `open`.
 * Mounts the child when `open` flips to `true` (phase `'opening'`), keeps it mounted while
 * the close animation runs, then unmounts when phase reaches `'closed'`. Used internally by
 * `Popover`, `Tooltip`, `Dialog`, `Popup`, and `Toast` - you usually won't instantiate this directly.
 *
 * The wrapped child must accept `phase: ModalPhase` and `onPhaseChange: (phase: ModalPhase) => void`
 * props (this is what the `*Inner` components in this library do).
 */
export const ModalController = (props: {
  /** Desired open state. Drives the phase machine. */
  open: boolean;
  /** Fires when the controller resolves an internal phase change back into a boolean (e.g. animation completes). */
  onOpenChange?: (open: boolean) => void;
  /** Single React element accepting `phase` + `onPhaseChange`. */
  children: ReactNode;
}) => {
  const { open, onOpenChange = () => {}, children } = props;
  const [phase, setPhase] = useState<ModalPhase>('closed');

  useEffect(() => {
    if (open) {
      if (phase === 'closed' || phase === 'closing') {
        setPhase('opening');
        if (open !== true) onOpenChange(true);
      }
    } else {
      if (phase === 'opening' || phase === 'opened') {
        setPhase('closing');
      }
    }
  }, [open]);

  const onPhaseChange = (newPhase: ModalPhase) => {
    setPhase(newPhase);
    if (newPhase === 'closed') {
      if (open !== false) onOpenChange(false);
    } else if (newPhase === 'opening') {
      if (open !== true) onOpenChange(true);
    }
  };

  if (phase === 'closed') return null;
  if (!children || (Array.isArray(children) && !children.length)) return null;

  const child = (
    Array.isArray(children) ? children[0] : children
  ) as React.ReactElement<any>;
  const onPhaseChangeOriginal = child.props.onPhaseChange;
  const handlePhaseChange = (newPhase: ModalPhase) => {
    onPhaseChange(newPhase);
    if (onPhaseChangeOriginal) onPhaseChangeOriginal(newPhase);
  };
  return cloneElement(child, { phase, onPhaseChange: handlePhaseChange });
};
