'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type NotificationsMenuProps = {
  onOpen?: () => void;
  closeSignal?: string | number;
  onOpenChange?: (isOpen: boolean) => void;
};

export const useNotificationsMenu = ({ onOpen, closeSignal, onOpenChange }: NotificationsMenuProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  const toggle = () => {
    if (open) { close(); return; }
    onOpen?.();
    setOpen(true);
  };

  useEffect(() => {
    setOpen(false);
  }, [closeSignal]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus({ preventScroll: true });

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === `Escape`) {
        event.preventDefault();
        close();
      }
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      close(false);
    };

    document.addEventListener(`keydown`, closeOnEscape);
    document.addEventListener(`pointerdown`, closeOnOutsideClick);

    return () => {
      document.removeEventListener(`keydown`, closeOnEscape);
      document.removeEventListener(`pointerdown`, closeOnOutsideClick);
    };
  }, [open, close]);

  return { open, close, toggle, panelRef, buttonRef, closeButtonRef };
};
