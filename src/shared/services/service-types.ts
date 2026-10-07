import type { Service } from '@/shared/types/storefront';

export type ServiceDetails = Service & {
  slug: string;
  image: string;
  imageAlt: string;
  overview: readonly string[];
  highlights: readonly string[];
  preparation: readonly string[];
  relatedBlogSlugs: readonly string[];
  faqs: readonly { answer: string; question: string }[];
};
