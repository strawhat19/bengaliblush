'use client';

import './catalog-status.scss';
import { RefreshCw, ShoppingBag } from 'lucide-react';
import { useCatalog } from '@/shared/shop/catalog-context';

type CatalogStatusProps = { id: string; loading?: boolean; error?: string; empty?: string };

const CatalogStatus = ({ id, loading, error, empty }: CatalogStatusProps) => {
  const { refresh } = useCatalog();
  return (
    <div id={id} className={`bb-catalog-status`} role={error ? `alert` : `status`} aria-busy={loading}>
      <ShoppingBag size={24} aria-hidden={`true`} />
      <p id={`${id}-message`} className={`bb-catalog-status-message`}>{loading ? `Loading Studio Records…` : error || empty}</p>
      {error && <button type={`button`} id={`${id}-retry`} className={`bb-button bb-button-outline-dark`} onClick={refresh}><RefreshCw size={14} aria-hidden={`true`} />Try Again</button>}
    </div>
  );
};

export default CatalogStatus;
