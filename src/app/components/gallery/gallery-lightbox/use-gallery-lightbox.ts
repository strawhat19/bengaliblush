import type { GalleryImage } from '@/shared/models/gallery/Gallery';
import { useRef, useState, useEffect, type KeyboardEvent, type PointerEvent } from 'react';

export type GalleryLightboxProps = {
  initialId: string;
  onClose: () => void;
  images: GalleryImage[];
};

export const useGalleryLightbox = ({ images, initialId, onClose }: GalleryLightboxProps) => {
  const closingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const backdropPressRef = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<{ x: number; y: number; id: number } | null>(null);
  const [closing, setClosing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [loadedImageId, setLoadedImageId] = useState(``);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedId, setSelectedId] = useState(initialId);
  const index = Math.max(0, images.findIndex((image) => image.id === selectedId));
  const currentImage = images?.[index];
  const canNavigate = images.length > 1;
  const nextImage = canNavigate && loadedImageId === currentImage?.id ? images?.[(index + 1) % images.length] : undefined;

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const updatePreference = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    const updateVisibility = () => setVisible(!document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener(`change`, updatePreference);
    document.addEventListener(`visibilitychange`, updateVisibility);
    return () => {
      preference.removeEventListener(`change`, updatePreference);
      document.removeEventListener(`visibilitychange`, updateVisibility);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const body = document.body;
    const root = document.documentElement;
    const overflow = body.style.overflow;
    const paddingRight = body.style.paddingRight;
    const rootOverflow = root.style.overflow;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const bodyPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    body.style.paddingRight = `${bodyPadding + scrollbarWidth}px`;
    body.style.overflow = `hidden`;
    root.style.overflow = `hidden`;
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>(`.bb-gallery-lightbox-close`)?.focus({ preventScroll: true });
    let openingFrame = window.requestAnimationFrame(() => {
      openingFrame = window.requestAnimationFrame(() => { if (!closingRef.current) setExpanded(true); });
    });
    return () => {
      window.cancelAnimationFrame(openingFrame);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      if (dialog.open) dialog.close();
      body.style.overflow = overflow;
      body.style.paddingRight = paddingRight;
      root.style.overflow = rootOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const strip = thumbnailStripRef.current;
    const thumbnail = activeThumbnailRef.current;
    if (!strip || !thumbnail) return;
    const left = thumbnail.offsetLeft - (strip.clientWidth - thumbnail.offsetWidth) / 2;
    strip.scrollTo({ left, behavior: reducedMotion ? `auto` : `smooth` });
  }, [currentImage?.id, reducedMotion]);

  useEffect(() => {
    if (!playing || !visible || reducedMotion || closing || !canNavigate) return;
    const timer = window.setInterval(() => {
      setSelectedId((current) => {
        const nextIndex = (Math.max(0, images.findIndex((image) => image.id === current)) + 1) % images.length;
        return images?.[nextIndex]?.id ?? current;
      });
    }, 4_000);
    return () => window.clearInterval(timer);
  }, [images, playing, visible, closing, canNavigate, reducedMotion]);

  const dismiss = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setExpanded(false);
    setClosing(true);
    setPlaying(false);
    const duration = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? 0 : 460;
    closeTimerRef.current = window.setTimeout(() => {
      dialogRef.current?.close();
      onCloseRef.current();
    }, duration);
  };
  const selectImage = (id: string) => {
    if (closingRef.current) return;
    setPlaying(false);
    setSelectedId(id);
  };
  const moveImage = (direction: number) => {
    const nextIndex = (index + direction + images.length) % images.length;
    const nextImage = images?.[nextIndex];
    if (nextImage) selectImage(nextImage.id);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || !images.length || closingRef.current) return;
    if (![`ArrowLeft`, `ArrowRight`, `Home`, `End`].includes(event.key)) return;
    event.preventDefault();
    if (event.key === `ArrowLeft`) moveImage(-1);
    if (event.key === `ArrowRight`) moveImage(1);
    const boundaryImage = event.key === `Home` ? images?.[0] : event.key === `End` ? images?.[images.length - 1] : undefined;
    if (boundaryImage) selectImage(boundaryImage.id);
  };
  const beginSwipe = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === `mouse` || !canNavigate) return;
    swipeRef.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start || start.id !== event.pointerId) return;
    const horizontal = event.clientX - start.x;
    const vertical = event.clientY - start.y;
    if (Math.abs(horizontal) > 48 && Math.abs(horizontal) > Math.abs(vertical) * 1.2) moveImage(horizontal < 0 ? 1 : -1);
  };
  const cancelSwipe = () => { swipeRef.current = null; };
  const markImageLoaded = (id: string) => { if (!closingRef.current) setLoadedImageId(id); };
  const togglePlaying = () => { if (!closingRef.current && !reducedMotion && canNavigate) setPlaying((current) => !current); };

  return { index, closing, playing, dismiss, expanded, nextImage, dialogRef, beginSwipe, finishSwipe, cancelSwipe, selectImage, moveImage, currentImage, canNavigate, reducedMotion, markImageLoaded, handleKeyDown, togglePlaying, backdropPressRef, activeThumbnailRef, thumbnailStripRef };
};
