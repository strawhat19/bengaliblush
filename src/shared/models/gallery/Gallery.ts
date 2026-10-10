export type GalleryCategory = `Studio` | `Services` | `Shop` | `Stories` | `Reviews`;

export const galleryCategories: readonly GalleryCategory[] = [`Studio`, `Services`, `Shop`, `Stories`, `Reviews`];

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  width?: number;
  height?: number;
  category: GalleryCategory;
};
