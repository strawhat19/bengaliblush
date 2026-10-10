import { siteRoutes } from './routes';
import type { AdminNavigationCounts } from '@/api/navigation';

export const getNavigationCountLabel = (label: string, count = 0) => count > 0 ? `${label}, ${count.toLocaleString(`en-US`)} Item(s)` : label;

export const getNavigationBadgeCounts = (counts: AdminNavigationCounts | null, hasProfile: boolean): Readonly<Record<string, number>> => {
  if (!counts) return { [siteRoutes.profile.href]: Number(hasProfile) };
  const reports = counts.users + counts.contacts + counts.appointments;
  const dashboard = reports + counts.orders + counts.reviews + counts.products + counts.services + counts.paymentMethods + counts.notifications;
  return {
    studio: counts.gallery + counts.services + counts.notifications,
    feedback: counts.reviews + counts.contacts + counts.appointments,
    [siteRoutes.dashboard.href]: dashboard,
    [siteRoutes.profile.href]: Number(hasProfile),
    [siteRoutes.adminUsers.href]: counts.users,
    [siteRoutes.adminReports.href]: reports,
    [siteRoutes.adminAnalytics.href]: dashboard,
    [siteRoutes.adminOrders.href]: counts.orders,
    [siteRoutes.adminReviews.href]: counts.reviews,
    [siteRoutes.adminGallery.href]: counts.gallery,
    [siteRoutes.adminRequests.href]: counts.contacts,
    [siteRoutes.adminServices.href]: counts.services,
    [siteRoutes.adminProducts.href]: counts.products,
    [siteRoutes.adminShop.href]: counts.orders + counts.products,
    [siteRoutes.adminAppointments.href]: counts.appointments,
    [siteRoutes.adminNotifications.href]: counts.notifications,
    [siteRoutes.adminPaymentMethods.href]: counts.paymentMethods,
  };
};
