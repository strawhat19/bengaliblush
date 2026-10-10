import type { OwnerOverview } from '@/api/owner';
import type { CommerceOverview } from '@/api/commerce';
import type { NotificationRecord } from '@/shared/models/notifications/Notification';

export type DashboardSection = `overview` | `users` | `contacts` | `appointments`;
export type DashboardView = `overview` | `reports` | `analytics`;

export const dashboardSections = {
  overview: { title: `Your Studio, At A Glance`, description: `Accounts, catalog, reviews, notifications, and requests from your studio database.` },
  users: { title: `Studio Accounts`, description: `Registered accounts, roles, and account status.` },
  contacts: { title: `Requests`, description: `Messages from guests and account holders, ready for your review.` },
  appointments: { title: `Appointment Requests`, description: `Requested services, preferred dates, and booking details.` },
};

export const dashboardViews = {
  reports: { title: `Studio Reports`, description: `Recent requests, appointment requests, and registered accounts from your studio database.` },
  analytics: { title: `Studio Analytics`, description: `Studio activity trends, request statuses, and counts from your recent database records.` },
};

export const formatRecordDate = (value: string, includeTime = false) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return `—`;
  return includeTime ? date.toLocaleString() : date.toLocaleDateString();
};

export const getDashboardSummary = (overview: OwnerOverview, loadedAt: string, commerce?: CommerceOverview | null, notifications: NotificationRecord[] = []) => {
  const requests = [...overview.contacts, ...overview.appointments, ...(commerce?.orders ?? [])];
  const referenceDate = new Date(loadedAt);
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 5 + index, 1);
    return {
      users: 0,
      orders: 0,
      reviews: 0,
      contacts: 0,
      appointments: 0,
      notifications: 0,
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString(undefined, { month: `short` }),
      fullLabel: date.toLocaleDateString(undefined, { year: `numeric`, month: `long` }),
    };
  });
  const collections = { ...overview, notifications, orders: commerce?.orders ?? [], reviews: commerce?.reviews ?? [] };
  for (const collection of [`users`, `contacts`, `appointments`, `orders`, `reviews`, `notifications`] as const) {
    for (const record of collections[collection]) {
      const date = new Date(record.created_at);
      const month = months.find((item) => item.key === `${date.getFullYear()}-${date.getMonth()}`);
      if (month) month[collection] += 1;
    }
  }
  const statuses = [
    { count: requests.filter((item) => [`declined`, `cancelled`].includes(item.status)).length, label: `Declined / Cancelled`, color: `#dc2626` },
    { count: requests.filter((item) => [`completed`, `fulfilled`].includes(item.status)).length, label: `Completed`, color: `#16a34a` },
    { count: requests.filter((item) => [`new`, `requested`].includes(item.status)).length, label: `Awaiting Review`, color: `#8d3047` },
    { count: requests.filter((item) => [`reviewed`, `confirmed`].includes(item.status)).length, label: `In Progress`, color: `#d4a017` },
  ];
  return { months, statuses, totalRequests: requests.length, pending: requests.filter((item) => [`new`, `requested`].includes(item.status)).length };
};

export type DashboardSummary = ReturnType<typeof getDashboardSummary>;
