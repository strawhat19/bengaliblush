'use client';

import { useAuth } from '@/shared/authContext/useAuth';
import { useFeatureFlags } from '@/shared/featureFlags/useFeatureFlags';
import type { Notification, NotificationSnapshot } from './notification-types';
import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { subscribeNotifications, markNotificationRead, markAllNotificationsRead, type NotificationReadSnapshot } from './notification-service';

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
type NotificationWatch = { failed: boolean; ready: Promise<void>; stop: () => void; finish: () => void };

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { flags } = useFeatureFlags();
  const viewerScope = `${user?.id ?? `guest`}:${user?.role ?? `guest`}:${flags.notifications}`;
  const mountedRef = useRef(false);
  const subscriptionRef = useRef<NotificationWatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [receivedScope, setReceivedScope] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const reload = useCallback(async () => {
    if (!mountedRef.current || !flags.notifications) return;
    const previous = subscriptionRef.current;
    if (previous && !previous.failed) return previous.ready;
    previous?.stop();
    previous?.finish();
    setLoading(true);
    setError(null);
    const watch: NotificationWatch = { failed: false, stop: () => undefined, finish: () => undefined, ready: Promise.resolve() };
    watch.ready = new Promise((resolve) => { watch.finish = resolve; });
    subscriptionRef.current = watch;
    const receive = (snapshot: NotificationSnapshot) => {
      if (!mountedRef.current || subscriptionRef.current !== watch) return;
      watch.failed = false;
      setNotice(snapshot.notice);
      setReceivedScope(viewerScope);
      setLoading(false);
      setError(null);
      setNotifications((current) => {
        const readIds = new Set(current.filter((notification) => notification.isRead).map(({ id }) => id));
        return snapshot.notifications.map((notification) => ({ ...notification, isRead: notification.isRead || readIds.has(notification.id) }));
      });
      watch.finish();
    };
    const fail = (error: Error) => {
      if (!mountedRef.current || subscriptionRef.current !== watch) return;
      watch.failed = true;
      setReceivedScope(viewerScope);
      setLoading(false);
      setNotifications([]);
      setError(error.message || `Notifications Could Not Be Loaded`);
      watch.finish();
    };
    try { watch.stop = subscribeNotifications(receive, fail); }
    catch (error) { fail(error instanceof Error ? error : new Error(`Notifications Could Not Be Loaded`)); }
    return watch.ready;
  }, [flags.notifications, viewerScope]);

  const applyReadPreferences = useCallback((snapshot: NotificationReadSnapshot) => {
    if (!mountedRef.current) return;
    setNotice(snapshot.notice);
    setNotifications((current) => current.map((notification) => ({
      ...notification,
      isRead: notification.isRead || snapshot.readIds.includes(notification.id),
    })));
  }, []);

  const markRead = useCallback(async (id: string) => {
    if (!flags.notifications) return;
    try { applyReadPreferences(await markNotificationRead(id)); }
    catch { if (mountedRef.current) setNotice(`Read Status Could Not Be Updated For This Visit`); }
  }, [applyReadPreferences, flags.notifications]);

  const markAllRead = useCallback(async () => {
    if (!flags.notifications) return;
    try { applyReadPreferences(await markAllNotificationsRead(notifications.map(({ id }) => id))); }
    catch { if (mountedRef.current) setNotice(`Read Status Could Not Be Updated For This Visit`); }
  }, [notifications, applyReadPreferences, flags.notifications]);

  useEffect(() => {
    let active = true;
    mountedRef.current = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      setNotifications([]);
      setReceivedScope(null);
      setNotice(null);
      setError(null);
      setLoading(flags.notifications);
      if (flags.notifications) void reload();
    });
    return () => {
      active = false;
      mountedRef.current = false;
      subscriptionRef.current?.stop();
      subscriptionRef.current?.finish();
      subscriptionRef.current = null;
    };
  }, [reload, flags.notifications, viewerScope]);

  const scopeReady = flags.notifications && receivedScope === viewerScope;
  const value = useMemo<NotificationsContextValue>(() => ({
    reload,
    markRead,
    markAllRead,
    error: scopeReady ? error : null,
    notice: scopeReady ? notice : null,
    loading: flags.notifications && (!scopeReady || loading),
    notifications: scopeReady ? notifications : [],
    unreadCount: !scopeReady || loading || error ? 0 : notifications.filter(({ isRead }) => !isRead).length,
  }), [error, notice, reload, loading, markRead, markAllRead, notifications, scopeReady, flags.notifications]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = () => {
  const notifications = useContext(NotificationsContext);
  if (!notifications) throw new Error(`Notifications Require A NotificationsProvider`);
  return notifications;
};
