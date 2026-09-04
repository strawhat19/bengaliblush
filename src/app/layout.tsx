import './globals.scss';

import type { Metadata, Viewport } from 'next';
import { DM_Mono, DM_Sans, Fraunces } from 'next/font/google';
import { siteConfig } from '@/shared/config/site';
import BlushLoader from '@/app/components/loaders/blush-loader';
import PwaRegistration from '@/app/components/pwa/pwa-registration';

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
});

const serif = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  weight: 'variable',
  axes: ['opsz'],
});

const mono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:3000`;

export const viewport: Viewport = {
  colorScheme: `light`,
  themeColor: `#3e0d23`,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteConfig.title,
  manifest: `/manifest.json`,
  description: siteConfig.description,
  icons: {
    icon: { url: `/favicon.svg`, type: `image/svg+xml` },
    apple: `/apple-icon-180x180.png`,
    shortcut: `/favicon.svg`,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.socialDescription,
    images: [{ url: `/hero-beauty.jpg`, alt: `Bengali Blush Atelier` }],
    type: `website`,
  },
  twitter: {
    card: `summary_large_image`,
    title: siteConfig.name,
    description: siteConfig.socialDescription,
    images: [`/hero-beauty.jpg`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <BlushLoader />
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
