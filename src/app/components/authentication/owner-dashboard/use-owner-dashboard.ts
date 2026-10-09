import { useAuth } from '@/shared/authContext/useAuth';
import { getAdminNotifications } from '@/api/notifications';
import { useRef, useEffect, useState, useCallback } from 'react';
import { getCommerceOverview, type CommerceOverview } from '@/api/commerce';
import type { SubmissionStatus } from '@/shared/models/submissions/Submission';
import type { NotificationRecord } from '@/shared/models/notifications/Notification';
import { getOwnerOverview, updateSubmissionStatus, type OwnerOverview } from '@/api/owner';

export const useOwnerDashboard = (includeOverviewRecords = true) => {
  const { user, isAdmin } = useAuth();
  const requestRef = useRef(0);
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

  const reload = useCallback(async () => {
    if (!accountId || !isAdmin) return;
    const request = ++requestRef.current;
    setFailure(null);
    setRefreshing(true);
    try {
      const [data, commerce, notifications] = await Promise.all([
        getOwnerOverview(),
        includeOverviewRecords ? getCommerceOverview() : Promise.resolve(null),
        includeOverviewRecords ? getAdminNotifications() : Promise.resolve([]),
      ]);
      if (request === requestRef.current) setRecords({ data, commerce, notifications, accountId, loadedAt: new Date().toISOString() });
    } catch (error) {
      if (request === requestRef.current) setFailure({ accountId, message: error instanceof Error ? error.message : `Unable To Load Studio Records` });
    } finally {
      if (request === requestRef.current) setRefreshing(false);
    }
  }, [isAdmin, accountId, includeOverviewRecords]);

  useEffect(() => {
    void reload();
    return () => { requestRef.current += 1; };
  }, [reload]);

  const saveStatus = async (kind: `contact` | `appointment`, id: string, status: SubmissionStatus) => {
    if (savingId || !accountId || !isAdmin) return;
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

  return { error, notice, reload, loading, loadedAt, overview, commerce, savingId, refreshing, saveStatus, notifications };
};
