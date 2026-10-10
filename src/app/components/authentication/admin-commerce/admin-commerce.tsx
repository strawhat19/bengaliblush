'use client';

import './admin-commerce.scss';
import '../profile-page/profile-page.scss';
import '../owner-dashboard/owner-dashboard.scss';
import { useState } from 'react';
import { useAdminCommerce } from './use-admin-commerce';
import { useAuth } from '@/shared/authContext/useAuth';
import AccountAccess from '../account-access/account-access';
import CommerceEditor from './commerce-editor/commerce-editor';
import { getStatusLabel } from '../status-cell/status-cell';
import AccountNavigation from '../account-navigation/account-navigation';
import { Plus, Search, Database, RotateCcw, CircleCheck } from 'lucide-react';
import CommerceRecordRow from './commerce-record-row/commerce-record-row';
import RecordPagination from '../record-pagination/record-pagination';
import { getCommerceRecords, getCommerceSearchText, formatCommerceAmount, commerceSections, sectionStatuses, type CommerceSection, type EditableCommerceRecord } from './commerce-data';

const CommerceContent = ({ section }: { section: CommerceSection }) => {
  const { error, notice, reload, loading, overview, savingId, refreshing, pagination, saveRecord, importCatalog, saveOrderStatus } = useAdminCommerce(section);
  const [search, setSearch] = useState(``);
  const [filter, setFilter] = useState(`all`);
  const [editor, setEditor] = useState<EditableCommerceRecord | `new` | null>(null);
  const { route, description, empty } = commerceSections[section];
  const records = overview ? getCommerceRecords(overview, section) : [];
  const query = search.trim().toLocaleLowerCase();
  const matches = records.filter((record) => (filter === `all` || filter === record.status) && getCommerceSearchText(record).includes(query));
  const busy = Boolean(savingId) || refreshing;
  const canEdit = section !== `orders`;
  const pageId = `bb-admin-commerce-${section}`;
  const singular = section === `paymentMethods` ? `Payment Method` : section === `reviews` ? `Review` : section === `services` ? `Service` : `Product`;
  const columns = section === `orders` ? [`No.`, `Customer`, `Items`, `Total`, `Status`, `Received`, `Manage`] : [`No.`, `Record`, `Details`, `Status`, `Updated`, `Manage`];
  const summaries = section === `orders` ? [
    { label: `Orders On This Page`, value: records.length },
    { label: `Awaiting Fulfillment`, value: records.filter((record) => [`requested`, `confirmed`].includes(record.status)).length },
    { label: `Requested Value`, value: formatCommerceAmount(overview?.orders.filter((record) => record.status !== `cancelled`).reduce((sum, record) => sum + record.subtotal, 0) ?? 0) },
  ] : [
    { label: `${route.label} On This Page`, value: records.length },
    { label: section === `reviews` ? `Published` : `Active`, value: records.filter((record) => record.status === (section === `reviews` ? `published` : `active`)).length },
    { label: section === `paymentMethods` ? `Disabled` : section === `reviews` ? `Drafts` : `Archived`, value: records.filter((record) => record.status === (section === `paymentMethods` ? `disabled` : section === `reviews` ? `draft` : `archived`)).length },
  ];

  return (
    <section id={pageId} className={`bb-section bb-owner-dashboard bb-admin-commerce`} aria-labelledby={`${pageId}-title`}>
      <div id={`${pageId}-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`${pageId}-content`} className={`bb-owner-dashboard-content`} aria-busy={loading || busy}>
          <div id={`${pageId}-heading`} className={`bb-owner-dashboard-heading`}>
            <div id={`${pageId}-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`${pageId}-eyebrow`} className={`bb-eyebrow`}>Admin · Studio Records</span>
              <h1 id={`${pageId}-title`} className={`bb-owner-dashboard-title`}>{route.label}</h1>
              <p id={`${pageId}-description`} className={`bb-owner-dashboard-description`}>{description}</p>
            </div>
            <button type={`button`} disabled={loading || busy} id={`${pageId}-refresh`} className={`bb-button bb-button-outline bb-button-outline-dark bb-owner-dashboard-refresh`} onClick={() => { void reload(); }}><RotateCcw size={15} aria-hidden={`true`} className={refreshing ? `is-refreshing` : undefined} />{refreshing ? `Refreshing` : `Refresh`}</button>
          </div>
          {error && <p id={`${pageId}-error`} className={`bb-owner-dashboard-error`} role={`alert`}>{error}</p>}
          {notice && <p id={`${pageId}-notice`} className={`bb-owner-dashboard-notice`} role={`status`}><CircleCheck size={14} aria-hidden={`true`} />{notice}</p>}
          {loading ? <div id={`${pageId}-loading`} className={`bb-owner-dashboard-loading`} role={`status`} aria-label={`Loading ${route.label}`}>{[0, 1].map((index) => <div key={index} id={`${pageId}-skeleton-${index}`} className={`bb-owner-dashboard-skeleton`} aria-hidden={`true`}>{[0, 1, 2].map((line) => <span key={line} id={`${pageId}-skeleton-${index}-line-${line}`} className={`bb-owner-dashboard-skeleton-line`} />)}</div>)}</div> : overview && (
            <>
              <dl id={`${pageId}-summary`} className={`bb-commerce-summary`}>{summaries.map(({ label, value }, index) => <div key={label} id={`${pageId}-summary-${index}`} className={`bb-commerce-summary-card`}><dt id={`${pageId}-summary-${index}-label`} className={`bb-commerce-summary-label`}>{label}</dt><dd id={`${pageId}-summary-${index}-value`} className={`bb-commerce-summary-value`}>{value}</dd></div>)}</dl>
              {canEdit && <div id={`${pageId}-tools`} className={`bb-commerce-tools`}>
                <button type={`button`} disabled={busy} id={`${pageId}-add`} className={`bb-button bb-button-primary bb-commerce-add`} onClick={() => setEditor(`new`)}><Plus size={14} aria-hidden={`true`} />Add {singular}</button>
                {(section === `products` || section === `services`) && <button type={`button`} disabled={busy} id={`${pageId}-import`} className={`bb-button bb-button-outline bb-button-outline-dark bb-commerce-import`} onClick={() => { void importCatalog(); }}><Database size={14} aria-hidden={`true`} />{savingId === `import` ? `Importing` : `Import Existing Catalog`}</button>}
              </div>}
              {(section === `products` || section === `services`) && <p id={`${pageId}-import-note`} className={`bb-commerce-note`}>Import adds the existing website products and services to the database while keeping already saved entries.</p>}
              {section === `orders` && <p id={`${pageId}-order-note`} className={`bb-commerce-note`}>Orders are saved as unpaid requests. Confirmed and fulfilled describe the order status; payment collection will be added later.</p>}
              {editor && section !== `orders` && <CommerceEditor key={typeof editor === `string` ? `new:${section}` : editor.id} busy={busy} section={section} record={typeof editor === `string` ? null : editor} onSave={saveRecord} onClose={() => setEditor(null)} />}
              <div id={`${pageId}-filters`} className={`bb-commerce-filters`}>
                <label id={`${pageId}-search-label`} htmlFor={`${pageId}-search`} className={`bb-commerce-search`}><Search size={15} aria-hidden={`true`} /><input id={`${pageId}-search`} type={`search`} value={search} className={`bb-commerce-search-input`} aria-label={`Search ${route.label}`} placeholder={`Search ${route.label.toLocaleLowerCase()}`} onChange={(event) => setSearch(event.currentTarget.value)} /></label>
                <label id={`${pageId}-filter-label`} htmlFor={`${pageId}-filter`} className={`bb-commerce-filter-label`}>Status</label>
                <select id={`${pageId}-filter`} value={filter} className={`bb-commerce-filter`} onChange={(event) => setFilter(event.currentTarget.value)}><option id={`${pageId}-filter-all`} value={`all`}>All Statuses</option>{sectionStatuses[section].map((status) => <option key={status} id={`${pageId}-filter-${status}`} value={status}>{getStatusLabel(status)}</option>)}</select>
                <span id={`${pageId}-results`} className={`bb-commerce-results`} role={`status`}>{matches.length} Of {records.length} Record(s)</span>
              </div>
              {matches.length ? <div id={`${pageId}-table-wrap`} className={`bb-commerce-table-wrap`}><table id={`${pageId}-table`} className={`bb-commerce-table`}><caption id={`${pageId}-table-caption`} className={`bb-commerce-sr-only`}>{route.label}</caption><thead id={`${pageId}-table-head`} className={`bb-commerce-table-head`}><tr id={`${pageId}-column-row`} className={`bb-commerce-table-column-row`}>{columns.map((label, index) => <th key={label} scope={`col`} id={`${pageId}-column-${index}`} className={`bb-commerce-table-column`}>{label}</th>)}</tr></thead><tbody id={`${pageId}-table-body`} className={`bb-commerce-table-body`}>{matches.map((record) => <CommerceRecordRow busy={busy} record={record} key={record.id} onEdit={setEditor} onOrderStatus={saveOrderStatus} paymentMethods={overview.paymentMethods} />)}</tbody></table></div>
                : <p id={`${pageId}-empty`} className={`bb-commerce-empty`}>{records.length ? `No records match these filters.` : empty}</p>}
              <RecordPagination {...pagination} id={`${pageId}-pagination`} disabled={busy} />
            </>
          )}
          {!loading && !overview && error && <p id={`${pageId}-retry-note`} className={`bb-commerce-note`}>Use Refresh to try loading the database again.</p>}
        </div>
      </div>
    </section>
  );
};

const AdminCommerce = ({ section }: { section: CommerceSection }) => {
  const { user } = useAuth();
  return <AccountAccess adminOnly>{user && <CommerceContent section={section} key={`${user.id}:${section}`} />}</AccountAccess>;
};

export default AdminCommerce;
