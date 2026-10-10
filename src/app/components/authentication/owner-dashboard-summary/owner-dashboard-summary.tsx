import './owner-dashboard-summary.scss';
import type { CSSProperties } from 'react';
import type { OwnerOverview } from '@/api/owner';
import type { CommerceOverview } from '@/api/commerce';
import { siteRoutes } from '@/shared/navigation/routes';
import Link from '@/app/components/navigation/page-link/page-link';
import type { DashboardSummary } from '../owner-dashboard/dashboard-data';
import type { NotificationRecord } from '@/shared/models/notifications/Notification';
import { Bell, Quote, Users, Package, CreditCard, ReceiptText, ArrowUpRight, CalendarDays, MessageCircle, WandSparkles } from 'lucide-react';

const activityCategories = [
  { id: `users`, label: `Accounts` },
  { id: `contacts`, label: `Requests` },
  { id: `orders`, label: `Orders` },
  { id: `reviews`, label: `Reviews` },
  { id: `appointments`, label: `Appointments` },
  { id: `notifications`, label: `Notifications` },
] as const;

const OwnerDashboardSummary = ({ summary, overview, commerce, notifications }: { summary: DashboardSummary; overview: OwnerOverview; notifications: NotificationRecord[]; commerce?: CommerceOverview | null }) => {
  const { months, statuses, totalRequests } = summary;
  const maxActivity = Math.max(1, ...months.flatMap((month) => activityCategories.map(({ id }) => month[id])));
  const activityTotal = months.reduce((total, month) => total + activityCategories.reduce((count, { id }) => count + month[id], 0), 0);
  let segmentStart = 0;
  const gradient = statuses.filter(({ count }) => count > 0).map(({ color, count }) => {
    const end = segmentStart + (count / totalRequests) * 100;
    const segment = `${color} ${segmentStart}% ${end}%`;
    segmentStart = end;
    return segment;
  }).join(`, `);
  const counts = [
    { id: `users`, icon: Users, label: `Users`, count: overview.users.length, href: siteRoutes.adminUsers.href },
    { id: `contacts`, icon: MessageCircle, label: `Requests`, count: overview.contacts.length, href: siteRoutes.adminRequests.href },
    { id: `appointments`, icon: CalendarDays, label: `Appointments`, count: overview.appointments.length, href: siteRoutes.adminAppointments.href },
    { id: `notifications`, icon: Bell, label: `Notifications`, count: notifications.length, href: siteRoutes.adminNotifications.href },
    ...(commerce ? [
      { id: `orders`, icon: ReceiptText, label: `Orders`, count: commerce.orders.length, href: siteRoutes.adminOrders.href },
      { id: `reviews`, icon: Quote, label: `Reviews`, count: commerce.reviews.length, href: siteRoutes.adminReviews.href },
      { id: `products`, icon: Package, label: `Products`, count: commerce.products.length, href: siteRoutes.adminProducts.href },
      { id: `services`, icon: WandSparkles, label: `Services`, count: commerce.services.length, href: siteRoutes.adminServices.href },
      { id: `payment-methods`, icon: CreditCard, label: `Payments`, count: commerce.paymentMethods.length, href: siteRoutes.adminPaymentMethods.href },
    ] : []),
  ];

  return (
    <>
      <div id={`bb-owner-dashboard-charts`} className={`bb-owner-dashboard-charts`}>
        <section id={`bb-owner-activity`} className={`bb-owner-chart-panel`} aria-labelledby={`bb-owner-activity-title`}>
          <div id={`bb-owner-activity-heading`} className={`bb-owner-chart-heading`}>
            <h2 id={`bb-owner-activity-title`} className={`bb-owner-chart-title`}>Studio Activity</h2>
            <span id={`bb-owner-activity-caption`} className={`bb-owner-chart-caption`}>Recent Records · Last 6 Months</span>
          </div>
          <div id={`bb-owner-activity-legend`} className={`bb-owner-chart-legend`}>
            {activityCategories.map(({ id, label }) => <span key={id} id={`bb-owner-activity-legend-${id}`} className={`bb-owner-chart-key is-${id}`}><span id={`bb-owner-activity-legend-dot-${id}`} className={`bb-owner-chart-key-dot`} aria-hidden={`true`} />{label}</span>)}
          </div>
          <div id={`bb-owner-activity-bars`} className={`bb-owner-activity-bars`} role={`img`} aria-label={`New database records over the last six months. ${months.map((month) => `${month.fullLabel}: ${activityCategories.map(({ id, label }) => `${month[id]} ${label.toLowerCase()}`).join(`, `)}`).join(`. `)}`}>
            {months.map((month) => (
              <div key={month.key} id={`bb-owner-activity-month-${month.key}`} className={`bb-owner-activity-month`} aria-hidden={`true`}>
                <div id={`bb-owner-activity-group-${month.key}`} className={`bb-owner-activity-group`}>
                  {activityCategories.map(({ id, label }) => (
                    <span
                      key={id}
                      className={`bb-owner-activity-bar is-${id}`}
                      id={`bb-owner-activity-${month.key}-${id}`}
                      title={`${month.fullLabel}: ${month[id]} ${label}`}
                      style={{ '--bb-bar-height': `${month[id] / maxActivity * 100}%` } as CSSProperties}
                    />
                  ))}
                </div>
                <span id={`bb-owner-activity-label-${month.key}`} className={`bb-owner-activity-label`}>{month.label}</span>
              </div>
            ))}
          </div>
          <p id={`bb-owner-activity-note`} className={`bb-owner-chart-note`}>{activityTotal ? `${activityTotal} Record(s) Created In This Period` : `No new records in this period.`}</p>
        </section>
        <section id={`bb-owner-request-status`} className={`bb-owner-chart-panel`} aria-labelledby={`bb-owner-request-status-title`}>
          <div id={`bb-owner-request-status-heading`} className={`bb-owner-chart-heading`}>
            <h2 id={`bb-owner-request-status-title`} className={`bb-owner-chart-title`}>Request Status</h2>
            <span id={`bb-owner-request-status-caption`} className={`bb-owner-chart-caption`}>Recent Requests</span>
          </div>
          <div id={`bb-owner-status-chart-content`} className={`bb-owner-status-chart-content`}>
            <div
              role={`img`}
              id={`bb-owner-status-donut`}
              className={`bb-owner-status-donut`}
              style={{ background: gradient ? `conic-gradient(${gradient})` : `hsl(var(--primary) / .08)` }}
              aria-label={totalRequests ? statuses.map(({ label, count }) => `${label}: ${count}`).join(`, `) : `No Requests Yet`}
            >
              <span id={`bb-owner-status-donut-center`} className={`bb-owner-status-donut-center`} aria-hidden={`true`}>
                <strong id={`bb-owner-status-total`} className={`bb-owner-status-total`}>{totalRequests}</strong>
                <span id={`bb-owner-status-total-label`} className={`bb-owner-status-total-label`}>Request(s)</span>
              </span>
            </div>
            <ul id={`bb-owner-status-legend`} className={`bb-owner-status-legend`}>
              {statuses.map(({ label, count, color }, index) => (
                <li key={label} id={`bb-owner-status-legend-${index}`} className={`bb-owner-status-legend-item`}>
                  <span id={`bb-owner-status-legend-dot-${index}`} className={`bb-owner-status-legend-dot`} style={{ background: color }} aria-hidden={`true`} />
                  <span id={`bb-owner-status-legend-label-${index}`} className={`bb-owner-status-legend-label`}>{label}</span>
                  <strong id={`bb-owner-status-legend-count-${index}`} className={`bb-owner-status-legend-count`}>{count}</strong>
                </li>
              ))}
            </ul>
          </div>
          <p id={`bb-owner-status-chart-note`} className={`bb-owner-chart-note`}>{totalRequests ? `Messages, Appointments, And Order Requests` : `Saved requests will appear here.`}</p>
        </section>
      </div>
      <div id={`bb-owner-dashboard-counts`} className={`bb-owner-dashboard-counts`}>
        {counts.map(({ id, icon: Icon, label, count, href }) => (
          <Link key={id} href={href} id={`bb-owner-count-${id}`} className={`bb-owner-dashboard-count`}>
            <Icon size={15} aria-hidden={`true`} />
            <span id={`bb-owner-count-label-${id}`} className={`bb-owner-dashboard-count-label`}>{label}</span>
            <strong id={`bb-owner-count-value-${id}`} className={`bb-owner-dashboard-count-value`}>{count}</strong>
            <ArrowUpRight size={12} aria-hidden={`true`} className={`bb-owner-count-arrow`} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default OwnerDashboardSummary;
