'use client';

import Link from 'next/link';
import { useShop } from '@/shared/shop/shop-context';
import type { Product } from '@/shared/types/storefront';
import { ArrowUpRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import { formatPrice, getProductHref } from '@/shared/shop/shop-utils';
import ProductArtwork from '@/app/components/shop/product-artwork/product-artwork';

type ProductCardProps = {
  product: Product;
  idPrefix?: string;
};

const ProductCard = ({ product, idPrefix = `bb-shop-card` }: ProductCardProps) => {
  const { lines, addProduct, decrementProduct } = useShop();
  const quantity = lines.find((line) => line.product.id === product.id)?.quantity ?? 0;
  const cardId = `${idPrefix}-${product.id}`;

  return (
    <article
      id={cardId}
      className={`bb-shop-card`}
      aria-labelledby={`${cardId}-title`}
    >
      <Link
        id={`${cardId}-artwork-link`}
        href={getProductHref(product.id)}
        className={`bb-shop-card-visual${product.image ? ` has-photo` : ``}`}
        aria-label={`Explore ${product.name}`}
      >
        <span id={`${cardId}-label`} className={`bb-shop-card-label`}>{product.label}</span>
        <ProductArtwork product={product} />
        <span id={`${cardId}-explore`} className={`bb-shop-card-explore`} aria-hidden={`true`}>
          <ArrowUpRight size={18} />
        </span>
      </Link>
      <div id={`${cardId}-body`} className={`bb-shop-card-body`}>
        <Link id={`${cardId}-title-link`} className={`bb-shop-card-title-link`} href={getProductHref(product.id)}>
          <h3 id={`${cardId}-title`} className={`bb-shop-card-title`}>{product.name}</h3>
        </Link>
        <p id={`${cardId}-description`} className={`bb-shop-card-description`}>{product.description}</p>
        <div id={`${cardId}-bottom`} className={`bb-shop-card-bottom`}>
          <span id={`${cardId}-price`} className={`bb-shop-card-price`}>{formatPrice(product.price)}</span>
          {quantity ? (
            <div id={`${cardId}-quantity`} className={`bb-shop-card-quantity`} role={`group`} aria-label={`${product.name} bag quantity`}>
              <button
                type={`button`}
                id={`${cardId}-decrease`}
                className={`bb-shop-card-quantity-button`}
                onClick={() => decrementProduct(product.id)}
                aria-label={`Remove one ${product.name} from your bag`}
              >
                <Minus size={13} aria-hidden={`true`} />
              </button>
              <output id={`${cardId}-quantity-value`} className={`bb-shop-card-quantity-value`} aria-live={`polite`}>{quantity}</output>
              <button
                type={`button`}
                id={`${cardId}-increase`}
                onClick={() => addProduct(product)}
                className={`bb-shop-card-quantity-button`}
                aria-label={`Add one ${product.name} to your bag`}
              >
                <Plus size={13} aria-hidden={`true`} />
              </button>
            </div>
          ) : (
            <button
              type={`button`}
              id={`${cardId}-add`}
              className={`bb-shop-card-add`}
              onClick={() => addProduct(product)}
              aria-label={`Add ${product.name} to your bag`}
            >
              <ShoppingBag size={14} aria-hidden={`true`} /> Add to Bag
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
