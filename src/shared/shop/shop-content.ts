import type { ProductCategory } from '@/shared/types/storefront';

export const productCategories: ProductCategory[] = [
  {
    id: `health`,
    name: `Health`,
    products: [
      { id: `lash-luxe`, name: `Lash Luxe Serum`, description: `A nightly ritual for stronger, softer-looking lashes.`, price: 34, label: `Bestseller`, shade: `gold`, visual: `serum` },
      { id: `brow-bloom`, name: `Brow Bloom Serum`, description: `A conditioning touch for fuller-looking brows.`, price: 29, label: `Daily ritual`, shade: `pearl`, visual: `serum` },
      { id: `rosewater-glow`, name: `Rosewater Glow Serum`, description: `Lightweight hydration for a fresh, dewy finish.`, price: 32, label: `Skin favorite`, shade: `rose`, visual: `serum` },
      { id: `scalp-revival`, name: `Scalp Revival Serum`, description: `A soothing step for healthy-looking roots.`, price: 36, label: `Hair ritual`, shade: `green`, visual: `serum` },
      { id: `night-repair`, name: `Night Repair Serum`, description: `A soft overnight veil for nourished skin.`, price: 38, label: `After dark`, shade: `plum`, visual: `serum` },
    ],
  },
  {
    id: `apparel`,
    name: `Apparel`,
    products: [
      { id: `pakistani-lehenga`, name: `Pakistani Embroidered Lehenga`, description: `A festive skirt, blouse, and dupatta with delicate detail.`, price: 249, label: `Pakistani style`, shade: `berry`, visual: `apparel`, image: `/apparel-pakistani-lehenga.png`, imageAlt: `Woman wearing an embroidered Pakistani lehenga and dupatta` },
      { id: `bengali-jamdani`, name: `Bengali Jamdani Saree`, description: `An airy floral weave with a timeless drape.`, price: 189, label: `Bengali style`, shade: `cream`, visual: `apparel`, image: `/apparel-bengali-jamdani.png`, imageAlt: `Woman wearing a floral Bengali Jamdani saree` },
      { id: `indian-banarasi`, name: `Indian Banarasi Saree`, description: `Brocade-inspired elegance for every celebration.`, price: 219, label: `Indian style`, shade: `gold`, visual: `apparel`, image: `/apparel-indian-banarasi.png`, imageAlt: `Woman wearing a brocade Indian Banarasi saree` },
      { id: `pakistani-lawn`, name: `Pakistani Lawn Kurta Set`, description: `A printed kurta, trousers, and matching dupatta.`, price: 95, label: `Everyday edit`, shade: `green`, visual: `apparel`, image: `/apparel-pakistani-lawn.png`, imageAlt: `Woman wearing a printed Pakistani lawn kurta, trousers, and dupatta` },
      { id: `bengali-muslin`, name: `Bengali Muslin Salwar Set`, description: `Lightweight festive layers with an easy silhouette.`, price: 129, label: `New arrival`, shade: `coral`, visual: `apparel`, image: `/apparel-bengali-muslin.png`, imageAlt: `Woman wearing a light Bengali muslin salwar set` },
    ],
  },
  {
    id: `candles`,
    name: `Candles`,
    products: [
      { id: `saffron-amber`, name: `Saffron Amber Candle`, description: `Warm saffron and amber for a welcoming glow.`, price: 28, label: `Bestseller`, shade: `amber`, visual: `candle` },
      { id: `rose-oud`, name: `Rose & Oud Candle`, description: `A rich floral note made for slow evenings.`, price: 30, label: `After dark`, shade: `rose`, visual: `candle` },
      { id: `jasmine-evening`, name: `Jasmine Evening Candle`, description: `Soft jasmine with a calm, lingering finish.`, price: 26, label: `Soft glow`, shade: `cream`, visual: `candle` },
      { id: `chai-spice`, name: `Chai Spice Candle`, description: `Cozy cardamom and spice in every room.`, price: 28, label: `Home favorite`, shade: `gold`, visual: `candle` },
      { id: `velvet-rose`, name: `Velvet Rose Candle`, description: `A romantic rose scent with a hint of musk.`, price: 32, label: `Giftable`, shade: `plum`, visual: `candle` },
    ],
  },
  {
    id: `tools`,
    name: `Tools`,
    products: [
      { id: `ceramic-straightener`, name: `Ceramic Hair Straightener`, description: `Smooth, polished styling with easy heat control.`, price: 89, label: `Studio essential`, shade: `plum`, visual: `tool` },
      { id: `curling-wand`, name: `32 mm Curling Wand`, description: `Soft, sweeping curls and party-ready waves.`, price: 74, label: `Artist pick`, shade: `rose`, visual: `tool` },
      { id: `travel-straightener`, name: `Mini Travel Straightener`, description: `A compact touch-up tool for days on the move.`, price: 49, label: `On the go`, shade: `gold`, visual: `tool` },
      { id: `heated-brush`, name: `Heated Styling Brush`, description: `Volume and smoothness in one quick pass.`, price: 68, label: `Daily styling`, shade: `coral`, visual: `tool` },
      { id: `wave-iron`, name: `Wave Styling Iron`, description: `Easy texture for effortless, lived-in waves.`, price: 79, label: `New in`, shade: `green`, visual: `tool` },
    ],
  },
];

export const productCatalog = productCategories.flatMap((category) => category.products);

