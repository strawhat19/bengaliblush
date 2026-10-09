'use client';

import './admin-notifications.scss';
import { useState } from 'react';
import '../profile-page/profile-page.scss';
import '../owner-dashboard/owner-dashboard.scss';
import '../owner-records-table/owner-records-table.scss';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import { useAdminNotifications } from './use-admin-notifications';
import AccountAccess from '../account-access/account-access';
import NotificationRow from './notification-row/notification-row';
import AccountNavigation from '../account-navigation/account-navigation';
import NotificationEditor from './notification-editor/notification-editor';
import { Bell, Plus, Search, RotateCcw, CircleCheck } from 'lucide-react';
import type { NotificationRecord } from '@/shared/models/notifications/Notification';

const AdminNotificationsContent = () => {
  const { save, error, notice, reload, remove, records, loading, savingId, refreshing, changeStatus } = useAdminNotifications();
  const [search, setSearch] = useState(``);
  const [filter, setFilter] = useState(`all`);
  const [deletingId, setDeletingId] = useState(``);
  const [editor, setEditor] = useState<NotificationRecord | `new` | null>(null);
  const query = search.trim().toLocaleLowerCase();
  const matchingRecords = records?.filter((record) => (filter === `all` || record.status === filter) && [record.number, record.title, record.body, record.slug, record.kind, record.suffix, record.link?.label, record.link?.href].join(` `).toLocaleLowerCase().includes(query)) ?? [];
  const busy = Boolean(savingId) || refreshing;
  const pageId = `bb-admin-notifications`;
  const published = records?.filter((record) => record.status === `published`).length ?? 0;
  const edit = (record: NotificationRecord | `new`) => { setDeletingId(``); setEditor(record); };
  const requestDelete = (record: NotificationRecord) => { setEditor(null); setDeletingId(record.id); };

  return (
    <section id={pageId} className={`bb-section bb-owner-dashboard bb-admin-notifications`} aria-labelledby={`${pageId}-title`}>
      <div id={`${pageId}-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`${pageId}-content`} className={`bb-owner-dashboard-content`} aria-busy={loading || busy}>
          <div id={`${pageId}-heading`} className={`bb-owner-dashboard-heading`}>
            <div id={`${pageId}-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`${pageId}-eyebrow`} className={`bb-eyebrow`}>Admin · Studio Updates</span>
              <h1 id={`${pageId}-title`} className={`bb-owner-dashboard-title`}>{siteRoutes.adminNotifications.label}</h1>
              <p id={`${pageId}-description`} className={`bb-owner-dashboard-description`}>Manage drafts and published updates shown in the notification bell and public pages.</p>
            </div>
            <button type={`button`} disabled={loading || busy} id={`${pageId}-refresh`} className={`bb-button bb-button-outline bb-button-outline-dark bb-owner-dashboard-refresh`} onClick={() => { void reload(); }}><RotateCcw size={15} aria-hidden={`true`} className={refreshing ? `is-refreshing` : undefined} />{refreshing ? `Refreshing` : `Refresh`}</button>
          </div>
          {error && <p id={`${pageId}-error`} className={`bb-owner-dashboard-error`} role={`alert`}>{error}</p>}
          {notice && <p id={`${pageId}-notice`} className={`bb-owner-dashboard-notice`} role={`status`}><CircleCheck size={14} aria-hidden={`true`} />{notice}</p>}
          {loading ? <div id={`${pageId}-loading`} className={`bb-owner-dashboard-loading`} role={`status`} aria-label={`Loading Notifications`}>{[0, 1].map((index) => <div key={index} id={`${pageId}-skeleton-${index}`} className={`bb-owner-dashboard-skeleton`} aria-hidden={`true`}>{[0, 1, 2].map((line) => <span key={line} id={`${pageId}-skeleton-${index}-line-${line}`} className={`bb-owner-dashboard-skeleton-line`} />)}</div>)}</div> : records && (
            <>
              <dl id={`${pageId}-summary`} className={`bb-admin-notifications-summary`}>{[
                { id: `total`, label: `Total Notifications`, value: records.length },
                { id: `published`, label: `Published`, value: published },
                { id: `drafts`, label: `Drafts`, value: records.length - published },
              ].map(({ id, label, value }) => <div key={id} id={`${pageId}-summary-${id}`} className={`bb-admin-notifications-summary-card`}><dt id={`${pageId}-summary-${id}-label`} className={`bb-admin-notifications-summary-label`}>{label}</dt><dd id={`${pageId}-summary-${id}-value`} className={`bb-admin-notifications-summary-value`}>{value}</dd></div>)}</dl>
              <button type={`button`} disabled={busy} id={`${pageId}-add`} className={`bb-button bb-button-primary bb-admin-notifications-add`} onClick={() => edit(`new`)}><Plus size={14} aria-hidden={`true`} />Add Notification</button>
              {editor && <NotificationEditor key={typeof editor === `string` ? `new` : editor.id} busy={busy} record={typeof editor === `string` ? null : editor} onSave={save} onClose={() => setEditor(null)} />}
              <section id={`${pageId}-records`} className={`bb-owner-records`} aria-labelledby={`${pageId}-records-title`}>
                <div id={`${pageId}-records-heading`} className={`bb-owner-records-heading`}><h2 id={`${pageId}-records-title`} className={`bb-owner-records-title`}><Bell size={20} aria-hidden={`true`} />Studio Notifications</h2></div>
                <div id={`${pageId}-filters`} className={`bb-owner-records-filters`}>
                  <label id={`${pageId}-search-label`} htmlFor={`${pageId}-search`} className={`bb-owner-records-search`}><Search size={15} aria-hidden={`true`} /><input id={`${pageId}-search`} type={`search`} value={search} className={`bb-owner-records-search-input`} aria-label={`Search Notifications`} placeholder={`Search notifications`} onChange={(event) => setSearch(event.currentTarget.value)} /></label>
                  <label id={`${pageId}-filter-label`} htmlFor={`${pageId}-filter`} className={`bb-owner-records-filter-label`}>Status</label>
                  <select id={`${pageId}-filter`} value={filter} className={`bb-owner-records-filter`} onChange={(event) => setFilter(event.currentTarget.value)}><option id={`${pageId}-filter-all`} value={`all`}>All Statuses</option><option id={`${pageId}-filter-published`} value={`published`}>Published</option><option id={`${pageId}-filter-draft`} value={`draft`}>Draft</option></select>
                  <span id={`${pageId}-results`} className={`bb-owner-records-results`} role={`status`}>{matchingRecords.length} Of {records.length} Record(s)</span>
                </div>
                {matchingRecords.length ? <div id={`${pageId}-table-wrap`} className={`bb-owner-table-wrap`}><table id={`${pageId}-table`} className={`bb-owner-table bb-admin-notifications-table`}><caption id={`${pageId}-table-caption`} className={`bb-owner-table-caption`}>Studio Notifications</caption><thead id={`${pageId}-table-head`} className={`bb-owner-table-head`}><tr id={`${pageId}-column-row`} className={`bb-owner-table-column-row`}>{[`No.`, `Title`, `Kind`, `Status`, `Updated`, `Actions`].map((label, index) => <th key={label} scope={`col`} id={`${pageId}-column-${index}`} className={`bb-owner-table-column`}>{label}</th>)}</tr></thead><tbody id={`${pageId}-table-body`} className={`bb-owner-table-body`}>{matchingRecords.map((record) => <NotificationRow key={record.id} busy={busy} record={record} onEdit={edit} onDelete={remove} onStatus={changeStatus} onRequestDelete={requestDelete} confirming={deletingId === record.id} onCancelDelete={() => setDeletingId(``)} />)}</tbody></table></div>
                  : <p id={`${pageId}-empty`} className={`bb-owner-records-empty`}>{records.length ? `No notifications match these filters.` : `No notifications saved yet. Add a draft to get started.`}</p>}
              </section>
            </>
          )}
          {!loading && !records && error && <p id={`${pageId}-retry-note`} className={`bb-owner-dashboard-description`}>Use Refresh to try loading the database again.</p>}
        </div>
      </div>
    </section>
  );
};

const AdminNotifications = () => {
  const { user } = useAuth();
  return <AccountAccess adminOnly>{user && <AdminNotificationsContent key={user.id} />}</AccountAccess>;
};

export default AdminNotifications;
