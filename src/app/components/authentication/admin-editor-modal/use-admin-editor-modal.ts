import { useRef, useState, useEffect } from 'react';

export const useAdminEditorModal = (onClose: () => void) => {
  const closingRef = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    const scrollbarGutter = root.style.scrollbarGutter;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    root.style.scrollbarGutter = `stable`;
    root.style.overflow = `hidden`;
    dialog.showModal();
    dialog.querySelector<HTMLElement>(`input:not(:disabled), select:not(:disabled), textarea:not(:disabled)`)?.focus({ preventScroll: true });
    let openingFrame = window.requestAnimationFrame(() => {
      openingFrame = window.requestAnimationFrame(() => { if (!closingRef.current) setExpanded(true); });
    });
    return () => {
      window.cancelAnimationFrame(openingFrame);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      if (dialog.open) dialog.close();
      root.style.overflow = overflow;
      root.style.scrollbarGutter = scrollbarGutter;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  const dismiss = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setExpanded(false);
    setClosing(true);
    const duration = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? 0 : 680;
    closeTimerRef.current = window.setTimeout(() => {
      dialogRef.current?.close();
      onClose();
    }, duration);
  };

  return { closing, dismiss, expanded, dialogRef };
};
