'use client';

import type { Product } from '@/shared/types/storefront';
import { useCatalog } from '@/shared/shop/catalog-context';
import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
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
  catalogLoading: boolean;
  catalogError: string;
  unavailableProductIds: string[];
  clearCart: () => void;
  openBag: () => void;
  removeProduct: (id: string) => void;
  decrementProduct: (id: string) => void;
  incrementProduct: (product: Product) => void;
  addProduct: (product: Product, quantity?: number) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export const getCartLines = (cart: Product[], catalog: Product[] = []): CartLine[] => Array.from(cart.reduce((lines, item) => {
  const product = catalog.find((product) => product.id === item.id || product.slug === item.id) ?? item;
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
  const { products } = useCatalog(`products`, cart.length > 0);
  useEffect(() => {
    if (products.loading || products.error) return;
    const storedCart = getStoredCartSnapshot();
    const catalog = new Map(products.records.flatMap((product) => [[product.id, product] as const, [product.slug, product] as const]));
    const refreshedCart = storedCart.map((item) => catalog.get(item.id) ?? item);
    if (JSON.stringify(refreshedCart) !== JSON.stringify(storedCart)) writeStoredCart(refreshedCart);
  }, [products]);
  const value = useMemo<ShopContextValue>(() => {
    const lines = getCartLines(cart, products.records);
    return {
      cart,
      lines,
      count: cart.length,
      addProduct: onAdd,
      openBag: onOpenBag,
      catalogError: cart.length > 0 ? products.error : ``,
      catalogLoading: cart.length > 0 && products.loading,
      clearCart: () => writeStoredCart([]),
      unavailableProductIds: lines.filter(({ product }) => !products.records.some((item) => item.id === product.id)).map(({ product }) => product.id),
      removeProduct: removeCartProduct,
      decrementProduct: decrementCartProduct,
      incrementProduct: (product) => onAdd(product),
      subtotal: lines.reduce((total, { product, quantity }) => total + product.price * quantity, 0),
    };
  }, [cart, onAdd, onOpenBag, products]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const shop = useContext(ShopContext);
  if (!shop) throw new Error(`Shop components need a ShopProvider`);
  return shop;
};
