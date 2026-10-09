'use client';

import { useId } from 'react';
import Image from 'next/image';
import type { Product } from '@/shared/types/storefront';

function ProductBottle({ id, shade }: { id: string; shade: string }) {
  return <div id={id} className={`bb-product-bottle ${shade}`} aria-hidden="true" />;
}

export default function ProductArtwork({ product, context = `card` }: { product: Product; context?: `card` | `category` | `cart` }) {
  const instanceId = useId();
  const artworkId = `bb-product-artwork-${product.id}-${context}-${instanceId}`;
  if (product.image && context !== `category`) return (
    <Image
      id={artworkId}
      className="bb-product-photo"
      src={product.image}
      alt={product.imageAlt ?? product.name}
      fill
      unoptimized={/^https?:\/\//.test(product.image)}
      sizes={context === `cart` ? `62px` : `(max-width: 800px) 100vw, (max-width: 1050px) 40vw, 36vw`}
    />
  );
  if (product.visual === `apparel`) return (
    <svg id={artworkId} className={`bb-product-art ${product.shade}`} viewBox="0 0 180 220" fill="none" aria-hidden="true">
      <path d="M72 20h36l9 16 21 12-11 25-20-10-6 23H79l-6-23-20 10-11-25 21-12 9-16Z" fill="var(--art-main)" stroke="currentColor" strokeOpacity=".36" />
      <path d="M78 84h24l48 121H30L78 84Z" fill="var(--art-main)" stroke="currentColor" strokeOpacity=".36" />
      <path d="M70 32c14 18 31 35 42 53l20 106" stroke="var(--art-accent)" strokeWidth="11" strokeOpacity=".8" />
      <path d="M41 188h98M49 173h82M76 97h28" stroke="var(--art-accent)" strokeWidth="2" strokeOpacity=".7" />
    </svg>
  );
  if (product.visual === `candle`) return (
    <svg id={artworkId} className={`bb-product-art ${product.shade}`} viewBox="0 0 180 220" fill="none" aria-hidden="true">
      <path d="M90 31c-14 17-13 30 0 37 13-8 14-21 0-37Z" fill="var(--art-accent)" />
      <path d="M90 68v18" stroke="currentColor" strokeOpacity=".5" strokeWidth="2" />
      <rect x="43" y="86" width="94" height="111" rx="14" fill="var(--art-main)" stroke="currentColor" strokeOpacity=".36" />
      <path d="M44 102h92" stroke="currentColor" strokeOpacity=".32" />
      <rect x="61" y="122" width="58" height="41" rx="2" fill="#F8E8D1" fillOpacity=".75" />
      <text x="90" y="150" fill="#3E0D23" fontFamily="Georgia, serif" fontSize="25" fontStyle="italic" textAnchor="middle">bb</text>
    </svg>
  );
  if (product.visual === `tool`) return (
    <svg id={artworkId} className={`bb-product-art ${product.shade}`} viewBox="0 0 180 220" fill="none" aria-hidden="true">
      <g transform="rotate(-22 90 110)">
        <rect x="60" y="22" width="23" height="174" rx="11" fill="var(--art-main)" stroke="currentColor" strokeOpacity=".36" />
        <rect x="97" y="22" width="23" height="174" rx="11" fill="var(--art-accent)" stroke="currentColor" strokeOpacity=".36" />
        <rect x="66" y="33" width="11" height="79" rx="5" fill="#F8E8D1" fillOpacity=".75" />
        <rect x="103" y="33" width="11" height="79" rx="5" fill="#F8E8D1" fillOpacity=".75" />
        <path d="M71 184c8 22 30 22 38 0" stroke="currentColor" strokeOpacity=".55" strokeWidth="3" />
      </g>
    </svg>
  );
  return <ProductBottle id={artworkId} shade={product.shade} />;
}
