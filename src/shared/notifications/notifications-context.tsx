'use client';

import type { Notification } from './notification-types';
import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead, type NotificationReadSnapshot } from './notification-service';

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
  const requestRef = useRef(0);
  const mountedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const reload = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getNotifications();
      if (!mountedRef.current || requestId !== requestRef.current) return;
      setNotice(snapshot.notice);
      setNotifications((current) => snapshot.notifications.map((notification) => ({
        ...notification,
        isRead: notification.isRead || Boolean(current.find((item) => item.id === notification.id)?.isRead),
      })));
    } catch (error) {
      if (!mountedRef.current || requestId !== requestRef.current) return;
      setNotifications([]);
      setError(error instanceof Error ? error.message : `Notifications Could Not Be Loaded`);
    } finally {
      if (mountedRef.current && requestId === requestRef.current) setLoading(false);
    }
  }, []);

  const applyReadPreferences = useCallback((snapshot: NotificationReadSnapshot) => {
    if (!mountedRef.current) return;
    setNotice(snapshot.notice);
    setNotifications((current) => current.map((notification) => ({
      ...notification,
      isRead: notification.isRead || snapshot.readIds.includes(notification.id),
    })));
  }, []);

  const markRead = useCallback(async (id: string) => {
    try { applyReadPreferences(await markNotificationRead(id)); }
    catch { if (mountedRef.current) setNotice(`Read Status Could Not Be Updated For This Visit`); }
  }, [applyReadPreferences]);

  const markAllRead = useCallback(async () => {
    try { applyReadPreferences(await markAllNotificationsRead(notifications.map(({ id }) => id))); }
    catch { if (mountedRef.current) setNotice(`Read Status Could Not Be Updated For This Visit`); }
  }, [notifications, applyReadPreferences]);

  useEffect(() => {
    mountedRef.current = true;
    void reload();
    return () => { mountedRef.current = false; requestRef.current += 1; };
  }, [reload]);

  const value = useMemo<NotificationsContextValue>(() => ({
    error,
    notice,
    reload,
    loading,
    markRead,
    markAllRead,
    notifications,
    unreadCount: loading || error ? 0 : notifications.filter(({ isRead }) => !isRead).length,
  }), [error, notice, reload, loading, markRead, markAllRead, notifications]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = () => {
  const notifications = useContext(NotificationsContext);
  if (!notifications) throw new Error(`Notifications Require A NotificationsProvider`);
  return notifications;
};