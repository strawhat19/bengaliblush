'use client';

import { getProductHref } from '@/shared/shop/shop-utils';
import { useCatalog } from '@/shared/shop/catalog-context';
import useShopIndex, { type ShopSort } from './use-shop-index';
import Link from '@/app/components/navigation/page-link/page-link';
import ProductCard from '@/app/components/shop/product-card/product-card';
import CatalogStatus from '@/app/components/shop/catalog-status/catalog-status';
import ProductArtwork from '@/app/components/shop/product-artwork/product-artwork';
import OrnamentalArch from '@/app/components/effects/ornamental-arch/ornamental-arch';
import { ArrowUpRight, Search, ShoppingBag, SlidersHorizontal, Sparkles, X } from 'lucide-react';

const ShopIndex = () => {
  const { categories, products: catalogState } = useCatalog();
  const { sort, query, catalog, category, products, setSort, setQuery, categoryId, resetFilters, setCategoryId } = useShopIndex(categories);
  const featuredProduct = categories.find((item) => item.id === `apparel`)?.products[1] ?? catalog[0];

  return (
    <div id={`bb-shop-page`} className={`bb-shop-index`}>
      <section id={`top`} className={`bb-shop-index-hero`} aria-labelledby={`bb-shop-index-heading`}>
        <div id={`bb-shop-index-hero-container`} className={`bb-container bb-shop-index-hero-grid`}>
          <div id={`bb-shop-index-hero-copy`} className={`bb-shop-index-hero-copy`}>
            <div id={`bb-shop-index-marker`} className={`bb-section-marker`}>
              <span id={`bb-shop-index-marker-icon`} className={`bb-section-marker-icon`}><ShoppingBag size={14} aria-hidden={`true`} /></span>
              <span id={`bb-shop-index-marker-label`} className={`bb-section-marker-name`}>The Misty Market</span>
              <span id={`bb-shop-index-marker-line`} className={`bb-section-marker-line`} aria-hidden={`true`} />
              <span id={`bb-shop-index-marker-number`} className={`bb-section-marker-index`} aria-hidden={`true`}>01</span>
            </div>
            <span id={`bb-shop-index-eyebrow`} className={`bb-eyebrow`}>A Little Everyday Luxury</span>
            <h1 id={`bb-shop-index-heading`} className={`bb-shop-index-heading`}>Beautiful things.<br /><em id={`bb-shop-index-heading-accent`} className={`bb-shop-index-heading-accent`}>Your kind of ritual.</em></h1>
            <p id={`bb-shop-index-introduction`} className={`bb-shop-index-introduction`}>Beauty essentials, expressive fashion, and little comforts for home. Find something that feels just like you.</p>
            <span id={`bb-shop-index-preview-note`} className={`bb-shop-index-preview-note`}><Sparkles size={14} aria-hidden={`true`} /> Explore The Collection</span>
          </div>
          {featuredProduct ? (
            <div id={`bb-shop-index-featured-frame-${featuredProduct.id}`} className={`bb-shop-index-featured-frame${featuredProduct.image ? ` has-photo` : ``}`}>
              <OrnamentalArch id={`bb-shop-index-featured-ornament-${featuredProduct.id}`} />
              <Link
                id={`bb-shop-index-featured-${featuredProduct.id}`}
                href={getProductHref(featuredProduct)}
                className={`bb-shop-index-featured${featuredProduct.image ? ` has-photo` : ``}`}
                aria-label={`Explore ${featuredProduct.name}`}
              >
                <ProductArtwork product={featuredProduct} />
                <div id={`bb-shop-index-featured-copy-${featuredProduct.id}`} className={`bb-shop-index-featured-copy`}>
                  <span id={`bb-shop-index-featured-label-${featuredProduct.id}`} className={`bb-shop-index-featured-label`}>A Celebration of Style</span>
                  <span id={`bb-shop-index-featured-name-${featuredProduct.id}`} className={`bb-shop-index-featured-name`}>{featuredProduct.name}</span>
                  <span id={`bb-shop-index-featured-link-${featuredProduct.id}`} className={`bb-shop-index-featured-link`}>Discover the Details <ArrowUpRight size={16} aria-hidden={`true`} /></span>
                </div>
              </Link>
            </div>
          ) : null}
        </div>
      </section>
      <section id={`bb-shop-index-collection`} className={`bb-shop-index-collection`} aria-labelledby={`bb-shop-index-collection-heading`}>
        <div id={`bb-shop-index-collection-container`} className={`bb-container`}>
          <div id={`bb-shop-index-collection-heading-row`} className={`bb-shop-index-collection-heading-row`}>
            <div id={`bb-shop-index-collection-heading-copy`} className={`bb-shop-index-collection-heading-copy`}>
              <span id={`bb-shop-index-collection-eyebrow`} className={`bb-eyebrow`}>Find Your Little Luxury</span>
              <h2 id={`bb-shop-index-collection-heading`} className={`bb-shop-index-collection-heading`}>{category?.name ?? `The Collection`}</h2>
            </div>
            <span id={`bb-shop-index-results-count`} className={`bb-shop-index-results-count`} role={`status`}>{products.length} {products.length === 1 ? `piece` : `pieces`} to explore</span>
          </div>
          <div id={`bb-shop-index-filters`} className={`bb-shop-index-filters`}>
            <div id={`bb-shop-index-categories`} className={`bb-shop-index-categories`} role={`group`} aria-label={`Filter products by category`}>
              <button
                type={`button`}
                id={`bb-shop-index-category-all`}
                onClick={() => setCategoryId(`all`)}
                aria-pressed={categoryId === `all`}
                className={`bb-shop-index-category${categoryId === `all` ? ` is-active` : ``}`}
              >
                All Pieces <span id={`bb-shop-index-category-all-count`} className={`bb-shop-index-category-count`}>{catalog.length}</span>
              </button>
              {categories.map((item) => (
                <button
                  key={item.id}
                  type={`button`}
                  onClick={() => setCategoryId(item.id)}
                  id={`bb-shop-index-category-${item.id}`}
                  aria-pressed={categoryId === item.id}
                  className={`bb-shop-index-category${categoryId === item.id ? ` is-active` : ``}`}
                >
                  {item.name} <span id={`bb-shop-index-category-count-${item.id}`} className={`bb-shop-index-category-count`}>{item.products.length}</span>
                </button>
              ))}
            </div>
            <div id={`bb-shop-index-search-sort`} className={`bb-shop-index-search-sort`}>
              <div id={`bb-shop-index-search-field`} className={`bb-shop-index-search-field`}>
                <label id={`bb-shop-index-search-label`} className={`bb-shop-index-search-label`} htmlFor={`bb-shop-index-search`}><Search size={16} aria-hidden={`true`} /><span className={`bb-shop-index-sr-only`}>Search the Collection</span></label>
                <input
                  type={`search`}
                  value={query}
                  id={`bb-shop-index-search`}
                  className={`bb-shop-index-search`}
                  placeholder={`Find something lovely…`}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query ? (
                  <button type={`button`} id={`bb-shop-index-clear-search`} className={`bb-shop-index-clear-search`} onClick={() => setQuery(``)} aria-label={`Clear search`}><X size={14} aria-hidden={`true`} /></button>
                ) : null}
              </div>
              <div id={`bb-shop-index-sort-field`} className={`bb-shop-index-sort-field`}>
                <label id={`bb-shop-index-sort-label`} className={`bb-shop-index-sort-label`} htmlFor={`bb-shop-index-sort`}><SlidersHorizontal size={14} aria-hidden={`true`} /><span className={`bb-shop-index-sr-only`}>Sort the Collection</span></label>
                <select
                  value={sort}
                  id={`bb-shop-index-sort`}
                  className={`bb-shop-index-sort`}
                  onChange={(event) => setSort(event.target.value as ShopSort)}
                >
                  <option id={`bb-shop-index-sort-curated`} value={`curated`}>Our Curated Edit</option>
                  <option id={`bb-shop-index-sort-price-low`} value={`price-low`}>Price: Low to High</option>
                  <option id={`bb-shop-index-sort-price-high`} value={`price-high`}>Price: High to Low</option>
                  <option id={`bb-shop-index-sort-name`} value={`name`}>Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
          {catalogState.loading || catalogState.error || !catalog.length ? <CatalogStatus id={`bb-shop-index-catalog-status`} loading={catalogState.loading} error={catalogState.error} empty={`The collection is being prepared. Please check back soon.`} /> : products.length ? (
            <div id={`bb-shop-index-products`} className={`bb-shop-index-products`}>
              {products.map((product) => <ProductCard key={product.id} product={product} idPrefix={`bb-shop-index-card`} />)}
            </div>
          ) : (
            <div id={`bb-shop-index-empty`} className={`bb-shop-index-empty`}>
              <Search size={28} aria-hidden={`true`} />
              <h3 id={`bb-shop-index-empty-heading`} className={`bb-shop-index-empty-heading`}>A little more exploring?</h3>
              <p id={`bb-shop-index-empty-description`} className={`bb-shop-index-empty-description`}>We could not find a match. Try another name or explore the full collection.</p>
              <button type={`button`} id={`bb-shop-index-reset-filters`} className={`bb-button bb-button-outline-dark`} onClick={resetFilters}>Show All Pieces <ArrowUpRight size={15} aria-hidden={`true`} /></button>
            </div>
          )}
        </div>
      </section>
      <div id={`bb-shop-index-closing`} className={`bb-shop-index-closing`}>
        <div id={`bb-shop-index-closing-container`} className={`bb-container bb-shop-index-closing-inner`}>
          <Sparkles size={21} aria-hidden={`true`} />
          <p id={`bb-shop-index-closing-copy`} className={`bb-shop-index-closing-copy`}>A beauty ritual. A celebration. A moment for yourself.</p>
          <span id={`bb-shop-index-closing-signature`} className={`bb-shop-index-closing-signature`}>Bengali Blush</span>
        </div>
      </div>
    </div>
  );
};

export default ShopIndex;
