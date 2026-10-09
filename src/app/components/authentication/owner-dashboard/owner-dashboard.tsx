'use client';

import './owner-dashboard.scss';
import { useOwnerDashboard } from './use-owner-dashboard';
import OwnerUserRow from '../owner-user-row/owner-user-row';
import AccountAccess from '../account-access/account-access';
import { Users, RotateCcw, CalendarDays, MessageCircle } from 'lucide-react';
import OwnerSubmissionCard from '../owner-submission-card/owner-submission-card';

const OwnerDashboard = () => {
  const { error, notice, reload, loading, overview, savingId, saveStatus } = useOwnerDashboard();

  return (
    <AccountAccess ownerOnly>
      <section id={`bb-owner-dashboard`} className={`bb-section bb-owner-dashboard`} aria-labelledby={`bb-owner-dashboard-title`}>
        <div id={`bb-owner-dashboard-content`} className={`bb-container bb-owner-dashboard-content`}>
          <div id={`bb-owner-dashboard-heading`} className={`bb-owner-dashboard-heading`}>
            <div id={`bb-owner-dashboard-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`bb-owner-dashboard-eyebrow`} className={`bb-eyebrow`}>Studio Overview</span>
              <h1 id={`bb-owner-dashboard-title`} className={`bb-owner-dashboard-title`}>Your studio,<br /><em>at a glance.</em></h1>
            </div>
            <button type={`button`} disabled={loading || Boolean(savingId)} id={`bb-owner-dashboard-refresh`} className={`bb-button bb-button-outline bb-button-outline-dark`} onClick={() => { void reload(); }}>
              <RotateCcw size={16} aria-hidden={`true`} />{loading ? `Loading` : `Refresh`}
            </button>
          </div>
          {error && <p id={`bb-owner-dashboard-error`} className={`bb-owner-dashboard-error`} role={`alert`}>{error}</p>}
          {notice && <p id={`bb-owner-dashboard-notice`} className={`bb-owner-dashboard-notice`} role={`status`}>{notice}</p>}
          {loading ? (
            <div id={`bb-owner-dashboard-loading`} className={`bb-owner-dashboard-loading`} role={`status`} aria-label={`Loading Studio Records`}>
              {[0, 1, 2].map((index) => <div key={index} id={`bb-owner-dashboard-skeleton-${index}`} className={`bb-owner-dashboard-skeleton`} aria-hidden={`true`}><span /><span /><span /></div>)}
            </div>
          ) : overview && (
            <>
              <div id={`bb-owner-dashboard-counts`} className={`bb-owner-dashboard-counts`}>
                {[
                  { id: `users`, icon: Users, label: `Account(s)`, count: overview.users.length },
                  { id: `contacts`, icon: MessageCircle, label: `Contact Request(s)`, count: overview.contacts.length },
                  { id: `appointments`, icon: CalendarDays, label: `Appointment Request(s)`, count: overview.appointments.length },
                ].map(({ id, icon: Icon, label, count }) => (
                  <div key={id} id={`bb-owner-count-${id}`} className={`bb-owner-dashboard-count`}>
                    <Icon size={21} aria-hidden={`true`} /><strong id={`bb-owner-count-value-${id}`} className={`bb-owner-dashboard-count-value`}>{count}</strong><span id={`bb-owner-count-label-${id}`} className={`bb-owner-dashboard-count-label`}>{label}</span>
                  </div>
                ))}
              </div>
              <section id={`bb-owner-users`} className={`bb-owner-records`} aria-labelledby={`bb-owner-users-title`}>
                <h2 id={`bb-owner-users-title`} className={`bb-owner-records-title`}><Users size={22} aria-hidden={`true`} />Accounts</h2>
                {overview.users.length ? (
                  <div id={`bb-owner-users-table-wrap`} className={`bb-owner-users-table-wrap`}>
                    <table id={`bb-owner-users-table`} className={`bb-owner-users-table`}>
                      <thead id={`bb-owner-users-table-head`} className={`bb-owner-users-table-head`}><tr id={`bb-owner-users-column-row`} className={`bb-owner-users-column-row`}>
                        {[`Number`, `Name`, `Email`, `Role`, `Joined`].map((label, index) => <th key={label} scope={`col`} id={`bb-owner-users-column-${index}`} className={`bb-owner-users-column`}>{label}</th>)}
                      </tr></thead>
                      <tbody id={`bb-owner-users-table-body`} className={`bb-owner-users-table-body`}>{overview.users.map((user) => <OwnerUserRow key={user.id} user={user} />)}</tbody>
                    </table>
                  </div>
                ) : <p id={`bb-owner-users-empty`} className={`bb-owner-records-empty`}>No accounts yet.</p>}
              </section>
              <section id={`bb-owner-contacts`} className={`bb-owner-records`} aria-labelledby={`bb-owner-contacts-title`}>
                <h2 id={`bb-owner-contacts-title`} className={`bb-owner-records-title`}><MessageCircle size={22} aria-hidden={`true`} />Contact Requests</h2>
                <div id={`bb-owner-contacts-list`} className={`bb-owner-submission-list`}>
                  {overview.contacts.length ? overview.contacts.map((submission) => <OwnerSubmissionCard kind={`contact`} key={submission.id} onStatus={saveStatus} savingId={savingId} submission={submission} />) : <p id={`bb-owner-contacts-empty`} className={`bb-owner-records-empty`}>No contact requests yet.</p>}
                </div>
              </section>
              <section id={`bb-owner-appointments`} className={`bb-owner-records`} aria-labelledby={`bb-owner-appointments-title`}>
                <h2 id={`bb-owner-appointments-title`} className={`bb-owner-records-title`}><CalendarDays size={22} aria-hidden={`true`} />Appointment Requests</h2>
                <div id={`bb-owner-appointments-list`} className={`bb-owner-submission-list`}>
                  {overview.appointments.length ? overview.appointments.map((submission) => <OwnerSubmissionCard kind={`appointment`} key={submission.id} onStatus={saveStatus} savingId={savingId} submission={submission} />) : <p id={`bb-owner-appointments-empty`} className={`bb-owner-records-empty`}>No appointment requests yet.</p>}
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </AccountAccess>
  );
};

export default OwnerDashboard;
