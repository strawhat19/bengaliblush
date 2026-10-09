import { useAuth } from '@/shared/authContext/useAuth';
import { useEffect, useState, useCallback } from 'react';
import type { SubmissionStatus } from '@/shared/models/submissions/Submission';
import { getOwnerOverview, updateSubmissionStatus, type OwnerOverview } from '@/api/owner';

export const useOwnerDashboard = () => {
  const { user, isOwner } = useAuth();
  const [notice, setNotice] = useState(``);
  const [savingId, setSavingId] = useState(``);
  const [refreshing, setRefreshing] = useState(false);
  const [failure, setFailure] = useState<{ accountId: string; message: string } | null>(null);
  const [records, setRecords] = useState<{ accountId: string; data: OwnerOverview } | null>(null);
  const accountId = user?.id;
  const overview = records?.accountId === accountId ? records?.data ?? null : null;
  const error = failure?.accountId === accountId ? failure?.message ?? `` : ``;
  const loading = Boolean(accountId && isOwner && (refreshing || (!overview && !error)));

  const reload = useCallback(async () => {
    if (!accountId || !isOwner) return;
    setFailure(null);
    setRefreshing(true);
    try {
      setRecords({ accountId, data: await getOwnerOverview() });
    } catch {
      setFailure({ accountId, message: `Unable To Load Studio Records` });
    } finally {
      setRefreshing(false);
    }
  }, [accountId, isOwner]);

  useEffect(() => {
    let active = true;
    if (!accountId || !isOwner) return;
    void getOwnerOverview().then((data) => {
      if (active) setRecords({ accountId, data });
    }).catch(() => {
      if (active) setFailure({ accountId, message: `Unable To Load Studio Records` });
    });
    return () => { active = false; };
  }, [accountId, isOwner]);

  const saveStatus = async (kind: `contact` | `appointment`, id: string, status: SubmissionStatus) => {
    if (savingId || !accountId || !isOwner) return;
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
    } catch {
      setFailure({ accountId, message: `Unable To Update Request Status` });
    } finally {
      setSavingId(``);
    }
  };

  return { error, notice, reload, loading, overview, savingId, saveStatus };
};
