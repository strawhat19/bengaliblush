'use client';

import type { ReactNode } from 'react';
import type { ProductRecord } from '@/shared/models/commerce/Commerce';
import '@/app/components/authentication/admin-commerce/admin-commerce.scss';
import type { EditableCommerceRecord } from '@/app/components/authentication/admin-commerce/commerce-data';
import CommerceRecordRow from '@/app/components/authentication/admin-commerce/commerce-record-row/commerce-record-row';

type ProductStoreTableProps = {
  busy?: boolean;
  preview?: boolean;
  idPrefix: string;
  children?: ReactNode;
  records: ProductRecord[];
  onEdit?: (record: EditableCommerceRecord) => void;
  onStatus?: (record: EditableCommerceRecord) => Promise<boolean>;
};

const ignoreEdit = () => undefined;
const ignoreStatus = async () => false;
const columns = [`No.`, `Record`, `Details`, `Status`, `Updated`, `Manage`];

const ProductStoreTable = ({ records, idPrefix, children, onEdit, onStatus, busy = false, preview = false }: ProductStoreTableProps) => (
  <div id={`${idPrefix}-table-wrap`} className={`bb-commerce-table-wrap`}>
    <table id={`${idPrefix}-table`} className={`bb-commerce-table`}>
      <caption id={`${idPrefix}-table-caption`} className={`bb-commerce-sr-only`}>{preview ? `Same-Category Store Products · Swap Preview` : `Products`}</caption>
      <thead id={`${idPrefix}-table-head`} className={`bb-commerce-table-head`}>
        <tr id={`${idPrefix}-column-row`} className={`bb-commerce-table-column-row`}>
          {columns.map((label, index) => <th key={label} scope={`col`} id={`${idPrefix}-column-${index}`} className={`bb-commerce-table-column`}>{label}</th>)}
        </tr>
      </thead>
      <tbody id={`${idPrefix}-table-body`} className={`bb-commerce-table-body`}>
        {records.map((record) => <CommerceRecordRow
          busy={busy}
          record={record}
          key={record.id}
          paymentMethods={[]}
          selectionPreview={preview}
          onEdit={onEdit ?? ignoreEdit}
          onStatus={onStatus ?? ignoreStatus}
          idPrefix={`${idPrefix}-row`}
          onOrderStatus={ignoreStatus}
        />)}
      </tbody>
      {children}
    </table>
  </div>
);

export default ProductStoreTable;
