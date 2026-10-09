'use client';

import useProductDetails from './use-product-details';
import type { Product } from '@/shared/types/storefront';
import { useCatalog } from '@/shared/shop/catalog-context';
import { productCategoryStories } from './product-details-content';
import Link from '@/app/components/navigation/page-link/page-link';
import ProductCard from '@/app/components/shop/product-card/product-card';
import { formatPrice, getProductCategory } from '@/shared/shop/shop-utils';
import ProductArtwork from '@/app/components/shop/product-artwork/product-artwork';
import OrnamentalArch from '@/app/components/effects/ornamental-arch/ornamental-arch';
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, ChevronRight, Heart, Minus, Plus, ShoppingBag, Sparkles } from 'lucide-react';

type ProductDetailsProps = { product: Product };

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { categories, products } = useCatalog();
  const { quantity, addToBag, bagQuantity, addedQuantity, changeQuantity } = useProductDetails(product);
  const category = getProductCategory(product, categories);
  const story = productCategoryStories[category?.id ?? `health`];
  const relatedProducts = (category?.products ?? products.records).filter((item) => item.id !== product.id).slice(0, 4);
  const pageId = `bb-product-details-${product.id}`;

  return (
    <div id={pageId} className={`bb-product-details`}>
      <section id={`top`} className={`bb-product-details-overview`} aria-labelledby={`${pageId}-heading`}>
        <div id={`${pageId}-container`} className={`bb-container`}>
          <nav id={`${pageId}-breadcrumb`} className={`bb-product-details-breadcrumb`} aria-label={`Breadcrumb`}>
            <Link id={`${pageId}-home-link`} className={`bb-product-details-breadcrumb-link`} href={`/`}>Home</Link>
            <ChevronRight size={12} aria-hidden={`true`} />
            <Link id={`${pageId}-shop-link`} className={`bb-product-details-breadcrumb-link`} href={`/shop`}>Shop</Link>
            <ChevronRight size={12} aria-hidden={`true`} />
            <span id={`${pageId}-breadcrumb-current`} className={`bb-product-details-breadcrumb-current`} aria-current={`page`}>{product.name}</span>
          </nav>
          <div id={`${pageId}-overview-grid`} className={`bb-product-details-overview-grid`}>
            <div id={`${pageId}-gallery`} className={`bb-product-details-gallery`}>
              <div id={`${pageId}-artwork-frame`} className={`bb-product-details-artwork-frame${product.image ? ` has-photo` : ``}`}>
                <OrnamentalArch id={`${pageId}-artwork-ornament`} />
                <div id={`${pageId}-artwork`} className={`bb-product-details-artwork${product.image ? ` has-photo` : ``}`}>
                  <span id={`${pageId}-artwork-label`} className={`bb-product-details-artwork-label`}>{product.label}</span>
                  <ProductArtwork product={product} />
                  <span id={`${pageId}-artwork-signature`} className={`bb-product-details-artwork-signature`} aria-hidden={`true`}>Bengali Blush</span>
                </div>
              </div>
              <div id={`${pageId}-gallery-caption`} className={`bb-product-details-gallery-caption`}>
                <span id={`${pageId}-gallery-caption-label`} className={`bb-product-details-gallery-caption-label`}>The Misty Market</span>
                <span id={`${pageId}-gallery-preview-note`} className={`bb-product-details-gallery-preview-note`}>Collection Preview Imagery</span>
              </div>
            </div>
            <div id={`${pageId}-information`} className={`bb-product-details-information`}>
              <span id={`${pageId}-category`} className={`bb-eyebrow`}>{category?.name ?? `The Collection`}</span>
              <h1 id={`${pageId}-heading`} className={`bb-product-details-heading`}>{product.name}</h1>
              <p id={`${pageId}-description`} className={`bb-product-details-description`}>{product.description}</p>
              <div id={`${pageId}-price-row`} className={`bb-product-details-price-row`}>
                <span id={`${pageId}-price`} className={`bb-product-details-price`}>{formatPrice(product.price)}</span>
                <span id={`${pageId}-collection-label`} className={`bb-product-details-collection-label`}><Sparkles size={13} aria-hidden={`true`} /> The Collection</span>
              </div>
              <div id={`${pageId}-purchase`} className={`bb-product-details-purchase`}>
                <div id={`${pageId}-quantity-row`} className={`bb-product-details-quantity-row`}>
                  <span id={`${pageId}-quantity-label`} className={`bb-product-details-quantity-label`}>Quantity</span>
                  <div id={`${pageId}-quantity-control`} className={`bb-product-details-quantity-control`} role={`group`} aria-labelledby={`${pageId}-quantity-label`}>
                    <button
                      type={`button`}
                      disabled={quantity === 1}
                      id={`${pageId}-quantity-decrease`}
                      aria-label={`Decrease selected quantity`}
                      className={`bb-product-details-quantity-button`}
                      onClick={() => changeQuantity(quantity - 1)}
                    >
                      <Minus size={15} aria-hidden={`true`} />
                    </button>
                    <output id={`${pageId}-quantity-value`} className={`bb-product-details-quantity-value`} aria-live={`polite`}>{quantity}</output>
                    <button
                      type={`button`}
                      disabled={quantity === 99}
                      id={`${pageId}-quantity-increase`}
                      aria-label={`Increase selected quantity`}
                      className={`bb-product-details-quantity-button`}
                      onClick={() => changeQuantity(quantity + 1)}
                    >
                      <Plus size={15} aria-hidden={`true`} />
                    </button>
                  </div>
                </div>
                <button
                  type={`button`}
                  onClick={addToBag}
                  id={`${pageId}-add-to-bag`}
                  className={`bb-product-details-add-to-bag`}
                >
                  {addedQuantity ? <Check size={17} aria-hidden={`true`} /> : <ShoppingBag size={17} aria-hidden={`true`} />}
                  {addedQuantity ? `Added to Bag` : `Add to Bag`}
                  <span id={`${pageId}-selected-total`} className={`bb-product-details-selected-total`}>{formatPrice(product.price * quantity)}</span>
                </button>
                <div id={`${pageId}-bag-feedback`} className={`bb-product-details-bag-feedback`}>
                  <p id={`${pageId}-bag-status`} className={`bb-product-details-bag-status`} role={`status`}>
                    {addedQuantity ? `${addedQuantity} ${addedQuantity === 1 ? `piece` : `pieces`} added to your bag.` : bagQuantity ? `${bagQuantity} ${bagQuantity === 1 ? `piece` : `pieces`} in your bag.` : `A little something, just for you.`}
                  </p>
                  <Link id={`${pageId}-view-bag`} className={`bb-product-details-view-bag`} href={`/cart`}>View Bag <ArrowUpRight size={14} aria-hidden={`true`} /></Link>
                </div>
              </div>
              <div id={`${pageId}-details-sections`} className={`bb-product-details-sections`}>
                <details id={`${pageId}-details-panel`} className={`bb-product-details-panel`} open>
                  <summary id={`${pageId}-details-summary`} className={`bb-product-details-summary`}>The Details <ChevronDown size={16} aria-hidden={`true`} /></summary>
                  <div id={`${pageId}-details-content`} className={`bb-product-details-panel-content`}>
                    <p id={`${pageId}-details-copy`} className={`bb-product-details-panel-copy`}>{product.description}</p>
                    <dl id={`${pageId}-facts`} className={`bb-product-details-facts`}>
                      <div id={`${pageId}-category-fact`} className={`bb-product-details-fact`}><dt id={`${pageId}-category-fact-label`} className={`bb-product-details-fact-label`}>Category</dt><dd id={`${pageId}-category-fact-value`} className={`bb-product-details-fact-value`}>{category?.name ?? `The Collection`}</dd></div>
                      <div id={`${pageId}-edit-fact`} className={`bb-product-details-fact`}><dt id={`${pageId}-edit-fact-label`} className={`bb-product-details-fact-label`}>The Edit</dt><dd id={`${pageId}-edit-fact-value`} className={`bb-product-details-fact-value`}>{product.label}</dd></div>
                    </dl>
                  </div>
                </details>
                <details id={`${pageId}-choose-panel`} className={`bb-product-details-panel`}>
                  <summary id={`${pageId}-choose-summary`} className={`bb-product-details-summary`}>Before You Choose <ChevronDown size={16} aria-hidden={`true`} /></summary>
                  <div id={`${pageId}-choose-content`} className={`bb-product-details-panel-content`}>
                    <p id={`${pageId}-choose-copy`} className={`bb-product-details-panel-copy`}>{story?.note ?? `Product imagery is a collection preview. Full product specifications are not yet listed.`}</p>
                    <Link id={`${pageId}-contact-link`} className={`bb-product-details-contact-link`} href={`/contact`}>Ask Us a Question <ArrowUpRight size={14} aria-hidden={`true`} /></Link>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>
      {story ? (
        <section id={`${pageId}-story`} className={`bb-product-details-story`} aria-labelledby={`${pageId}-story-heading`}>
          <div id={`${pageId}-story-container`} className={`bb-container bb-product-details-story-inner`}>
            <span id={`${pageId}-story-icon`} className={`bb-product-details-story-icon`}><Heart size={20} aria-hidden={`true`} /></span>
            <div id={`${pageId}-story-copy`} className={`bb-product-details-story-copy`}>
              <span id={`${pageId}-story-eyebrow`} className={`bb-eyebrow`}>The Bengali Blush Edit</span>
              <h2 id={`${pageId}-story-heading`} className={`bb-product-details-story-heading`}>{story.title}</h2>
              <p id={`${pageId}-story-description`} className={`bb-product-details-story-description`}>{story.description}</p>
            </div>
            <span id={`${pageId}-story-signature`} className={`bb-product-details-story-signature`} aria-hidden={`true`}>a little blush,<br />a little you.</span>
          </div>
        </section>
      ) : null}
      <section id={`${pageId}-related`} className={`bb-product-details-related`} aria-labelledby={`${pageId}-related-heading`}>
        <div id={`${pageId}-related-container`} className={`bb-container`}>
          <div id={`${pageId}-related-title-row`} className={`bb-product-details-related-title-row`}>
            <div id={`${pageId}-related-copy`} className={`bb-product-details-related-copy`}>
              <span id={`${pageId}-related-eyebrow`} className={`bb-eyebrow`}>A Few More Favorites</span>
              <h2 id={`${pageId}-related-heading`} className={`bb-product-details-related-heading`}>Complete your ritual.</h2>
            </div>
            <Link id={`${pageId}-back-to-shop`} className={`bb-product-details-back-to-shop`} href={`/shop`}><ArrowLeft size={15} aria-hidden={`true`} /> Explore the Shop</Link>
          </div>
          <div id={`${pageId}-related-grid`} className={`bb-product-details-related-grid`}>
            {relatedProducts.map((item) => <ProductCard key={item.id} product={item} idPrefix={`${pageId}-related-card`} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
