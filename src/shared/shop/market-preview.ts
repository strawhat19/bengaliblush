import { productCategories } from './shop-content';
import type { Product } from '@/shared/types/storefront';

export type MarketPreviewRecord = {
  id: string;
  number: number;
  name: string;
  shade: string;
  categoryId: string;
  categoryName: string;
  description: string;
  visual: Product[`visual`];
  source: `concept`;
  reviews: null;
  deliveryDays: null;
  supplierCostMinor: null;
  monthlySearchVolume: null;
  averageSalePriceMinor: null;
};

export const marketPreviewCategories = productCategories.map(({ id, name }) => ({ id, name }));

const conceptNames: Record<string, readonly string[]> = {
  health: [
    `Rosewater Face Mist`,
    `Evening Skin Serum`,
    `Velvet Lip Oil`,
    `Botanical Brow Oil`,
    `Satin Lash Conditioner`,
    `Glow Ritual Face Oil`,
    `Daily Scalp Oil`,
    `Petal Hand Cream`,
    `Soft Glow Body Oil`,
    `Night Ritual Gift Set`,
  ],
  apparel: [
    `Floral Kurta Set`,
    `Festive Dupatta`,
    `Woven Saree Edit`,
    `Embroidered Party Set`,
    `Printed Lawn Style Set`,
    `Soft Drape Salwar Set`,
    `Brocade Style Saree`,
    `Celebration Lehenga Set`,
    `Pastel Occasion Kurta`,
    `Floral Wrap Scarf`,
  ],
  candles: [
    `Amber Evening Candle`,
    `Rose Petal Candle`,
    `Jasmine Ritual Candle`,
    `Chai Spice Candle Set`,
    `Oud Mood Candle`,
    `Saffron Glow Candle`,
    `Velvet Musk Candle`,
    `Garden Night Candle`,
    `Warm Vanilla Candle`,
    `Misty Market Gift Trio`,
  ],
  tools: [
    `Ceramic Styling Iron`,
    `Soft Wave Curling Wand`,
    `Travel Styling Brush`,
    `Mini Straightener`,
    `Volume Styling Brush`,
    `Wave Styling Tool`,
    `Silk Finish Styling Comb`,
    `Travel Styling Pouch`,
    `Brush And Comb Set`,
    `Heat Tool Storage Mat`,
  ],
};

const createConcept = (categoryId: string, index: number, number: number): MarketPreviewRecord => {
  const category = productCategories.find(({ id }) => id === categoryId) ?? productCategories[0];
  const names = conceptNames[category.id] ?? [];
  const seed = category.products[index % category.products.length];
  const name = names[index % names.length] ?? `Product Concept`;
  return {
    number,
    source: `concept`,
    reviews: null,
    deliveryDays: null,
    shade: seed?.shade ?? `rose`,
    visual: seed?.visual,
    categoryId: category.id,
    categoryName: category.name,
    supplierCostMinor: null,
    monthlySearchVolume: null,
    averageSalePriceMinor: null,
    id: `market-concept-${number}`,
    name: index < names.length ? name : `${name} · Study ${Math.floor(index / names.length) + 1}`,
    description: `A ${category.name.toLocaleLowerCase()} sourcing concept inspired by the current collection. Supplier and product facts are unverified.`,
  };
};

export const initialMarketPreviewRecords = productCategories.flatMap((category, categoryIndex) =>
  (conceptNames[category.id] ?? []).map((_, index) => createConcept(category.id, index, categoryIndex * 10 + index + 1)));

export const createPreviewResearchRecords = (count: number, startNumber: number, categoryId?: string): MarketPreviewRecord[] => {
  const categories = categoryId ? productCategories.filter(({ id }) => id === categoryId) : productCategories;
  if (!categories.length) return [];
  return Array.from({ length: count }, (_, index) => {
    const category = categories[index % categories.length];
    return createConcept(category.id, startNumber + index, startNumber + index + 1);
  });
};
