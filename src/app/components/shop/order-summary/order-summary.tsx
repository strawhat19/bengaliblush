'use client';

import type { ReactNode } from 'react';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { useShop } from '@/shared/shop/shop-context';
import ProductArtwork from '../product-artwork/product-artwork';
import Link from '@/app/components/navigation/page-link/page-link';
import { formatPrice, getProductHref } from '@/shared/shop/shop-utils';

type OrderSummaryProps = {
  id: string;
  children?: ReactNode;
  showProducts?: boolean;
};

export default function OrderSummary({ id, children, showProducts = true }: OrderSummaryProps) {
  const { count, lines, subtotal } = useShop();

  return (
    <aside id={id} className={`bb-order-summary`} aria-labelledby={`${id}-title`}>
      <span id={`${id}-eyebrow`} className={`bb-order-summary-eyebrow`}><Sparkles size={13} aria-hidden={`true`} />The Finishing Touch</span>
      <div id={`${id}-heading`} className={`bb-order-summary-heading`}>
        <h2 id={`${id}-title`} className={`bb-order-summary-title`}>Your selection.</h2>
        <span id={`${id}-count`} className={`bb-order-summary-count`}><ShoppingBag size={13} aria-hidden={`true`} />{count} {count === 1 ? `item` : `items`}</span>
      </div>
      {showProducts && (
        <ul id={`${id}-products`} className={`bb-order-summary-products`}>
          {lines.map(({ product, quantity }) => (
            <li key={product.id} id={`${id}-product-${product.id}`} className={`bb-order-summary-product`}>
              <Link id={`${id}-artwork-link-${product.id}`} className={`bb-order-summary-artwork`} href={getProductHref(product)} aria-label={`View ${product.name}`}>
                <ProductArtwork product={product} context={`cart`} />
              </Link>
              <div id={`${id}-product-copy-${product.id}`} className={`bb-order-summary-product-copy`}>
                <Link id={`${id}-product-link-${product.id}`} className={`bb-order-summary-product-link`} href={getProductHref(product)}>{product.name}</Link>
                <span id={`${id}-quantity-${product.id}`} className={`bb-order-summary-quantity`}>Quantity {quantity}</span>
              </div>
              <span id={`${id}-price-${product.id}`} className={`bb-order-summary-product-price`}>{formatPrice(product.price * quantity)}</span>
            </li>
          ))}
        </ul>
      )}
      <dl id={`${id}-totals`} className={`bb-order-summary-totals`}>
        <div id={`${id}-subtotal-row`} className={`bb-order-summary-total-row`}>
          <dt id={`${id}-subtotal-label`} className={`bb-order-summary-total-label`}>Item subtotal</dt>
          <dd id={`${id}-subtotal-value`} className={`bb-order-summary-subtotal`}>{formatPrice(subtotal)}</dd>
        </div>
        <div id={`${id}-shipping-row`} className={`bb-order-summary-total-row`}>
          <dt id={`${id}-shipping-label`} className={`bb-order-summary-total-label`}>Shipping</dt>
          <dd id={`${id}-shipping-value`} className={`bb-order-summary-pending`}>To be confirmed</dd>
        </div>
        <div id={`${id}-tax-row`} className={`bb-order-summary-total-row`}>
          <dt id={`${id}-tax-label`} className={`bb-order-summary-total-label`}>Tax</dt>
          <dd id={`${id}-tax-value`} className={`bb-order-summary-pending`}>To be confirmed</dd>
        </div>
      </dl>
      <p id={`${id}-total-note`} className={`bb-order-summary-total-note`}>The studio will confirm availability, final pricing, shipping, and tax. This request does not collect a payment.</p>
      {children && <div id={`${id}-actions`} className={`bb-order-summary-actions`}>{children}</div>}
      <div id={`${id}-signature`} className={`bb-order-summary-signature`} aria-hidden={`true`}>A little Bengali Blush</div>
    </aside>
  );
}
