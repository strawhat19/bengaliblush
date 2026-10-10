import { useState, useCallback } from 'react';

type PaginationState = { scope: string; cursors: number[]; nextCursor: number | null };
const initialState = (scope: string): PaginationState => ({ scope, cursors: [], nextCursor: null });

export const useRecordPagination = (scope: string) => {
  const [state, setState] = useState(() => initialState(scope));
  const current = state.scope === scope ? state : initialState(scope);
  const setNextCursor = useCallback((nextCursor: number | null) => setState((previous) => {
    const current = previous.scope === scope ? previous : initialState(scope);
    return current.nextCursor === nextCursor ? current : { ...current, nextCursor };
  }), [scope]);
  return {
    nextCursor: current.nextCursor,
    page: current.cursors.length + 1,
    cursor: current.cursors.at(-1),
    canGoBack: current.cursors.length > 0,
    setNextCursor,
    previousPage: () => setState({ scope, nextCursor: null, cursors: current.cursors.slice(0, -1) }),
    nextPage: () => { if (current.nextCursor !== null) setState({ scope, nextCursor: null, cursors: [...current.cursors, current.nextCursor] }); },
  };
};
