import { useAuth } from '@/shared/authContext/useAuth';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useRecordPagination } from '@/shared/firebase/use-record-pagination';
import { subscribeAdminNotifications, saveNotification, deleteNotification } from '@/api/notifications';
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
  const scopeRef = useRef(0);
  const requestRef = useRef(0);
  const pendingRef = useRef(false);
  const pagination = useRecordPagination(JSON.stringify([user?.id, `notifications`]));
  const { cursor, setNextCursor } = pagination;
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState(``);
  const [savingId, setSavingId] = useState(``);
  const [refreshing, setRefreshing] = useState(false);
  const [failure, setFailure] = useState<{ accountId: string; message: string } | null>(null);
  const [snapshot, setSnapshot] = useState<{ accountId: string; records: NotificationRecord[] } | null>(null);
  const accountId = user?.id;
  const records = isAdmin && snapshot?.accountId === accountId ? snapshot?.records ?? null : null;
  const error = failure?.accountId === accountId ? failure?.message ?? `` : ``;
  const loading = Boolean(accountId && isAdmin && !records && !error);

  const reload = useCallback(async () => { setRevision((current) => current + 1); }, []);

  useEffect(() => {
    if (!accountId || !isAdmin) return;
    const request = ++requestRef.current;
    let unsubscribe: (() => void) | undefined;
    setSnapshot(null);
    setFailure(null);
    setRefreshing(true);
    const onError = (error: Error) => {
      if (request !== requestRef.current) return;
      setFailure({ accountId, message: error.message });
      setRefreshing(false);
    };
    void subscribeAdminNotifications((records, nextCursor) => {
      if (request !== requestRef.current) return;
      setSnapshot({ records, accountId });
      setNextCursor(nextCursor);
      setRefreshing(false);
    }, onError, cursor).then((stop) => {
      if (request === requestRef.current) unsubscribe = stop;
      else stop();
    }).catch(onError);
    return () => { scopeRef.current += 1; requestRef.current += 1; unsubscribe?.(); };
  }, [cursor, isAdmin, revision, accountId, setNextCursor]);

  const runMutation = async (id: string, operation: () => Promise<void>, message: string) => {
    if (pendingRef.current || !accountId || !isAdmin) return false;
    pendingRef.current = true;
    const scope = scopeRef.current;
    setNotice(``);
    setFailure(null);
    setSavingId(id);
    try {
      await operation();
      if (scope !== scopeRef.current) return false;
      setNotice(message);
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

  return { save, error, notice, reload, remove, records, loading, savingId, refreshing, pagination, changeStatus };
};
