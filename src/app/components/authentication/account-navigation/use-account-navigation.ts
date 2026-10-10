import type { LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes, type SiteRoute } from '@/shared/navigation/routes';
import { useAccountNavigationState } from '@/shared/accountNavigationContext/useAccountNavigationState';
import { Bell, Quote, Users, Package, UserRound, CreditCard, ReceiptText, CalendarDays, ShoppingBag, MessageCircle, WandSparkles, LayoutDashboard } from 'lucide-react';

type AccountNavigationLink = {
  route: SiteRoute;
  Icon: LucideIcon;
  children?: readonly AccountNavigationLink[];
};

const adminLinks: readonly AccountNavigationLink[] = [
  { route: siteRoutes.dashboard, Icon: LayoutDashboard },
  { route: siteRoutes.adminUsers, Icon: Users },
  { route: siteRoutes.adminNotifications, Icon: Bell },
  { route: siteRoutes.adminServices, Icon: WandSparkles },
  {
    Icon: ShoppingBag,
    route: siteRoutes.adminShop,
    children: [
      { route: siteRoutes.adminOrders, Icon: ReceiptText },
      { route: siteRoutes.adminProducts, Icon: Package },
    ],
  },
  { route: siteRoutes.adminEvents, Icon: CalendarDays },
  { route: siteRoutes.adminReviews, Icon: Quote },
  { route: siteRoutes.adminRequests, Icon: MessageCircle },
  { route: siteRoutes.adminPaymentMethods, Icon: CreditCard },
  { route: siteRoutes.adminAppointments, Icon: CalendarDays },
];
const accountLinks: readonly AccountNavigationLink[] = [{ route: siteRoutes.profile, Icon: UserRound }];

export const useAccountNavigation = () => {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const navigationState = useAccountNavigationState();
  return { isAdmin, pathname, adminLinks, accountLinks, ...navigationState };
};
