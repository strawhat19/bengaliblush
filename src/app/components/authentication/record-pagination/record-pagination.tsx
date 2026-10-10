import './record-pagination.scss';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { useRecordPagination } from '@/shared/firebase/use-record-pagination';

type RecordPaginationProps = ReturnType<typeof useRecordPagination> & { id: string; disabled?: boolean };

const RecordPagination = ({ id, page, disabled, nextCursor, canGoBack, nextPage, previousPage }: RecordPaginationProps) => (
  <nav id={id} className={`bb-record-pagination`} aria-label={`Record Pages`}>
    <button type={`button`} id={`${id}-previous`} disabled={disabled || !canGoBack} onClick={previousPage} className={`bb-button bb-button-outline-dark`}><ArrowLeft size={14} aria-hidden={`true`} />Previous</button>
    <span id={`${id}-label`} className={`bb-record-pagination-label`} role={`status`}>Page {page} · Search, Filters, And Counts Apply To This Page</span>
    <button type={`button`} id={`${id}-next`} disabled={disabled || nextCursor === null} onClick={nextPage} className={`bb-button bb-button-outline-dark`}>Next<ArrowRight size={14} aria-hidden={`true`} /></button>
  </nav>
);

export default RecordPagination;
