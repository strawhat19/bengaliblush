'use client';

import '../../authentication/admin-commerce/admin-commerce.scss';
import '../../authentication/owner-dashboard/owner-dashboard.scss';
import '../../authentication/admin-commerce/commerce-record-row/commerce-record-row.scss';
import './styles.scss';
import { useProductMarket } from './use-product-market';
import { Download, Search, FlaskConical, LoaderCircle } from 'lucide-react';
import { marketPreviewCategories } from '@/shared/shop/market-preview';
import StatusCell from '../../authentication/status-cell/status-cell';
import ProductArtwork from '../product-artwork/product-artwork';

export type ProductMarketProps = {
  idPrefix: string;
  categoryId?: string;
  categoryName?: string;
  sectionLabel?: string;
  researchCounts?: readonly number[];
};

const columns = [`No.`, `Product Concept`, `Reviews`, `Avg. Sale`, `Search Volume`, `Supplier Cost`, `Delivery`, `Status`, `Import`];

const ProductMarket = ({ idPrefix, categoryId, categoryName, sectionLabel, researchCounts }: ProductMarketProps) => {
  const { query, counts, notice, matches, progress, setQuery, researching, selectedCount, categoryRecords, setResearchCount, previewResearch, filterCategoryId, setFilterCategoryId } = useProductMarket(categoryId, researchCounts);
  const previewId = `${idPrefix}-preview-notice`;
  const importNoteId = `${idPrefix}-import-note`;
  const filterName = categoryName || marketPreviewCategories.find(({ id }) => id === categoryId)?.name || categoryId;

  return (
    <section id={idPrefix} className={`bb-product-market bb-owner-dashboard`} aria-label={`Market Product Preview`}>
      <p id={previewId} className={`bb-product-market-notice`}>
        <FlaskConical size={15} aria-hidden={`true`} />
        <span id={`${idPrefix}-preview-copy`} className={`bb-product-market-notice-copy`}>
          Concept preview · Supplier availability and market metrics are unverified. Import and live research are not connected.
        </span>
      </p>
      {(filterName || sectionLabel) && <p id={`${idPrefix}-scope`} className={`bb-product-market-scope`}>
        {filterName ? `Category: ${filterName}` : `All Categories`}{sectionLabel ? ` · ${sectionLabel}` : ``}
      </p>}
      <div id={`${idPrefix}-filters`} className={`bb-commerce-filters bb-product-market-filters`}>
        <label id={`${idPrefix}-search-label`} htmlFor={`${idPrefix}-search`} className={`bb-commerce-search`}>
          <Search size={15} aria-hidden={`true`} />
          <input
            type={`search`}
            value={query}
            id={`${idPrefix}-search`}
            aria-label={`Search Product Concepts`}
            placeholder={`Search product concepts`}
            className={`bb-commerce-search-input`}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
        {!categoryId && <>
          <label id={`${idPrefix}-category-label`} htmlFor={`${idPrefix}-category`} className={`bb-commerce-filter-label`}>Category</label>
          <select
            value={filterCategoryId}
            disabled={researching}
            id={`${idPrefix}-category`}
            className={`bb-commerce-filter`}
            onChange={(event) => setFilterCategoryId(event.currentTarget.value)}
          >
            <option id={`${idPrefix}-category-all`} value={`all`}>All Categories</option>
            {marketPreviewCategories.map(({ id, name }) => <option key={id} value={id} id={`${idPrefix}-category-${id}`}>{name}</option>)}
          </select>
        </>}
        <div id={`${idPrefix}-research-actions`} className={`bb-commerce-filter-actions bb-product-market-research-actions`}>
          <label id={`${idPrefix}-count-label`} htmlFor={`${idPrefix}-research-count`} className={`bb-commerce-filter-label`}>Add</label>
          <select
            value={selectedCount}
            disabled={researching}
            className={`bb-commerce-filter`}
            id={`${idPrefix}-research-count`}
            onChange={(event) => setResearchCount(Number(event.currentTarget.value))}
          >
            {counts.map((count) => <option key={count} value={count} id={`${idPrefix}-count-${count}`}>{count} Concept(s)</option>)}
          </select>
          <button
            type={`button`}
            onClick={previewResearch}
            id={`${idPrefix}-research`}
            aria-describedby={previewId}
            className={`bb-button bb-button-primary bb-commerce-add bb-product-market-research`}
            disabled={researching || !counts.length || !categoryRecords.length}
          >
            {researching ? <LoaderCircle size={14} aria-hidden={`true`} className={`bb-product-market-spinner`} /> : <FlaskConical size={14} aria-hidden={`true`} />}
            {researching ? `Previewing ${progress}%` : `Preview Research`}
          </button>
        </div>
      </div>
      {researching && <div id={`${idPrefix}-research-progress`} className={`bb-product-market-progress`}>
        <label htmlFor={`${idPrefix}-progress`} id={`${idPrefix}-progress-label`} className={`bb-product-market-progress-label`}>Simulating Research · {progress}%</label>
        <progress max={100} value={progress} id={`${idPrefix}-progress`} className={`bb-product-market-progress-bar`} />
      </div>}
      {notice && <p id={`${idPrefix}-research-notice`} className={`bb-product-market-result`} role={`status`}>{notice}</p>}
      <p id={`${idPrefix}-count`} className={`bb-product-market-count`}>{matches.length} Of {categoryRecords.length} Concept(s)</p>
      {matches.length ? <div id={`${idPrefix}-table-wrap`} className={`bb-commerce-table-wrap bb-product-market-table-wrap`}>
        <table id={`${idPrefix}-table`} className={`bb-commerce-table bb-product-market-table`} aria-describedby={`${previewId} ${importNoteId}`}>
          <caption id={`${idPrefix}-caption`} className={`bb-commerce-sr-only`}>Unverified Product Concepts · Market Metrics Unavailable</caption>
          <thead id={`${idPrefix}-table-head`} className={`bb-commerce-table-head`}>
            <tr id={`${idPrefix}-column-row`} className={`bb-commerce-table-column-row`}>
              {columns.map((column, index) => <th key={column} scope={`col`} id={`${idPrefix}-column-${index}`} className={`bb-commerce-table-column`}>{column}</th>)}
            </tr>
          </thead>
          <tbody id={`${idPrefix}-table-body`} className={`bb-commerce-table-body`}>
            {matches.map((record) => {
              const rowId = `${idPrefix}-row-${record.id}`;
              return <tr key={record.id} id={rowId} className={`bb-commerce-record-row bb-product-market-row`}>
                <td id={`${rowId}-number`} className={`bb-commerce-record-number`}><span id={`${rowId}-number-badge`} className={`bb-table-number-badge`}>{record.number}</span></td>
                <td id={`${rowId}-product`} className={`bb-commerce-record-main`}>
                  <div id={`${rowId}-identity`} className={`bb-commerce-record-identity`}>
                    <div id={`${rowId}-artwork`} className={`bb-commerce-record-thumbnail is-product`}>
                      <ProductArtwork context={`cart`} product={{ ...record, price: 0, label: `Concept` }} />
                    </div>
                    <div id={`${rowId}-copy`} className={`bb-commerce-record-copy`}>
                      <strong id={`${rowId}-name`} className={`bb-commerce-record-name`}>{record.name}</strong>
                      <span id={`${rowId}-category`} className={`bb-commerce-record-meta`}>{record.categoryName} · Concept</span>
                      <span id={`${rowId}-description`} className={`bb-commerce-record-description`}>{record.description}</span>
                    </div>
                  </div>
                </td>
                {[`reviews`, `sale`, `search`, `cost`, `delivery`].map((metric) => <td key={metric} id={`${rowId}-${metric}`} className={`bb-product-market-metric`}><span id={`${rowId}-${metric}-value`} aria-label={`Unavailable`}>—</span></td>)}
                <td id={`${rowId}-status-cell`} className={`bb-commerce-record-status`}><StatusCell id={rowId} status={`concept`} /></td>
                <td id={`${rowId}-actions-cell`} className={`bb-commerce-record-actions`}>
                  <div id={`${rowId}-actions`} className={`actionsCell`}>
                    <button
                      disabled
                      type={`button`}
                      id={`${rowId}-import`}
                      aria-describedby={importNoteId}
                      className={`bb-commerce-record-edit`}
                      title={`Import Is Not Connected`}
                      aria-label={`Import ${record.name} · Not Connected`}
                    >
                      <Download size={14} aria-hidden={`true`} />
                    </button>
                  </div>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div> : <p id={`${idPrefix}-empty`} className={`bb-commerce-empty`}>No product concepts match this category or search.</p>}
      <p id={importNoteId} className={`bb-product-market-import-note`}>Import will require verified supplier products. Preview research adds concepts only while this view is open.</p>
    </section>
  );
};

export default ProductMarket;
