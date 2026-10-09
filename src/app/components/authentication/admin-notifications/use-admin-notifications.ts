import { useAuth } from '@/shared/authContext/useAuth';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useNotifications } from '@/shared/notifications/notifications-context';
import { getAdminNotifications, saveNotification, deleteNotification } from '@/api/notifications';
import type { NotificationInput, NotificationRecord, NotificationStatus } from '@/shared/models/notifications/Notification';

export const getNotificationInput = (record: NotificationRecord, status: NotificationStatus = record.status): NotificationInput => ({
  status,
  body: record.body,
  kind: record.kind,
  slug: record.slug,
  title: record.title,
  ...(record.link ? { link: record.link } : {}),
  ...(record.suffix ? { suffix: record.suffix } : {}),
});

export const useAdminNotifications = () => {
  const { user, isAdmin } = useAuth();
  const { reload: reloadPublic } = useNotifications();
  const scopeRef = useRef(0);
  const requestRef = useRef(0);
  const pendingRef = useRef(false);
  const [notice, setNotice] = useState(``);
  const [savingId, setSavingId] = useState(``);
  const [refreshing, setRefreshing] = useState(false);
  const [failure, setFailure] = useState<{ accountId: string; message: string } | null>(null);
  const [snapshot, setSnapshot] = useState<{ accountId: string; records: NotificationRecord[] } | null>(null);
  const accountId = user?.id;
  const records = isAdmin && snapshot?.accountId === accountId ? snapshot?.records ?? null : null;
  const error = failure?.accountId === accountId ? failure?.message ?? `` : ``;
  const loading = Boolean(accountId && isAdmin && !records && !error);

  const reload = useCallback(async () => {
    if (!accountId || !isAdmin) return;
    const request = ++requestRef.current;
    setFailure(null);
    setRefreshing(true);
    try {
      const records = await getAdminNotifications();
      if (request === requestRef.current) setSnapshot({ records, accountId });
    } catch (error) {
      if (request === requestRef.current) setFailure({ accountId, message: error instanceof Error ? error.message : `Unable To Load Notifications` });
    } finally {
      if (request === requestRef.current) setRefreshing(false);
    }
  }, [isAdmin, accountId]);

  useEffect(() => {
    void reload();
    return () => { scopeRef.current += 1; requestRef.current += 1; };
  }, [reload]);

  const runMutation = async (id: string, operation: () => Promise<void>, message: string) => {
    if (pendingRef.current || !accountId || !isAdmin) return false;
    pendingRef.current = true;
    const scope = scopeRef.current;
    setNotice(``);
    setFailure(null);
    setSavingId(id);
    try {
      await operation();
      const publicRefresh = reloadPublic();
      if (scope !== scopeRef.current) { await publicRefresh; return false; }
      setNotice(message);
      await Promise.all([reload(), publicRefresh]);
      return scope === scopeRef.current;
    } catch (error) {
      if (scope === scopeRef.current) setFailure({ accountId, message: error instanceof Error ? error.message : `Unable To Save Notification` });
      return false;
    } finally {
      pendingRef.current = false;
      if (scope === scopeRef.current) setSavingId(``);
    }
  };

  const save = (input: NotificationInput, id?: string) => runMutation(id ?? `new`, () => saveNotification(input, id), input.status === `published` ? `Notification Published` : `Draft Saved`);
  const remove = (record: NotificationRecord) => runMutation(record.id, () => deleteNotification(record.id), `Notification Deleted`);
  const changeStatus = (record: NotificationRecord) => save(getNotificationInput(record, record.status === `published` ? `draft` : `published`), record.id);

  return { save, error, notice, reload, remove, records, loading, savingId, refreshing, changeStatus };
};
