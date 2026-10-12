import type { LucideIcon } from 'lucide-react';
import { Roles, hasAdminAccess } from '@/types/types';
import { siteRoutes, type SiteRoute } from '@/shared/navigation/routes';
import { Cpu, Bell, Flag, Quote, Users, Images, Palette, Package, FileText, UserRound, CreditCard, ReceiptText, CalendarDays, ShoppingBag, MessageCircle, WandSparkles, LayoutDashboard, MessageSquareText, ChartNoAxesCombined } from 'lucide-react';

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
      { route: siteRoutes.adminEvents, Icon: CalendarDays },
      { route: siteRoutes.adminStudio, Icon: Palette },
      { route: siteRoutes.adminGallery, Icon: Images },
      { route: siteRoutes.adminServices, Icon: WandSparkles },
      { route: siteRoutes.adminShop, Icon: ShoppingBag },
      { route: siteRoutes.adminProducts, Icon: Package },
      { route: siteRoutes.adminOrders, Icon: ReceiptText },
      { route: siteRoutes.adminPaymentMethods, Icon: CreditCard },
      { route: siteRoutes.adminNotifications, Icon: Bell },
      { route: siteRoutes.adminReports, Icon: FileText },
      { route: siteRoutes.adminAnalytics, Icon: ChartNoAxesCombined },
      { route: siteRoutes.adminHealth, Icon: Cpu },
      { route: siteRoutes.adminFeatures, Icon: Flag },
    ],
  },
  {
    id: `feedback`,
    label: `Feedback`,
    Icon: MessageSquareText,
    route: siteRoutes.adminFeedback,
    children: [
      { route: siteRoutes.adminRequests, Icon: MessageCircle },
      { route: siteRoutes.adminReviews, Icon: Quote },
      { route: siteRoutes.adminChats, Icon: MessageSquareText },
      { route: siteRoutes.adminAppointments, Icon: CalendarDays },
    ],
  },
];
export const getAdminParentMenuLabel = (route: SiteRoute) => {
  const parentMenu = adminLinks.find(({ route: menuRoute, children }) => menuRoute.href === route.href || children?.some(({ route: childRoute }) => childRoute.href === route.href));
  return parentMenu?.label ?? parentMenu?.route.label ?? route.label;
};

export const accountLinks: readonly AccountNavigationLink[] = [{ route: siteRoutes.profile, Icon: UserRound }];
export const expandableNavigationKeys = [...accountLinks, ...adminLinks].filter((item) => item.children?.length).map((item) => item.id ?? item.route.href);
export const canAccessAccountRoute = (route: SiteRoute, role?: Roles) => {
  if (!role) return false;
  if (route.minimumRole === Roles.Owner) return role === Roles.Owner;
  if (route.minimumRole === Roles.Admin) return hasAdminAccess(role);
  return true;
};
export const getAllowedAccountNavigation = (items: readonly AccountNavigationItem[], role?: Roles) => items
  .filter(({ route }) => canAccessAccountRoute(route, role))
  .map((item) => ({ ...item, children: item.children?.filter(({ route }) => canAccessAccountRoute(route, role)) }));
export const getAllowedExpandableNavigationKeys = (role?: Roles) => getAllowedAccountNavigation([...accountLinks, ...adminLinks], role)
  .filter(({ children }) => children?.length)
  .map((item) => item.id ?? item.route.href);
