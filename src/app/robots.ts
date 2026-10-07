import type { MetadataRoute } from 'next';
import { siteUrl } from '@/shared/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: new URL(`/sitemap.xml`, siteUrl).toString(),
    rules: {
      userAgent: `*`,
      allow: `/`,
    },
  };
}
