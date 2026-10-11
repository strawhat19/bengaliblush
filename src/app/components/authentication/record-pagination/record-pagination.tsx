import { Fragment } from 'react';
import './record-pagination.scss';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { useRecordPagination } from '@/shared/firebase/use-record-pagination';

export type RecordPaginationProps = ReturnType<typeof useRecordPagination> & { id: string; recordType: string; isFiltered: boolean; columns?: number; disabled?: boolean; matchingRows: number };

const RecordPagination = ({ id, page, pages, columns, disabled, totalRows, recordType, isFiltered, nextCursor, canGoBack, matchingRows, goToPage, nextPage, previousPage }: RecordPaginationProps) => {
  const totalLabel = `${totalRows ?? `…`} ${recordType}`;
  const pageInfo = isFiltered ? `${matchingRows} / ${totalLabel}` : totalLabel;
  const firstVisiblePage = Math.max(1, Math.min(page - 1, pages.length - 2));
  const visiblePages = pages.filter((number, index) => index === 0 || index === pages.length - 1 || (number >= firstVisiblePage && number < firstVisiblePage + 3));
  const pagination = (
    <nav id={id} className={`bb-record-pagination`} aria-label={`Record Pages`}>
      <span role={`status`} id={`${id}-label`} className={`bb-record-pagination-label`} title={pageInfo}>{pageInfo}</span>
      {pages.length > 1 && <div id={`${id}-controls`} className={`bb-record-pagination-controls`}>
        <button type={`button`} title={`Previous Page`} aria-label={`Previous Page`} id={`${id}-previous`} disabled={disabled || !canGoBack} onClick={previousPage} className={`bb-record-pagination-button is-arrow`}><ChevronLeft size={14} aria-hidden={`true`} /></button>
        {visiblePages.map((number, index) => <Fragment key={number}>
          {index > 0 && number - visiblePages[index - 1] > 1 && <span aria-hidden={`true`} id={`${id}-ellipsis-before-${number}`} className={`bb-record-pagination-ellipsis`}>…</span>}
          <button
            type={`button`}
            disabled={disabled}
            id={`${id}-page-${number}`}
            aria-label={`Page ${number}`}
            onClick={() => goToPage(number)}
            aria-current={number === page ? `page` : undefined}
            className={`bb-record-pagination-button is-page${number === page ? ` is-active` : ``}`}
          >{number}</button>
        </Fragment>)}
        <button type={`button`} title={`Next Page`} aria-label={`Next Page`} id={`${id}-next`} disabled={disabled || nextCursor === null} onClick={nextPage} className={`bb-record-pagination-button is-arrow`}><ChevronRight size={14} aria-hidden={`true`} /></button>
      </div>}
    </nav>
  );
  return columns ? (
    <tfoot id={`${id}-footer`} className={`bb-record-pagination-footer`}>
      <tr id={`${id}-row`} className={`bb-record-pagination-row`}>
        <td colSpan={columns} id={`${id}-cell`} className={`bb-record-pagination-cell`}>{pagination}</td>
      </tr>
    </tfoot>
  ) : pagination;
};

export default RecordPagination;
