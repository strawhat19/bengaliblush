import { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/shared/authContext/useAuth';
import type { EventInput, EventRecord } from '@/api/events';
import { useRecordPagination } from '@/shared/firebase/use-record-pagination';
import type { RecordPaginationIndex } from '@/shared/firebase/record-pagination-index';
import { saveEvent, subscribeAdminEvents, subscribeAdminEventPagination } from '@/api/events';

export const useAdminEvents = () => {
  const { user, isAdmin } = useAuth();
  const accountId = user?.id;
  const scopeRef = useRef(0);
  const requestRef = useRef(0);
  const pendingRef = useRef(false);
  const [notice, setNotice] = useState(``);
  const [savingId, setSavingId] = useState(``);
  const [saveError, setSaveError] = useState(``);
  const [refreshing, setRefreshing] = useState(false);
  const [failure, setFailure] = useState<{ accountId: string; message: string } | null>(null);
  const [indexFailure, setIndexFailure] = useState<{ accountId: string; message: string } | null>(null);
  const [pageIndex, setPageIndex] = useState<{ accountId: string; index: RecordPaginationIndex } | null>(null);
  const [snapshot, setSnapshot] = useState<{ accountId: string; records: EventRecord[] } | null>(null);
  const index = isAdmin && pageIndex?.accountId === accountId ? pageIndex?.index : undefined;
  const pagination = useRecordPagination(JSON.stringify([accountId, `events`]), index, indexFailure?.accountId === accountId ? indexFailure?.message ?? `` : ``);
  const { cursor, setNextCursor } = pagination;
  const records = isAdmin && snapshot?.accountId === accountId ? snapshot?.records ?? null : null;
  const loadError = failure?.accountId === accountId ? failure?.message ?? `` : ``;
  const error = saveError || loadError || (indexFailure?.accountId === accountId ? indexFailure?.message ?? `` : ``);
  const loading = Boolean(accountId && isAdmin && !records && !loadError);

  useEffect(() => () => { scopeRef.current += 1; }, [isAdmin, accountId]);

  useEffect(() => {
    if (!accountId || !isAdmin) return;
    let active = true;
    let unsubscribe: (() => void) | undefined;
    setPageIndex(null);
    setIndexFailure(null);
    const onError = (error: Error) => {
      if (!active) return;
      setPageIndex(null);
      setIndexFailure({ accountId, message: error.message });
    };
    void subscribeAdminEventPagination((index) => {
      if (!active) return;
      setPageIndex({ index, accountId });
      setIndexFailure(null);
    }, onError).then((stop) => {
      if (active) unsubscribe = stop;
      else stop();
    }).catch(onError);
    return () => { active = false; unsubscribe?.(); };
  }, [isAdmin, accountId]);

  useEffect(() => {
    if (!accountId || !isAdmin) return;
    const request = ++requestRef.current;
    let unsubscribe: (() => void) | undefined;
    setSnapshot(null);
    setFailure(null);
    setSaveError(``);
    setRefreshing(true);
    const onError = (error: Error) => {
      if (request !== requestRef.current) return;
      setFailure({ accountId, message: error.message });
      setRefreshing(false);
    };
    void subscribeAdminEvents((records, nextCursor) => {
      if (request !== requestRef.current) return;
      setFailure(null);
      setSnapshot({ records, accountId });
      setNextCursor(nextCursor);
      setRefreshing(false);
    }, onError, cursor).then((stop) => {
      if (request === requestRef.current) unsubscribe = stop;
      else stop();
    }).catch(onError);
    return () => { requestRef.current += 1; unsubscribe?.(); };
  }, [cursor, isAdmin, accountId, setNextCursor]);

  const save = async (input: EventInput, id?: string) => {
    if (pendingRef.current || !accountId || !isAdmin) return false;
    pendingRef.current = true;
    const scope = scopeRef.current;
    setNotice(``);
    setSaveError(``);
    setSavingId(id ?? `new`);
    try {
      await saveEvent(input, id);
      if (scope !== scopeRef.current) return false;
      setNotice(`Event Saved`);
      return true;
    } catch (error) {
      if (scope === scopeRef.current) setSaveError(error instanceof Error ? error.message : `Unable To Save Event`);
      return false;
    } finally {
      pendingRef.current = false;
      if (scope === scopeRef.current) setSavingId(``);
    }
  };

  return { save, error, notice, records, loading, savingId, refreshing, pagination };
};
