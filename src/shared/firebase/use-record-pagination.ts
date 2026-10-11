import { useState, useEffect, useCallback } from 'react';
import type { RecordPaginationIndex } from './record-pagination-index';

type PaginationState = { page: number; scope: string; nextCursor: number | null; cursors: readonly (number | undefined)[] };
const initialState = (scope: string): PaginationState => ({ page: 1, scope, nextCursor: null, cursors: [undefined] });

export const useRecordPagination = (scope: string, index?: RecordPaginationIndex) => {
  const [state, setState] = useState(() => initialState(scope));
  const current = state.scope === scope ? state : initialState(scope);
  const cursors = index?.cursors ?? current.cursors;
  const page = Math.min(current.page, cursors.length);
  const cursor = cursors[page - 1];
  const nextCursor = index ? cursors[page] ?? null : current.nextCursor;
  useEffect(() => { setState((previous) => {
    const current = previous.scope === scope ? previous : initialState(scope);
    if (!index) return current;
    const page = Math.min(current.page, index.cursors.length);
    const nextCursor = index.cursors[page] ?? null;
    if (page === current.page && nextCursor === current.nextCursor && index.cursors.length === current.cursors.length && index.cursors.every((value, cursorIndex) => value === current.cursors[cursorIndex])) return current;
    return { ...current, page, nextCursor, cursors: index.cursors };
  }); }, [scope, index]);
  const setNextCursor = useCallback((nextCursor: number | null) => setState((previous) => {
    const current = previous.scope === scope ? previous : initialState(scope);
    if (current.page !== page || current.cursors[page - 1] !== cursor) return previous;
    const cursors = nextCursor === null ? current.cursors.slice(0, page) : current.cursors[page] === nextCursor ? current.cursors : [...current.cursors.slice(0, page), nextCursor];
    if (current.nextCursor === nextCursor && cursors.length === current.cursors.length && cursors.every((value, index) => value === current.cursors[index])) return current;
    return { ...current, cursors, nextCursor };
  }), [page, scope, cursor]);
  const goToPage = useCallback((targetPage: number) => {
    if (!Number.isSafeInteger(targetPage) || targetPage < 1) return;
    setState((previous) => {
      const current = previous.scope === scope ? previous : initialState(scope);
      const cursors = index?.cursors ?? current.cursors;
      if (targetPage === current.page || targetPage > cursors.length) return previous;
      return { ...current, cursors, page: targetPage, nextCursor: index ? cursors[targetPage] ?? null : null };
    });
  }, [scope, index]);
  return {
    page,
    cursor,
    nextCursor,
    goToPage,
    setNextCursor,
    canGoBack: page > 1,
    totalRows: index?.totalRows,
    pages: cursors.map((_, index) => index + 1),
    previousPage: () => goToPage(page - 1),
    nextPage: () => { if (nextCursor !== null) goToPage(page + 1); },
  };
};
