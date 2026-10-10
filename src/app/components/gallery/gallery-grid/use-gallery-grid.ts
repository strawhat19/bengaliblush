import { useMemo, useState, type MouseEvent } from 'react';
import { galleryCategories, type GalleryImage, type GalleryCategory } from '@/shared/models/gallery/Gallery';

export const useGalleryGrid = (images: GalleryImage[]) => {
  const [category, setCategory] = useState<GalleryCategory | `All`>(`All`);
  const [openedId, setOpenedId] = useState<string | null>(null);
  const categories = useMemo(() => galleryCategories.filter((category) => images.some((image) => image.category === category)), [images]);
  const activeCategory = category === `All` || categories.includes(category) ? category : `All`;
  const visibleImages = useMemo(() => activeCategory === `All` ? images : images.filter((image) => image.category === activeCategory), [activeCategory, images]);
  const selectedId = visibleImages.some((image) => image.id === openedId) ? openedId : null;
  const selectCategory = (nextCategory: GalleryCategory | `All`) => { setOpenedId(null); setCategory(nextCategory); };
  const preloadLightbox = () => { void import('../gallery-lightbox/gallery-lightbox').catch(() => undefined); };
  const openImage = (event: MouseEvent<HTMLButtonElement>, id?: string) => { event.currentTarget.focus({ preventScroll: true }); setOpenedId(id ?? null); };
  return { categories, openImage, selectedId, visibleImages, setOpenedId, selectCategory, preloadLightbox, category: activeCategory };
};
