'use client';

import './admin-events.scss';
import { useState } from 'react';
import { eventStatuses } from '@/api/events';
import EventRow from './event-row/event-row';
import '../profile-page/profile-page.scss';
import type { EventRecord } from '@/api/events';
import { useAdminEvents } from './use-admin-events';
import '../owner-dashboard/owner-dashboard.scss';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import EventEditor from './event-editor/event-editor';
import { getStatusLabel } from '../status-cell/status-cell';
import AccountAccess from '../account-access/account-access';
import AdminSkeleton from '../admin-skeleton/admin-skeleton';
import '../owner-records-table/owner-records-table.scss';
import { Plus, Search, CircleCheck, CalendarDays } from 'lucide-react';
import RecordPagination from '../record-pagination/record-pagination';
import AdminEditorModal from '../admin-editor-modal/admin-editor-modal';
import AccountNavigation from '../account-navigation/account-navigation';
import { getAdminParentMenuLabel } from '@/shared/navigation/account-navigation';

const AdminEventsContent = () => {
  const { save, error, notice, records, loading, savingId, refreshing, pagination } = useAdminEvents();
  const [search, setSearch] = useState(``);
  const [filter, setFilter] = useState(`all`);
  const [editor, setEditor] = useState<EventRecord | `new` | null>(null);
  const query = search.trim().toLocaleLowerCase();
  const isFiltered = Boolean(query) || filter !== `all`;
  const matchingRecords = records?.filter((record) => (filter === `all` || record.status === filter) && [record.number, record.title, record.description, record.date, record.time, record.location].join(` `).toLocaleLowerCase().includes(query)) ?? [];
  const busy = Boolean(savingId) || refreshing;
  const pageId = `bb-admin-events`;
  const drafts = records?.filter((record) => record.status === `draft`).length ?? 0;
  const scheduled = records?.filter((record) => record.status === `scheduled`).length ?? 0;

  return (
    <section id={pageId} className={`bb-section bb-owner-dashboard bb-admin-events`} aria-labelledby={`${pageId}-title`}>
      <div id={`${pageId}-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`${pageId}-content`} className={`bb-owner-dashboard-content`} aria-busy={loading || busy}>
          <div id={`${pageId}-heading`} className={`bb-owner-dashboard-heading has-table-stats`}>
            <div id={`${pageId}-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`${pageId}-eyebrow`} className={`bb-eyebrow`}><span id={`${pageId}-eyebrow-label`} className={`bb-owner-dashboard-eyebrow-label`}>Admin <span aria-hidden={`true`} id={`${pageId}-eyebrow-separator`} className={`bb-owner-dashboard-eyebrow-separator`}>·</span> {getAdminParentMenuLabel(siteRoutes.adminEvents)}</span></span>
              <h1 id={`${pageId}-title`} className={`bb-owner-dashboard-title has-table-icon`}><CalendarDays size={28} aria-hidden={`true`} id={`${pageId}-title-icon`} className={`bb-owner-dashboard-title-icon`} />{siteRoutes.adminEvents.label}</h1>
            </div>
            {loading ? <AdminSkeleton variant={`summary`} id={`${pageId}-summary-loading`} label={`Loading Events Summary`} /> : records && <dl id={`${pageId}-summary`} className={`bb-admin-events-summary`}>{[
              { id: `total`, label: `Events On This Page`, value: records.length },
              { id: `scheduled`, label: `Scheduled`, value: scheduled },
              { id: `drafts`, label: `Drafts`, value: drafts },
            ].map(({ id, label, value }) => <div key={id} id={`${pageId}-summary-${id}`} className={`bb-admin-events-summary-card`}><dt id={`${pageId}-summary-${id}-label`} className={`bb-admin-events-summary-label`}>{label}</dt><dd id={`${pageId}-summary-${id}-value`} className={`bb-admin-events-summary-value`}>{value}</dd></div>)}</dl>}
          </div>
          {error && <p id={`${pageId}-error`} className={`bb-owner-dashboard-error`} role={`alert`}>{error}</p>}
          {notice && <p id={`${pageId}-notice`} className={`bb-owner-dashboard-notice`} role={`status`}><CircleCheck size={14} aria-hidden={`true`} />{notice}</p>}
          {editor && <AdminEditorModal
            busy={busy}
            error={error}
            id={`${pageId}-editor-modal`}
            onClose={() => setEditor(null)}
            key={typeof editor === `string` ? `new` : editor.id}
            labelledBy={`bb-event-editor-${typeof editor === `string` ? `new` : editor.id}-title`}
          >
            {(dismiss) => <EventEditor busy={busy} record={typeof editor === `string` ? null : editor} onSave={save} onClose={dismiss} />}
          </AdminEditorModal>}
          {loading ? <AdminSkeleton columns={7} id={`${pageId}-loading`} label={`Loading Events`} /> : (
            <section id={`${pageId}-records`} className={`bb-owner-records`} aria-labelledby={`${pageId}-title`}>
              <div id={`${pageId}-filters`} className={`bb-owner-records-filters`}>
                <label id={`${pageId}-search-label`} htmlFor={`${pageId}-search`} className={`bb-owner-records-search`}><Search size={15} aria-hidden={`true`} /><input id={`${pageId}-search`} type={`search`} value={search} className={`bb-owner-records-search-input`} aria-label={`Search Events`} placeholder={`Search events`} onChange={(event) => setSearch(event.currentTarget.value)} /></label>
                <label id={`${pageId}-filter-label`} htmlFor={`${pageId}-filter`} className={`bb-owner-records-filter-label`}>Status</label>
                <select id={`${pageId}-filter`} value={filter} className={`bb-owner-records-filter`} onChange={(event) => setFilter(event.currentTarget.value)}><option id={`${pageId}-filter-all`} value={`all`}>All Statuses</option>{eventStatuses.map((status) => <option key={status} id={`${pageId}-filter-${status}`} value={status}>{getStatusLabel(status)}</option>)}</select>
                <div id={`${pageId}-filter-actions`} className={`bb-admin-events-filter-actions`}>
                  <button type={`button`} disabled={busy} id={`${pageId}-add`} className={`bb-button bb-button-primary bb-admin-events-add`} onClick={() => setEditor(`new`)}><Plus size={14} aria-hidden={`true`} />Add Event</button>
                </div>
              </div>
              {matchingRecords.length ? <div id={`${pageId}-table-wrap`} className={`bb-owner-table-wrap`}><table id={`${pageId}-table`} className={`bb-owner-table bb-admin-events-table`}><caption id={`${pageId}-table-caption`} className={`bb-owner-table-caption`}>Studio Events</caption><thead id={`${pageId}-table-head`} className={`bb-owner-table-head`}><tr id={`${pageId}-column-row`} className={`bb-owner-table-column-row`}>{[`No.`, `Event`, `Schedule`, `Location`, `Status`, `Updated`, `Manage`].map((label, index) => <th key={label} scope={`col`} id={`${pageId}-column-${index}`} className={`bb-owner-table-column`}>{label}</th>)}</tr></thead><tbody id={`${pageId}-table-body`} className={`bb-owner-table-body`}>{matchingRecords.map((record) => <EventRow key={record.id} busy={busy} record={record} onEdit={setEditor} />)}</tbody><RecordPagination {...pagination} columns={7} id={`${pageId}-pagination`} disabled={busy} matchingRows={matchingRecords.length} isFiltered={isFiltered} recordType={siteRoutes.adminEvents.label} /></table></div>
                : records && <p id={`${pageId}-empty`} className={`bb-owner-records-empty`}>{records.length ? `No events match these filters.` : `No events saved yet. Add an event to get started.`}</p>}
              {records && !matchingRecords.length && <RecordPagination {...pagination} id={`${pageId}-pagination`} disabled={busy} matchingRows={matchingRecords.length} isFiltered={isFiltered} recordType={siteRoutes.adminEvents.label} />}
            </section>
          )}
          {!loading && !records && error && <p id={`${pageId}-retry-note`} className={`bb-owner-dashboard-description`}>Reload the page to try loading records again.</p>}
        </div>
      </div>
    </section>
  );
};

const AdminEvents = () => {
  const { user } = useAuth();
  return <AccountAccess adminOnly>{user && <AdminEventsContent key={user.id} />}</AccountAccess>;
};

export default AdminEvents;
