'use client';

import { useState } from 'react';
import { useShop } from '@/shared/shop/shop-context';
import type { Product } from '@/shared/types/storefront';

const useProductDetails = (product: Product) => {
  const { lines, addProduct } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [addedQuantity, setAddedQuantity] = useState(0);
  const bagQuantity = lines.find((line) => line.product.id === product.id)?.quantity ?? 0;

  const changeQuantity = (nextQuantity: number) => {
    setAddedQuantity(0);
    setQuantity(Math.max(1, Math.min(99, nextQuantity)));
  };

  const addToBag = () => {
    addProduct(product, quantity);
    setAddedQuantity(quantity);
  };

  return { quantity, addToBag, bagQuantity, addedQuantity, changeQuantity };
};

export default useProductDetails;
