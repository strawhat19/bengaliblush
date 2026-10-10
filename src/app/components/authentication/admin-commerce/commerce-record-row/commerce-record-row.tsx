'use client';

import './commerce-record-row.scss';
import { Pencil, ChevronDown } from 'lucide-react';
import StatusCell, { getStatusLabel } from '../../status-cell/status-cell';
import type { OrderRecord, PaymentMethodRecord } from '@/shared/models/commerce/Commerce';
import { formatCommerceDate, formatCommerceAmount, sectionStatuses, type CommerceRecord, type EditableCommerceRecord } from '../commerce-data';

type CommerceRecordRowProps = {
  busy: boolean;
  record: CommerceRecord;
  paymentMethods: PaymentMethodRecord[];
  onEdit: (record: EditableCommerceRecord) => void;
  onOrderStatus: (id: string, status: OrderRecord[`status`]) => Promise<boolean>;
};

const CommerceRecordRow = ({ busy, record, onEdit, onOrderStatus, paymentMethods }: CommerceRecordRowProps) => {
  const rowId = `bb-commerce-row-${record.id}`;
  if (`items` in record) {
    const paymentMethod = paymentMethods.find((method) => method.id === record.payment_method_id);
    return (
      <tr id={rowId} className={`bb-commerce-record-row bb-commerce-order-row`}>
        <td id={`${rowId}-number`} className={`bb-commerce-record-number`}>{record.number}</td>
        <td id={`${rowId}-customer`} className={`bb-commerce-record-main`}><strong id={`${rowId}-name`} className={`bb-commerce-record-name`}>{record.name}</strong><span id={`${rowId}-email`} className={`bb-commerce-record-meta`}>{record.email}</span><span id={`${rowId}-actor`} className={`bb-commerce-record-meta`}>{record.user_id ? `Account` : `Guest`}</span></td>
        <td id={`${rowId}-items`} className={`bb-commerce-order-items`}>{record.items.map((item, index) => <span key={`${item.product_id}:${index}`} id={`${rowId}-item-${index}`} className={`bb-commerce-order-item`}>{item.quantity} × {item.name}</span>)}</td>
        <td id={`${rowId}-amount`} className={`bb-commerce-record-detail`}><strong id={`${rowId}-subtotal`} className={`bb-commerce-record-name`}>{formatCommerceAmount(record.subtotal)}</strong><span id={`${rowId}-payment-status`} className={`bb-commerce-record-meta`}>Unpaid</span></td>
        <td id={`${rowId}-status-cell`} className={`bb-commerce-record-status`}><StatusCell id={rowId} status={record.status} /></td>
        <td id={`${rowId}-created`} className={`bb-commerce-record-date`}>{formatCommerceDate(record.created_at)}</td>
        <td id={`${rowId}-actions-cell`} className={`bb-commerce-record-actions`}>
          <details id={`${rowId}-details`} className={`bb-commerce-order-details`}>
            <summary id={`${rowId}-details-summary`} className={`bb-commerce-order-summary`}><ChevronDown size={14} aria-hidden={`true`} />View Order</summary>
            <div id={`${rowId}-details-content`} className={`bb-commerce-order-details-content`}>
              <dl id={`${rowId}-details-record`} className={`bb-commerce-order-details-record`}>
                {[
                  { id: `record`, label: `Order ID`, value: record.id },
                  { id: `phone`, label: `Phone`, value: record.phone || `—` },
                  { id: `address`, label: `Delivery`, value: [record.address, record.city, record.region, record.postal_code, record.country].filter(Boolean).join(`, `) },
                  { id: `method`, label: `Payment Method`, value: paymentMethod?.name ?? (record.payment_method_id || `Not Selected`) },
                  { id: `notes`, label: `Notes`, value: record.notes || `—` },
                ].map(({ id, label, value }) => <div key={id} id={`${rowId}-detail-${id}`} className={`bb-commerce-order-detail`}><dt id={`${rowId}-detail-${id}-label`} className={`bb-commerce-order-detail-label`}>{label}</dt><dd id={`${rowId}-detail-${id}-value`} className={`bb-commerce-order-detail-value`}>{value}</dd></div>)}
              </dl>
              <ul id={`${rowId}-item-prices`} className={`bb-commerce-order-item-prices`}>{record.items.map((item, index) => <li key={`${item.product_id}:${index}`} id={`${rowId}-item-price-${index}`} className={`bb-commerce-order-item-price`}>{item.quantity} × {item.name} · {formatCommerceAmount(item.unit_price)} Each</li>)}</ul>
              <div id={`${rowId}-status-actions`} className={`actionsCell`}>
                <label id={`${rowId}-status-select-label`} htmlFor={`${rowId}-status-select`} className={`bb-commerce-order-status-label`}>Order Status</label>
                <select id={`${rowId}-status-select`} value={record.status} disabled={busy} className={`bb-commerce-order-status-select`} onChange={(event) => { void onOrderStatus(record.id, event.currentTarget.value as OrderRecord[`status`]); }}>{sectionStatuses.orders.map((status) => <option key={status} value={status} id={`${rowId}-status-option-${status}`}>{getStatusLabel(status)}</option>)}</select>
              </div>
            </div>
          </details>
        </td>
      </tr>
    );
  }

  const description = `quote` in record ? record.quote : record.description;
  const details = `category_name` in record ? `${formatCommerceAmount(record.price_minor)} · ${record.category_name}`
    : `duration` in record ? `${record.price} · ${record.duration}`
    : `quote` in record ? `${record.rating}/5 · ${record.service}`
    : record.type === `card` ? `Card · Stripe Pending` : `Manual`;
  const slug = `slug` in record ? record.slug : ``;

  return (
    <tr id={rowId} className={`bb-commerce-record-row`}>
      <td id={`${rowId}-number`} className={`bb-commerce-record-number`}>{record.number}</td>
      <td id={`${rowId}-main`} className={`bb-commerce-record-main`}><strong id={`${rowId}-name`} className={`bb-commerce-record-name`}>{record.name}</strong>{slug && <span id={`${rowId}-slug`} className={`bb-commerce-record-meta`}>{slug}</span>}<span id={`${rowId}-description`} className={`bb-commerce-record-description`}>{description}</span></td>
      <td id={`${rowId}-detail`} className={`bb-commerce-record-detail`}>{details}</td>
      <td id={`${rowId}-status-cell`} className={`bb-commerce-record-status`}><StatusCell id={rowId} status={record.status} /></td>
      <td id={`${rowId}-updated`} className={`bb-commerce-record-date`}>{formatCommerceDate(record.updated_at)}</td>
      <td id={`${rowId}-actions-cell`} className={`bb-commerce-record-actions`}><div id={`${rowId}-actions`} className={`actionsCell`}><button type={`button`} disabled={busy} id={`${rowId}-edit`} className={`bb-commerce-record-edit`} aria-label={`Edit ${record.name}`} onClick={() => onEdit(record)}><Pencil size={13} aria-hidden={`true`} />Edit</button></div></td>
    </tr>
  );
};

export default CommerceRecordRow;
