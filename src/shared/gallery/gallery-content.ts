import { blogArticles } from '@/shared/blog/blog-content';
import { productCatalog } from '@/shared/shop/shop-content';
import { services } from '@/shared/services/service-content';
import { sampleTestimonials } from '@/shared/reviews/review-content';
import type { GalleryImage } from '@/shared/models/gallery/Gallery';

const studioImages: GalleryImage[] = [
  { id: `studio-hero`, category: `Studio`, title: `Bengali Blush`, src: `/hero-beauty.jpg`, alt: `Bengali Blush editorial beauty portrait` },
  { id: `studio-party`, category: `Studio`, title: `Party Ready`, src: `/party-makeup.jpg`, alt: `Bengali Blush party makeup editorial portrait` },
];

const serviceImages = [...services]
  .sort((first, second) => Number(first.price === `Free`) - Number(second.price === `Free`))
  .map<GalleryImage>((service) => ({
    category: `Services`,
    src: service.image,
    title: service.name,
    alt: service.imageAlt,
    id: `service-${service.id}`,
  }));

const shopImages = productCatalog.flatMap<GalleryImage>((product) => product.image ? [{
  category: `Shop`,
  src: product.image,
  title: product.name,
  id: `product-${product.id}`,
  alt: product.imageAlt || product.name,
}] : []);

const storyImages = blogArticles.flatMap<GalleryImage>((article) => [
  { category: `Stories`, src: article.image, title: article.title, alt: article.imageAlt, id: `story-${article.slug}` },
  ...article.sections.flatMap<GalleryImage>((section) => section.image ? [{
    category: `Stories`,
    src: section.image.src,
    alt: section.image.alt,
    title: section.title,
    id: `story-${article.slug}-${section.id}`,
  }] : []),
]);

const reviewImages = sampleTestimonials.map<GalleryImage>((review) => ({
  category: `Reviews`,
  src: review.image,
  title: review.name,
  alt: review.imageAlt,
  id: `review-${review.id}`,
}));

const uniqueImages = new Map<string, GalleryImage>();
[...studioImages, ...serviceImages, ...shopImages, ...storyImages, ...reviewImages].forEach((image) => {
  if (!uniqueImages.has(image.src)) uniqueImages.set(image.src, image);
});

export const siteGalleryImages: readonly GalleryImage[] = [...uniqueImages.values()];
