import type { LucideIcon } from 'lucide-react';
import { siteRoutes, type SiteRoute } from '@/shared/navigation/routes';
import { Bell, Quote, Users, Images, Palette, Package, FileText, UserRound, CreditCard, ReceiptText, CalendarDays, ShoppingBag, MessageCircle, WandSparkles, LayoutDashboard, MessageSquareText } from 'lucide-react';

type AccountNavigationLink = {
  id?: string;
  label?: string;
  route: SiteRoute;
  Icon: LucideIcon;
  children?: readonly AccountNavigationLink[];
};

type AccountNavigationGroup = {
  id: string;
  label: string;
  route: SiteRoute;
  Icon: LucideIcon;
  children: readonly AccountNavigationLink[];
};

type AccountNavigationItem = AccountNavigationLink | AccountNavigationGroup;

export const adminLinks: readonly AccountNavigationItem[] = [
  {
    route: siteRoutes.dashboard,
    Icon: LayoutDashboard,
    children: [
      { route: siteRoutes.adminUsers, Icon: Users },
      { route: siteRoutes.adminReports, Icon: FileText },
      { route: siteRoutes.adminAnalytics, Icon: LayoutDashboard },
      { route: siteRoutes.adminPaymentMethods, Icon: CreditCard },
    ],
  },
  {
    id: `studio`,
    Icon: Palette,
    label: `Studio`,
    route: siteRoutes.adminStudio,
    children: [
      { route: siteRoutes.adminEvents, Icon: CalendarDays },
      { route: siteRoutes.adminGallery, Icon: Images },
      { route: siteRoutes.adminServices, Icon: WandSparkles },
      { route: siteRoutes.adminNotifications, Icon: Bell },
    ],
  },
  {
    id: `feedback`,
    label: `Feedback`,
    Icon: MessageSquareText,
    route: siteRoutes.adminFeedback,
    children: [
      { route: siteRoutes.adminChats, Icon: MessageSquareText },
      { route: siteRoutes.adminReviews, Icon: Quote },
      { route: siteRoutes.adminRequests, Icon: MessageCircle },
      { route: siteRoutes.adminAppointments, Icon: CalendarDays },
    ],
  },
  {
    Icon: ShoppingBag,
    route: siteRoutes.adminShop,
    children: [
      { route: siteRoutes.adminOrders, Icon: ReceiptText },
      { route: siteRoutes.adminProducts, Icon: Package },
    ],
  },
];
export const getAdminParentMenuLabel = (route: SiteRoute) => {
  const parentMenu = adminLinks.find(({ route: menuRoute, children }) => menuRoute.href === route.href || children?.some(({ route: childRoute }) => childRoute.href === route.href));
  return parentMenu?.label ?? parentMenu?.route.label ?? route.label;
};

export const accountLinks: readonly AccountNavigationLink[] = [{ route: siteRoutes.profile, Icon: UserRound }];
export const expandableNavigationKeys = [...accountLinks, ...adminLinks].filter((item) => item.children?.length).map((item) => item.id ?? item.route.href);
