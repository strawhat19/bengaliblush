import { useMemo } from 'react';
import { useCatalog } from '@/shared/shop/catalog-context';
import type { GalleryImage } from '@/shared/models/gallery/Gallery';

export const useAdminGallery = (siteImages: readonly GalleryImage[]) => {
  const { products, services, reviews } = useCatalog(`products`);
  useCatalog(`services`);
  useCatalog(`reviews`);
  const images = useMemo(() => {
    const uniqueImages = new Map(siteImages.map((image) => [image.src, image]));
    const savedImages: GalleryImage[] = [
      ...products.records.flatMap<GalleryImage>((product) => product.image ? [{ id: `product-${product.id}`, src: product.image, title: product.name, category: `Shop`, alt: product.imageAlt || product.name }] : []),
      ...services.records.flatMap<GalleryImage>((service) => service.image ? [{ id: `service-${service.id}`, src: service.image, title: service.name, category: `Services`, alt: service.imageAlt || service.name }] : []),
      ...reviews.records.flatMap<GalleryImage>((review) => review.image ? [{ id: `review-${review.id}`, src: review.image, title: review.name, category: `Reviews`, alt: review.imageAlt || review.name }] : []),
    ];
    savedImages.forEach((image) => {
      const existing = uniqueImages.get(image.src);
      uniqueImages.set(image.src, { ...image, id: existing?.id ?? image.id, category: existing?.category ?? image.category });
    });
    return [...uniqueImages.values()];
  }, [siteImages, products.records, services.records, reviews.records]);
  const loading = products.loading || services.loading || reviews.loading;
  const error = products.error || services.error || reviews.error;
  return { images, loading, error: error ? `Some Photos Could Not Be Loaded` : `` };
};
