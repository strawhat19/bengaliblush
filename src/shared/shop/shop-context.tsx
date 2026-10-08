'use client';

import type { Product } from '@/shared/types/storefront';
import { productCatalog } from '@/shared/shop/shop-content';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { getStoredCartSnapshot, writeStoredCart } from '@/shared/storage/storefront-storage';

export type CartLine = {
  quantity: number;
  product: Product;
};

type ShopContextValue = {
  count: number;
  subtotal: number;
  cart: Product[];
  lines: CartLine[];
  openBag: () => void;
  removeProduct: (id: string) => void;
  decrementProduct: (id: string) => void;
  incrementProduct: (product: Product) => void;
  addProduct: (product: Product, quantity?: number) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export const getCartLines = (cart: Product[]): CartLine[] => Array.from(cart.reduce((lines, item) => {
  const product = productCatalog.find(({ id }) => id === item.id) ?? item;
  const line = lines.get(product.id);
  if (line) line.quantity += 1;
  else lines.set(product.id, { product, quantity: 1 });
  return lines;
}, new Map<string, CartLine>()).values());

export const decrementCartProduct = (id: string) => {
  const cart = getStoredCartSnapshot();
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex >= 0) writeStoredCart(cart.filter((_, index) => index !== itemIndex));
};

export const removeCartProduct = (id: string) =>
  writeStoredCart(getStoredCartSnapshot().filter((item) => item.id !== id));

export const ShopProvider = ({ cart, onAdd, onOpenBag, children }: {
  cart: Product[];
  children: ReactNode;
  onOpenBag: () => void;
  onAdd: (product: Product, quantity?: number) => void;
}) => {
  const value = useMemo<ShopContextValue>(() => {
    const lines = getCartLines(cart);
    return {
      cart,
      lines,
      count: cart.length,
      addProduct: onAdd,
      openBag: onOpenBag,
      removeProduct: removeCartProduct,
      decrementProduct: decrementCartProduct,
      incrementProduct: (product) => onAdd(product),
      subtotal: lines.reduce((total, { product, quantity }) => total + product.price * quantity, 0),
    };
  }, [cart, onAdd, onOpenBag]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const shop = useContext(ShopContext);
  if (!shop) throw new Error(`Shop components need a ShopProvider`);
  return shop;
};
