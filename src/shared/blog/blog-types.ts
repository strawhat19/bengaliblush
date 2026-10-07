export type BlogCategorySlug = `beauty` | `makeup` | `bridal` | `hair-care` | `health-wellness`;

export type BlogCategory = {
  label: string;
  slug: BlogCategorySlug;
  description: string;
};

export type BlogImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type BlogSection = {
  id: string;
  title: string;
  image?: BlogImage;
  tips?: readonly string[];
  paragraphs: readonly string[];
};

export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  description: string;
  publishedAt: string;
  category: BlogCategorySlug;
  intro: readonly string[];
  relatedSlugs: readonly string[];
  sections: readonly BlogSection[];
  sources: readonly { href: string; title: string }[];
  faqs: readonly { answer: string; question: string }[];
};
