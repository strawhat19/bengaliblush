'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { Notification } from '@/shared/notifications/notification-types';
import { useNotifications } from '@/shared/notifications/notifications-context';

const useNotificationDetails = (notification: Notification) => {
  const attemptedReadId = useRef<string | null>(null);
  const { error, notice, reload, loading, markRead, notifications } = useNotifications();
  const savedNotification = notifications.find(({ id }) => id === notification.id);
  const hasSavedNotification = Boolean(savedNotification);
  const isRead = savedNotification?.isRead ?? notification.isRead;

  const retry = useCallback(async () => {
    attemptedReadId.current = null;
    await reload();
  }, [reload]);

  useEffect(() => {
    if (error || loading || isRead || !hasSavedNotification || attemptedReadId.current === notification.id) return;
    attemptedReadId.current = notification.id;
    void markRead(notification.id);
  }, [error, isRead, loading, markRead, hasSavedNotification, notification.id]);

  return { error, retry, notice, isRead, loading };
};

export default useNotificationDetails;
