'use client';

import './admin-shop.scss';
import { useAdminShop } from './use-admin-shop';
import '../profile-page/profile-page.scss';
import '../owner-dashboard/owner-dashboard.scss';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import AccountAccess from '../account-access/account-access';
import Link from '@/app/components/navigation/page-link/page-link';
import AccountNavigation from '../account-navigation/account-navigation';
import { Package, CreditCard, ReceiptText, ShoppingBag, RotateCcw, ArrowUpRight } from 'lucide-react';

const AdminShopContent = () => {
  const { error, reload, loading, overview, categories, refreshing, activeProducts, availableMethods, pendingOrders, quotedSubtotal } = useAdminShop();
  const counts = [
    { id: `products`, Icon: Package, label: `Active Product(s)`, value: activeProducts, route: siteRoutes.adminProducts },
    { id: `orders`, Icon: ReceiptText, label: `Order Request(s)`, value: overview?.orders.length ?? 0, route: siteRoutes.adminOrders },
    { id: `pending`, Icon: ShoppingBag, label: `Awaiting Review`, value: pendingOrders, route: siteRoutes.adminOrders },
    { id: `methods`, Icon: CreditCard, label: `Available Manual Method(s)`, value: availableMethods, route: siteRoutes.adminPaymentMethods },
  ];
  return (
    <section id={`bb-admin-shop`} className={`bb-section bb-owner-dashboard bb-admin-shop`} aria-labelledby={`bb-admin-shop-title`}>
      <div id={`bb-admin-shop-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`bb-admin-shop-content`} className={`bb-owner-dashboard-content`} aria-busy={loading || refreshing}>
          <div id={`bb-admin-shop-heading`} className={`bb-owner-dashboard-heading`}>
            <div id={`bb-admin-shop-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`bb-admin-shop-eyebrow`} className={`bb-eyebrow`}>Admin · Shop</span>
              <h1 id={`bb-admin-shop-title`} className={`bb-owner-dashboard-title`}>Your Shop</h1>
              <p id={`bb-admin-shop-description`} className={`bb-owner-dashboard-description`}>Catalog availability and requests among the latest 50 records per collection. Open a record page to browse older entries.</p>
            </div>
            <button type={`button`} disabled={loading || refreshing} id={`bb-admin-shop-refresh`} className={`bb-button bb-button-outline bb-button-outline-dark bb-owner-dashboard-refresh`} onClick={() => { void reload(); }}>
              <RotateCcw size={15} aria-hidden={`true`} />{refreshing ? `Refreshing` : `Refresh`}
            </button>
          </div>
          {error && <p id={`bb-admin-shop-error`} className={`bb-owner-dashboard-error`} role={`alert`}>{error}</p>}
          {loading ? <p id={`bb-admin-shop-loading`} className={`bb-owner-dashboard-description`} role={`status`}>Loading Shop Records</p> : overview && (
            <>
              <div id={`bb-admin-shop-counts`} className={`bb-admin-shop-counts`}>
                {counts.map(({ id, Icon, label, value, route }) => (
                  <Link key={id} href={route.href} id={`bb-admin-shop-count-${id}`} className={`bb-admin-shop-count`}>
                    <Icon size={18} aria-hidden={`true`} /><strong id={`bb-admin-shop-value-${id}`} className={`bb-admin-shop-count-value`}>{value}</strong><span id={`bb-admin-shop-label-${id}`} className={`bb-admin-shop-count-label`}>{label}</span>
                  </Link>
                ))}
              </div>
              <div id={`bb-admin-shop-payment-note`} className={`bb-admin-shop-panel`}>
                <h2 id={`bb-admin-shop-payment-title`} className={`bb-admin-shop-panel-title`}><CreditCard size={18} aria-hidden={`true`} />Payments</h2>
                <p id={`bb-admin-shop-payment-copy`}>Orders are saved as unpaid requests. Card payments stay disabled until Stripe is connected.</p>
                <p id={`bb-admin-shop-quoted-total`}>Quoted Product Subtotal: <strong>{new Intl.NumberFormat(undefined, { style: `currency`, currency: `USD` }).format(quotedSubtotal / 100)}</strong></p>
                <p id={`bb-admin-shop-subtotal-note`} className={`bb-admin-shop-muted`}>Across recent non-cancelled requests. Delivery, tax, final availability, and payment are confirmed separately.</p>
                <Link href={siteRoutes.adminPaymentMethods.href} id={`bb-admin-shop-manage-methods`} className={`bb-admin-shop-link`}><CreditCard size={15} aria-hidden={`true`} />Manage Payment Methods</Link>
              </div>
              <div id={`bb-admin-shop-categories`} className={`bb-admin-shop-panel`}>
                <h2 id={`bb-admin-shop-categories-title`} className={`bb-admin-shop-panel-title`}><Package size={18} aria-hidden={`true`} />Categories</h2>
                {categories.length ? <ul id={`bb-admin-shop-category-list`} className={`bb-admin-shop-category-list`}>
                  {categories.map(([id, category]) => <li key={id} id={`bb-admin-shop-category-${id}`} className={`bb-admin-shop-category`}><span id={`bb-admin-shop-category-name-${id}`} className={`bb-admin-shop-category-name`}>{category.name}</span><strong id={`bb-admin-shop-category-count-${id}`} className={`bb-admin-shop-category-count`}>{category.products} Product(s)</strong></li>)}
                </ul> : <p id={`bb-admin-shop-category-empty`}>Add products on the Products page to start your shop.</p>}
                <Link href={siteRoutes.shop.href} id={`bb-admin-shop-visit-shop`} className={`bb-admin-shop-link`}><ShoppingBag size={15} aria-hidden={`true`} />Visit Shop<ArrowUpRight size={14} aria-hidden={`true`} /></Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const AdminShop = () => {
  const { user } = useAuth();
  return <AccountAccess adminOnly>{user && <AdminShopContent key={user.id} />}</AccountAccess>;
};

export default AdminShop;
