import { useEffect, useRef, useState } from 'react';

import { ModalPhase } from '../components/ModalController';
import { nextTick } from './next-tick';

export const useModalUtils = ({
  phase,
  onPhaseChange = () => {},

  lazy,
  onClose = () => {},
  onClosed = () => {},
  onOpen = () => {},
  onOpened = () => {},
  transitionEndElRef,
  closeOnEscape = true,
}: {
  phase: ModalPhase;
  onPhaseChange?: (phase: ModalPhase) => void;
  lazy?: boolean;
  onClose?: () => void;
  onClosed?: () => void;
  onOpen?: (el?: HTMLElement) => void;
  onOpened?: (el?: HTMLElement) => void;
  transitionEndElRef?: React.RefObject<HTMLElement | null>;
  closeOnEscape?: boolean | (() => boolean);
}) => {
  const initiallyOpenedRef = useRef(false);
  const [opened, setOpened] = useState(false);
  const closedFiredRef = useRef(false);

  // Keep latest phase/callbacks in refs so the unmount cleanup always uses current values
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const callbacksRef = useRef({ onPhaseChange, onClosed });
  callbacksRef.current = { onPhaseChange, onClosed };

  const fireClosed = () => {
    if (closedFiredRef.current) return;
    closedFiredRef.current = true;
    callbacksRef.current.onPhaseChange('closed');
    callbacksRef.current.onClosed();
  };

  const close = () => {
    setOpened(false);
    onClose();
    onPhaseChange('closing');
  };

  const open = () => {
    closedFiredRef.current = false;
    initiallyOpenedRef.current = true;
    if (lazy) {
      nextTick(() => setOpened(true));
    } else {
      setOpened(true);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (closeOnEscape === false) return;
      if (typeof closeOnEscape === 'function' && !closeOnEscape()) return;
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };

  const onTransitionEnd = (e: TransitionEvent) => {
    if (!transitionEndElRef) return;
    if (!transitionEndElRef.current || e.target !== transitionEndElRef.current)
      return;
    if (phase === 'closing') {
      fireClosed();
    }
    if (phase === 'opening' || phase === 'opened') {
      onOpened(transitionEndElRef.current);
      if (phase === 'opening') {
        onPhaseChange('opened');
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    const el = transitionEndElRef?.current;
    if (el) {
      if (!el.checkVisibility()) {
        onTransitionEnd({ target: el } as unknown as TransitionEvent);
      } else {
        el.addEventListener('transitionend', onTransitionEnd);
      }
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (el) {
        el.removeEventListener('transitionend', onTransitionEnd);
      }
    };
  });
  useEffect(() => {
    if (opened) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() =>
          onOpen(transitionEndElRef?.current || undefined),
        );
      });
    }
  }, [opened]);
  useEffect(() => {
    if (phase === 'closing') {
      if (opened) {
        setOpened(false);
        onClose();
      }
    } else if (phase === 'opening' || phase === 'opened') {
      if (!opened && initiallyOpenedRef.current) {
        open();
      }
    }
  }, [phase]);

  // If the component is unmounted while still closing (e.g. a parent popover
  // finished closing first and ripped this one out of the DOM before its own
  // transitionend could fire), synthetically flip external state to closed.
  useEffect(() => {
    return () => {
      if (phaseRef.current === 'closing') {
        fireClosed();
      }
    };
  }, []);

  return { opened, close, open };
};
