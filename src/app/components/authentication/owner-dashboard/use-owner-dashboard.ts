import { useAuth } from '@/shared/authContext/useAuth';
import { subscribeAdminNotifications } from '@/api/notifications';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useRecordPagination } from '@/shared/firebase/use-record-pagination';
import { subscribeCommerceOverview, type CommerceOverview } from '@/api/commerce';
import type { SubmissionStatus } from '@/shared/models/submissions/Submission';
import type { NotificationRecord } from '@/shared/models/notifications/Notification';
import { subscribeOwnerOverview, updateSubmissionStatus, type OwnerOverview } from '@/api/owner';

export const useOwnerDashboard = (section: `overview` | keyof OwnerOverview = `overview`) => {
  const { user, isAdmin } = useAuth();
  const requestRef = useRef(0);
  const pagination = useRecordPagination(JSON.stringify([user?.id, section]));
  const { cursor, setNextCursor } = pagination;
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState(``);
  const [savingId, setSavingId] = useState(``);
  const [refreshing, setRefreshing] = useState(false);
  const [failure, setFailure] = useState<{ accountId: string; message: string } | null>(null);
  const [records, setRecords] = useState<{ accountId: string; loadedAt: string; data: OwnerOverview; commerce: CommerceOverview | null; notifications: NotificationRecord[] } | null>(null);
  const accountId = user?.id;
  const overview = records?.accountId === accountId && isAdmin ? records?.data ?? null : null;
  const commerce = overview ? records?.commerce ?? null : null;
  const notifications = overview ? records?.notifications ?? [] : [];
  const loadedAt = overview ? records?.loadedAt ?? `` : ``;
  const error = failure?.accountId === accountId ? failure?.message ?? `` : ``;
  const loading = Boolean(accountId && isAdmin && !overview && !error);

  const reload = useCallback(async () => { setRevision((current) => current + 1); }, []);

  useEffect(() => {
    if (!accountId || !isAdmin) return;
    const request = ++requestRef.current;
    const subscriptions: (() => void)[] = [];
    const ready = new Set<string>();
    let data: OwnerOverview | null = null;
    let commerce: CommerceOverview | null = null;
    let notifications: NotificationRecord[] = [];
    setRecords(null);
    setFailure(null);
    setRefreshing(true);
    const onError = (error: Error) => {
      if (request !== requestRef.current) return;
      setFailure({ accountId, message: error.message });
      setRefreshing(false);
    };
    const saveSnapshot = (key: string) => {
      if (request !== requestRef.current) return;
      ready.add(key);
      if (!data || ready.size !== (section === `overview` ? 3 : 1)) return;
      setRecords({ data, commerce, notifications, accountId, loadedAt: new Date().toISOString() });
      setRefreshing(false);
    };
    const attach = (operation: Promise<() => void>) => {
      void operation.then((stop) => {
        if (request === requestRef.current) subscriptions.push(stop);
        else stop();
      }).catch(onError);
    };
    attach(subscribeOwnerOverview((snapshot, nextCursor) => {
      if (request !== requestRef.current) return;
      data = snapshot;
      setNextCursor(nextCursor);
      saveSnapshot(`owner`);
    }, onError, section === `overview` ? undefined : section, cursor));
    if (section === `overview`) {
      attach(subscribeCommerceOverview((snapshot) => { if (request === requestRef.current) { commerce = snapshot; saveSnapshot(`commerce`); } }, onError));
      attach(subscribeAdminNotifications((snapshot) => { if (request === requestRef.current) { notifications = snapshot; saveSnapshot(`notifications`); } }, onError));
    }
    return () => { requestRef.current += 1; subscriptions.forEach((stop) => stop()); };
  }, [cursor, isAdmin, section, revision, accountId, setNextCursor]);

  const saveStatus = async (kind: `contact` | `appointment`, id: string, status: SubmissionStatus) => {
    if (savingId || !accountId || !isAdmin) return;
    const currentStatus = kind === `contact` ? overview?.contacts.find((record) => record.id === id)?.status : overview?.appointments.find((record) => record.id === id)?.status;
    if (currentStatus === status) return;
    setFailure(null);
    setNotice(``);
    setSavingId(id);
    try {
      await updateSubmissionStatus(kind, id, status);
      setRecords((current) => {
        if (!current || current.accountId !== accountId) return current;
        const data = kind === `contact`
          ? { ...current.data, contacts: current.data.contacts.map((record) => record.id === id ? { ...record, status } : record) }
          : { ...current.data, appointments: current.data.appointments.map((record) => record.id === id ? { ...record, status } : record) };
        return { ...current, data };
      });
      setNotice(`Request Status Updated`);
    } catch (error) {
      setFailure({ accountId, message: error instanceof Error ? error.message : `Unable To Update Request Status` });
    } finally {
      setSavingId(``);
    }
  };

  return { error, notice, reload, loading, loadedAt, overview, commerce, savingId, refreshing, pagination, saveStatus, notifications };
};
