'use client';

import './product-settings.scss';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/shared/authContext/useAuth';
import type { Product } from '@/shared/types/storefront';

const ProductSettings = dynamic(() => import('./product-settings'));

type ProductSettingsButtonProps = {
  product: Product;
  idPrefix: string;
  sectionLabel?: string;
};

const ProductSettingsControl = ({ product, idPrefix, sectionLabel = `Shop` }: ProductSettingsButtonProps) => {
  const [open, setOpen] = useState(false);
  const buttonId = `${idPrefix}-${product.id}-settings`;

  return <>
    <button
      type={`button`}
      id={buttonId}
      onClick={() => setOpen(true)}
      className={`bb-product-settings-trigger`}
      aria-label={`Product Settings For ${product.name}`}
      title={`Product Settings · ${product.name}`}
    >
      <Settings size={15} aria-hidden={`true`} />
    </button>
    {open && createPortal(<div
      id={`${buttonId}-portal`}
      className={`bb-product-settings-portal`}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <ProductSettings
        product={product}
        idPrefix={buttonId}
        sectionLabel={sectionLabel}
        onClose={() => setOpen(false)}
      />
    </div>, document.body)}
  </>;
};

const ProductSettingsButton = (props: ProductSettingsButtonProps) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading || !isAdmin || !user) return null;
  return <ProductSettingsControl {...props} key={user.id} />;
};

export default ProductSettingsButton;
