'use client';

import type { Notification, NotificationSnapshot } from '@/shared/notifications/notification-types';
import { createContext, useContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/shared/notifications/notification-service';

type NotificationsContextValue = {
  loading: boolean;
  error: string | null;
  unreadCount: number;
  notice: string | null;
  reload: () => Promise<void>;
  notifications: Notification[];
  markAllRead: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const applySnapshot = useCallback((snapshot: NotificationSnapshot) => {
    setError(null);
    setNotice(snapshot.notice);
    setNotifications(snapshot.notifications);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      applySnapshot(await getNotifications());
    } catch {
      setError(`Notifications could not be loaded`);
    } finally {
      setLoading(false);
    }
  }, [applySnapshot]);

  const markRead = useCallback(async (id: string) => {
    try {
      applySnapshot(await markNotificationRead(id));
    } catch {
      setError(`This notification could not be marked as read`);
    }
  }, [applySnapshot]);

  const markAllRead = useCallback(async () => {
    try {
      applySnapshot(await markAllNotificationsRead());
    } catch {
      setError(`Notifications could not be marked as read`);
    }
  }, [applySnapshot]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo<NotificationsContextValue>(() => ({
    error,
    notice,
    reload,
    loading,
    markRead,
    markAllRead,
    notifications,
    unreadCount: notifications.filter(({ isRead }) => !isRead).length,
  }), [error, notice, reload, loading, markRead, markAllRead, notifications]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = () => {
  const notifications = useContext(NotificationsContext);
  if (!notifications) throw new Error(`Notifications need a NotificationsProvider`);
  return notifications;
};
