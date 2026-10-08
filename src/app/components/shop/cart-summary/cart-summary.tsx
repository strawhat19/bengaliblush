'use client';

import Link from 'next/link';
import { useShop } from '@/shared/shop/shop-context';
import OrderSummary from '../order-summary/order-summary';
import CheckoutSteps from '../checkout-steps/checkout-steps';
import { siteRoutes } from '@/shared/navigation/routes';
import { useShopReady } from '../order-summary/use-shop-ready';
import ProductArtwork from '../product-artwork/product-artwork';
import { formatPrice, getProductHref } from '@/shared/shop/shop-utils';
import { Minus, Plus, Trash2, ArrowLeft, ArrowUpRight, ChevronRight, ShoppingBag } from 'lucide-react';

export default function CartSummary() {
  const isReady = useShopReady();
  const { count, lines, removeProduct, incrementProduct, decrementProduct } = useShop();

  return (
    <section id={`top`} className={`bb-section bb-cart-summary-page`} aria-labelledby={`bb-cart-summary-title`}>
      <div id={`bb-cart-summary-container`} className={`bb-container bb-cart-summary-container`}>
        <CheckoutSteps id={`bb-cart-summary-steps`} current={1} />
        <div id={`bb-cart-summary-heading`} className={`bb-cart-summary-heading`}>
          <span id={`bb-cart-summary-eyebrow`} className={`bb-eyebrow`}>Your Misty Market Edit</span>
          <h1 id={`bb-cart-summary-title`} className={`bb-cart-summary-title`}>A little more<br /><em>lovely.</em></h1>
          <p id={`bb-cart-summary-description`} className={`bb-cart-summary-description`}>A few things you love, all in one place. Make your selection just right before the finishing touches.</p>
        </div>
        {!isReady ? (
          <div id={`bb-cart-summary-loading`} className={`bb-cart-summary-loading`} role={`status`}>
            <ShoppingBag size={25} strokeWidth={1.3} aria-hidden={`true`} />
            <p id={`bb-cart-summary-loading-copy`} className={`bb-cart-summary-loading-copy`}>Gathering your lovely finds…</p>
          </div>
        ) : lines.length ? (
          <div id={`bb-cart-summary-layout`} className={`bb-cart-summary-layout`}>
            <div id={`bb-cart-summary-selection`} className={`bb-cart-summary-selection`}>
              <div id={`bb-cart-summary-list-heading`} className={`bb-cart-summary-list-heading`}>
                <h2 id={`bb-cart-summary-list-title`} className={`bb-cart-summary-list-title`}>In your bag</h2>
                <span id={`bb-cart-summary-item-count`} className={`bb-cart-summary-item-count`}>{count} {count === 1 ? `lovely find` : `lovely finds`}</span>
              </div>
              <ul id={`bb-cart-summary-lines`} className={`bb-cart-summary-lines`}>
                {lines.map(({ product, quantity }) => (
                  <li key={product.id} id={`bb-cart-summary-line-${product.id}`} className={`bb-cart-summary-line`}>
                    <Link id={`bb-cart-summary-artwork-${product.id}`} className={`bb-cart-summary-artwork`} href={getProductHref(product.id)} aria-label={`View ${product.name}`}>
                      <ProductArtwork product={product} context={`cart`} />
                    </Link>
                    <div id={`bb-cart-summary-product-details-${product.id}`} className={`bb-cart-summary-product-details`}>
                      <span id={`bb-cart-summary-product-label-${product.id}`} className={`bb-cart-summary-product-label`}>{product.label}</span>
                      <Link id={`bb-cart-summary-product-link-${product.id}`} className={`bb-cart-summary-product-link`} href={getProductHref(product.id)}>
                        <h3 id={`bb-cart-summary-product-name-${product.id}`} className={`bb-cart-summary-product-name`}>{product.name}</h3>
                      </Link>
                      <p id={`bb-cart-summary-unit-price-${product.id}`} className={`bb-cart-summary-unit-price`}>{formatPrice(product.price)} each</p>
                      <div id={`bb-cart-summary-product-actions-${product.id}`} className={`bb-cart-summary-product-actions`}>
                        <div id={`bb-cart-summary-quantity-${product.id}`} className={`bb-cart-summary-quantity`}>
                          <button
                            type={`button`}
                            onClick={() => decrementProduct(product.id)}
                            id={`bb-cart-summary-decrease-${product.id}`}
                            className={`bb-cart-summary-quantity-button`}
                            aria-label={`Decrease quantity of ${product.name}`}
                          ><Minus size={13} aria-hidden={`true`} /></button>
                          <output id={`bb-cart-summary-quantity-value-${product.id}`} className={`bb-cart-summary-quantity-value`} aria-label={`Quantity of ${product.name}`} aria-live={`polite`}>{quantity}</output>
                          <button
                            type={`button`}
                            onClick={() => incrementProduct(product)}
                            id={`bb-cart-summary-increase-${product.id}`}
                            className={`bb-cart-summary-quantity-button`}
                            aria-label={`Increase quantity of ${product.name}`}
                          ><Plus size={13} aria-hidden={`true`} /></button>
                        </div>
                        <button
                          type={`button`}
                          onClick={() => removeProduct(product.id)}
                          id={`bb-cart-summary-remove-${product.id}`}
                          className={`bb-cart-summary-remove`}
                          aria-label={`Remove ${product.name} from your bag`}
                        ><Trash2 size={12} aria-hidden={`true`} />Remove</button>
                      </div>
                    </div>
                    <strong id={`bb-cart-summary-line-total-${product.id}`} className={`bb-cart-summary-line-total`}>{formatPrice(product.price * quantity)}</strong>
                  </li>
                ))}
              </ul>
              <Link id={`bb-cart-summary-continue-shopping`} className={`bb-cart-summary-continue-shopping`} href={siteRoutes.shop.href}><ArrowLeft size={14} aria-hidden={`true`} />A little more browsing</Link>
              <div id={`bb-cart-summary-preview-note`} className={`bb-cart-summary-preview-note`}>
                <ShoppingBag size={18} aria-hidden={`true`} />
                <p id={`bb-cart-summary-preview-copy`} className={`bb-cart-summary-preview-copy`}>The shop is getting ready to bloom. You can curate your bag and preview checkout while we prepare for our first orders.</p>
              </div>
            </div>
            <OrderSummary id={`bb-cart-page-order-summary`} showProducts={false}>
              <Link id={`bb-cart-summary-checkout`} className={`bb-button bb-cart-summary-checkout`} href={siteRoutes.checkout.href}>Continue to checkout <ChevronRight size={16} aria-hidden={`true`} /></Link>
              <p id={`bb-cart-summary-checkout-note`} className={`bb-cart-summary-checkout-note`}>Checkout preview. Orders and payments are not available yet.</p>
            </OrderSummary>
          </div>
        ) : (
          <div id={`bb-cart-summary-empty`} className={`bb-cart-summary-empty`}>
            <span id={`bb-cart-summary-empty-icon`} className={`bb-cart-summary-empty-icon`} aria-hidden={`true`}><ShoppingBag size={29} strokeWidth={1.2} /></span>
            <h2 id={`bb-cart-summary-empty-title`} className={`bb-cart-summary-empty-title`}>Room for something beautiful.</h2>
            <p id={`bb-cart-summary-empty-copy`} className={`bb-cart-summary-empty-copy`}>Your bag is waiting for its first lovely find. Explore the Misty Market and make a little edit of your own.</p>
            <Link id={`bb-cart-summary-empty-shop`} className={`bb-button bb-cart-summary-checkout`} href={siteRoutes.shop.href}>Explore the shop <ArrowUpRight size={15} aria-hidden={`true`} /></Link>
          </div>
        )}
      </div>
    </section>
  );
}
