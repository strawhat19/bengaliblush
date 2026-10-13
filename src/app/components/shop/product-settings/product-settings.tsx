'use client';

import './product-settings.scss';
import { useProductSettings } from './use-product-settings';
import type { Product } from '@/shared/types/storefront';
import { siteRoutes } from '@/shared/navigation/routes';
import ProductMarket from '../product-market/product-market';
import ProductStoreTable from '../product-store-table/product-store-table';
import Link from '@/app/components/navigation/page-link/page-link';
import { X, Save, Search, Package, Settings, ArrowLeft, ArrowLeftRight, ArrowUpRight } from 'lucide-react';
import AdminEditorModal from '@/app/components/authentication/admin-editor-modal/admin-editor-modal';

type ProductSettingsProps = {
  product: Product;
  idPrefix: string;
  onClose: () => void;
  sectionLabel: string;
};

const ProductSettings = ({ product, idPrefix, onClose, sectionLabel }: ProductSettingsProps) => {
  const { name, view, price, search, matches, products, setName, setView, setPrice, setSearch, categoryId, description, setDescription } = useProductSettings(product);
  const replacing = view !== `settings`;
  const categoryName = product.category_name || `Unassigned`;

  return <AdminEditorModal id={`${idPrefix}-modal`} busy={false} onClose={onClose} labelledBy={`${idPrefix}-title`}>
    {(dismiss) => <section id={`${idPrefix}-content`} className={`bb-product-settings bb-owner-dashboard`}>
      <div id={`${idPrefix}-heading`} className={`bb-product-settings-heading`}>
        <div id={`${idPrefix}-heading-copy`} className={`bb-product-settings-heading-copy`}>
          <span id={`${idPrefix}-eyebrow`} className={`bb-product-settings-eyebrow`}>{sectionLabel} · {categoryName}</span>
          <h2 id={`${idPrefix}-title`} className={`bb-product-settings-title`}><Settings size={21} aria-hidden={`true`} />{replacing ? `Swap Or Replace Product` : `Product Settings`}</h2>
        </div>
        <button type={`button`} id={`${idPrefix}-close`} className={`bb-product-settings-close`} aria-label={`Close Product Settings`} onClick={dismiss}><X size={18} aria-hidden={`true`} /></button>
      </div>
      <p id={`${idPrefix}-preview-note`} className={`bb-product-settings-note`}>Preview Only · Changes, swaps, and imports are not saved.</p>
      {replacing ? <>
        <button type={`button`} id={`${idPrefix}-back`} className={`bb-product-settings-back`} onClick={() => setView(`settings`)}><ArrowLeft size={14} aria-hidden={`true`} />Product Settings</button>
        <p id={`${idPrefix}-scope`} className={`bb-product-settings-scope`}>Replacing {product.name} within {categoryName} · {sectionLabel}</p>
        <div id={`${idPrefix}-tabs`} className={`bb-product-settings-tabs`} role={`group`} aria-label={`Product Replacement Source`}>
          {([`swap`, `replace`] as const).map((tab) => <button key={tab} type={`button`} id={`${idPrefix}-tab-${tab}`} className={`bb-product-settings-tab${view === tab ? ` is-active` : ``}`} aria-pressed={view === tab} aria-controls={`${idPrefix}-panel`} onClick={() => setView(tab)}>{tab === `swap` ? <ArrowLeftRight size={15} aria-hidden={`true`} /> : <Package size={15} aria-hidden={`true`} />}{tab === `swap` ? `Swap` : `Replace`}</button>)}
        </div>
        <div id={`${idPrefix}-panel`} className={`bb-product-settings-panel`}>
          {!categoryId ? <p id={`${idPrefix}-category-needed`} className={`bb-commerce-empty`}>Assign a category in Products before choosing a replacement.</p> : view === `replace` ? <ProductMarket idPrefix={`${idPrefix}-market`} categoryId={categoryId} categoryName={categoryName} sectionLabel={sectionLabel} researchCounts={[1, 3, 5]} /> : <>
            <label htmlFor={`${idPrefix}-search`} id={`${idPrefix}-search-label`} className={`bb-commerce-search`}><Search size={15} aria-hidden={`true`} /><input type={`search`} id={`${idPrefix}-search`} value={search} className={`bb-commerce-search-input`} placeholder={`Search Same-Category Products`} onChange={(event) => setSearch(event.currentTarget.value)} /></label>
            <p id={`${idPrefix}-store-coverage`} className={`bb-product-settings-note`}>Active Store Products · {matches.length} Matching Product(s)</p>
            {products.loading ? <p id={`${idPrefix}-loading`} className={`bb-commerce-note`} role={`status`}>Loading Store Products</p> : products.error ? <p id={`${idPrefix}-error`} className={`bb-owner-dashboard-error`} role={`alert`}>{products.error}</p> : matches.length ? <ProductStoreTable preview records={matches} idPrefix={`${idPrefix}-store`} /> : <p id={`${idPrefix}-empty`} className={`bb-commerce-empty`}>No other active products match this category and search.</p>}
          </>}
        </div>
      </> : <>
        <div id={`${idPrefix}-fields`} className={`bb-product-settings-fields`}>
          <label htmlFor={`${idPrefix}-name`} id={`${idPrefix}-name-label`} className={`bb-product-settings-field`}>Product Name<input id={`${idPrefix}-name`} className={`bb-product-settings-input`} value={name} onChange={(event) => setName(event.currentTarget.value)} /></label>
          <label htmlFor={`${idPrefix}-price`} id={`${idPrefix}-price-label`} className={`bb-product-settings-field`}>Price (USD)<input id={`${idPrefix}-price`} type={`number`} min={0} step={0.01} className={`bb-product-settings-input`} value={price} onChange={(event) => setPrice(event.currentTarget.value)} /></label>
          <label htmlFor={`${idPrefix}-description`} id={`${idPrefix}-description-label`} className={`bb-product-settings-field is-wide`}>Description<textarea id={`${idPrefix}-description`} rows={3} className={`bb-product-settings-input`} value={description} onChange={(event) => setDescription(event.currentTarget.value)} /></label>
        </div>
        <div id={`${idPrefix}-actions`} className={`bb-product-settings-actions`}>
          <button type={`button`} id={`${idPrefix}-swap-replace`} className={`bb-button bb-button-outline bb-button-outline-dark`} onClick={() => setView(`swap`)}><ArrowLeftRight size={15} aria-hidden={`true`} />Swap / Replace</button>
          <Link href={siteRoutes.adminProducts.href} id={`${idPrefix}-admin-link`} className={`bb-button bb-button-outline bb-button-outline-dark`}><Package size={15} aria-hidden={`true`} />Products Admin<ArrowUpRight size={14} aria-hidden={`true`} /></Link>
          <button disabled type={`button`} id={`${idPrefix}-save`} className={`bb-button bb-button-primary`} aria-label={`Save Product Settings · Not Connected`}><Save size={14} aria-hidden={`true`} />Save</button>
        </div>
      </>}
    </section>}
  </AdminEditorModal>;
};

export default ProductSettings;
