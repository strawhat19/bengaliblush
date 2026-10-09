'use client';

import './owner-records-table.scss';
import { useState } from 'react';
import { roleLabels } from '@/types/types';
import type { OwnerOverview } from '@/api/owner';
import { siteRoutes } from '@/shared/navigation/routes';
import OwnerUserRow from '../owner-user-row/owner-user-row';
import { getStatusLabel } from '../status-cell/status-cell';
import Link from '@/app/components/navigation/page-link/page-link';
import OwnerSubmissionCard from '../owner-submission-card/owner-submission-card';
import { Users, Search, ArrowUpRight, CalendarDays, MessageCircle } from 'lucide-react';
import { submissionStatuses, type SubmissionStatus } from '@/shared/models/submissions/Submission';

type OwnerRecordsTableProps = {
  limit?: number;
  savingId: string;
  disabled?: boolean;
  overview: OwnerOverview;
  kind: `users` | `contacts` | `appointments`;
  onStatus: (kind: `contact` | `appointment`, id: string, status: SubmissionStatus) => Promise<void>;
};

const tableLabels = {
  users: { Icon: Users, title: `Accounts`, empty: `No registered accounts yet.`, columns: [`No.`, `Account`, `Role`, `Sign In`, `Status`, `Joined`] },
  contacts: { Icon: MessageCircle, title: `Requests`, empty: `No requests yet.`, columns: [`No.`, `Request`, `Submitted By`, `Received`, `Status`] },
  appointments: { Icon: CalendarDays, title: `Appointment Requests`, empty: `No appointment requests yet.`, columns: [`No.`, `Request`, `Submitted By`, `Preferred Time`, `Received`, `Status`] },
};

const OwnerRecordsTable = ({ kind, limit, overview, disabled, savingId, onStatus }: OwnerRecordsTableProps) => {
  const [search, setSearch] = useState(``);
  const [filter, setFilter] = useState(`all`);
  const { Icon, title, empty, columns } = tableLabels[kind];
  const query = search.trim().toLocaleLowerCase();
  const matches = (...values: (string | number)[]) => values.join(` `).toLocaleLowerCase().includes(query);
  const users = overview.users.filter((record) => (filter === `all` || record.role === filter) && matches(record.number, record.name, record.email, record.role, record.account_status ?? `active`));
  const contacts = overview.contacts.filter((record) => (filter === `all` || record.status === filter) && matches(record.number, record.contact, record.message, record.user_id ? `account` : `guest`));
  const appointments = overview.appointments.filter((record) => (filter === `all` || record.status === filter) && matches(record.number, record.name, record.email, record.service, record.date, record.time, record.notes, record.user_id ? `account` : `guest`));
  const matchingCount = kind === `users` ? users.length : kind === `contacts` ? contacts.length : appointments.length;
  const filters = kind === `users` ? Object.entries(roleLabels) : submissionStatuses[kind === `contacts` ? `contact` : `appointment`].map((status) => [status, getStatusLabel(status)]);
  const routes = { users: siteRoutes.adminUsers, contacts: siteRoutes.adminRequests, appointments: siteRoutes.adminAppointments };
  const tableId = `bb-owner-${kind}`;
  const accountName = (id: string | null | undefined) => overview.users.find((user) => user.id === id)?.name;

  return (
    <section id={tableId} className={`bb-owner-records`} aria-labelledby={`${tableId}-title`}>
      <div id={`${tableId}-heading`} className={`bb-owner-records-heading`}>
        <h2 id={`${tableId}-title`} className={`bb-owner-records-title`}><Icon size={20} aria-hidden={`true`} />{limit ? `Recent ${title}` : title}</h2>
        {limit && <Link href={routes[kind].href} id={`${tableId}-view-all`} className={`bb-owner-records-view-all`}>View All <ArrowUpRight size={14} aria-hidden={`true`} /></Link>}
      </div>
      {!limit && overview[kind].length > 0 && (
        <div id={`${tableId}-filters`} className={`bb-owner-records-filters`}>
          <label id={`${tableId}-search-label`} className={`bb-owner-records-search`} htmlFor={`${tableId}-search`}>
            <Search size={15} aria-hidden={`true`} />
            <input
              type={`search`}
              value={search}
              id={`${tableId}-search`}
              aria-label={`Search ${title}`}
              className={`bb-owner-records-search-input`}
              placeholder={`Search ${title.toLocaleLowerCase()}`}
              onChange={(event) => setSearch(event.currentTarget.value)}
            />
          </label>
          <label id={`${tableId}-filter-label`} className={`bb-owner-records-filter-label`} htmlFor={`${tableId}-filter`}>{kind === `users` ? `Role` : `Status`}</label>
          <select id={`${tableId}-filter`} value={filter} className={`bb-owner-records-filter`} onChange={(event) => setFilter(event.currentTarget.value)}>
            <option value={`all`} id={`${tableId}-filter-all`}>{kind === `users` ? `All Roles` : `All Statuses`}</option>
            {filters.map(([value, label]) => <option key={value} value={value} id={`${tableId}-filter-${value}`}>{label}</option>)}
          </select>
          <span id={`${tableId}-results`} className={`bb-owner-records-results`} role={`status`}>{matchingCount} Of {overview[kind].length} Record(s)</span>
        </div>
      )}
      {matchingCount ? (
        <div id={`${tableId}-table-wrap`} className={`bb-owner-table-wrap`}>
          <table id={`${tableId}-table`} className={`bb-owner-table bb-owner-${kind}-table`}>
            <caption id={`${tableId}-table-caption`} className={`bb-owner-table-caption`}>{limit ? `${Math.min(limit, matchingCount)} Most Recent ${title}` : title}</caption>
            <thead id={`${tableId}-table-head`} className={`bb-owner-table-head`}>
              <tr id={`${tableId}-column-row`} className={`bb-owner-table-column-row`}>
                {columns.map((label, index) => <th key={label} scope={`col`} id={`${tableId}-column-${index}`} className={`bb-owner-table-column`}>{label}</th>)}
              </tr>
            </thead>
            <tbody id={`${tableId}-table-body`} className={`bb-owner-table-body`}>
              {kind === `users` && users.slice(0, limit).map((user) => <OwnerUserRow key={user.id} user={user} />)}
              {kind === `contacts` && contacts.slice(0, limit).map((submission) => (
                <OwnerSubmissionCard
                  kind={`contact`}
                  key={submission.id}
                  onStatus={onStatus}
                  disabled={disabled}
                  savingId={savingId}
                  submission={submission}
                  accountName={accountName(submission.user_id)}
                />
              ))}
              {kind === `appointments` && appointments.slice(0, limit).map((submission) => (
                <OwnerSubmissionCard
                  kind={`appointment`}
                  key={submission.id}
                  onStatus={onStatus}
                  disabled={disabled}
                  savingId={savingId}
                  submission={submission}
                  accountName={accountName(submission.user_id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : <p id={`${tableId}-empty`} className={`bb-owner-records-empty`}>{overview[kind].length ? `No records match these filters.` : empty}</p>}
    </section>
  );
};

export default OwnerRecordsTable;
