import type { NextConfig } from 'next';
import { siteRedirects } from './src/shared/navigation/routes';

const nextConfig: NextConfig = {
  turbopack: {},
  devIndicators: false,
  reactStrictMode: true,
  redirects: async () => siteRedirects,
  headers: async () => [{
    source: `/sw.js`,
    headers: [
      { key: `Service-Worker-Allowed`, value: `/` },
      { key: `X-Content-Type-Options`, value: `nosniff` },
      { key: `Content-Type`, value: `application/javascript; charset=utf-8` },
      { key: `Cache-Control`, value: `no-cache, no-store, must-revalidate` },
    ],
  }, {
    source: `/manifest.json`,
    headers: [
      { key: `Content-Type`, value: `application/manifest+json; charset=utf-8` },
      { key: `Cache-Control`, value: `public, max-age=0, must-revalidate` },
    ],
  }],
};

export default nextConfig;
