import { usePathname } from 'next/navigation';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import { useRef, useState, useEffect, useCallback } from 'react';

type ProfileMenuProps = {
  closeSignal: string;
  onOpen?: () => void;
  onOpenChange?: (open: boolean) => void;
};

export const useProfileMenu = ({ onOpen, closeSignal, onOpenChange }: ProfileMenuProps) => {
  const pathname = usePathname()?.replace(/\/+$/, ``) || `/`;
  const guestAction = [siteRoutes.signin.href, ...siteRoutes.signin.aliases].includes(pathname) ? `sign-up` : `sign-in`;
  const guestRoute = guestAction === `sign-up` ? siteRoutes.signup : siteRoutes.signin;
  const [openSignal, setOpenSignal] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [failedPhotoUrl, setFailedPhotoUrl] = useState(``);
  const controlRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, error, loading, isAdmin, isOwner, signOut } = useAuth();
  const photoUrl = user?.photo_url && failedPhotoUrl !== user.photo_url ? user.photo_url : ``;
  const handlePhotoError = () => setFailedPhotoUrl(photoUrl);
  const visible = openSignal === closeSignal && Boolean(user);
  const close = useCallback(() => setOpenSignal(null), []);

  useEffect(() => {
    onOpenChange?.(visible);
  }, [visible, onOpenChange]);

  useEffect(() => {
    if (!visible) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !controlRef.current?.contains(event.target)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== `Escape`) return;
      close();
      buttonRef.current?.focus();
    };
    document.addEventListener(`pointerdown`, onPointerDown);
    document.addEventListener(`keydown`, onKeyDown);
    return () => {
      document.removeEventListener(`pointerdown`, onPointerDown);
      document.removeEventListener(`keydown`, onKeyDown);
    };
  }, [close, visible]);

  const toggle = () => {
    if (!visible) onOpen?.();
    setOpenSignal(visible ? null : closeSignal);
  };
  const handleSignOut = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signOut();
      close();
    } catch {
      buttonRef.current?.focus();
    } finally {
      setBusy(false);
    }
  };

  return { user, busy, error, close, toggle, loading, isAdmin, isOwner, photoUrl, buttonRef, guestRoute, guestAction, controlRef, handleSignOut, handlePhotoError, open: visible };
};

export type { ProfileMenuProps };
