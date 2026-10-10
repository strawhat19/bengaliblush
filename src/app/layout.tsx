import './globals.scss';

import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { siteConfig, siteUrl } from '@/shared/config/site';
import { AuthProvider } from '@/shared/authContext/AuthContext';
import BlushLoader from '@/app/components/loaders/blush-loader';
import { ThemeProvider } from '@/shared/themeContext/ThemeContext';
import { themeBootstrapScript } from '@/shared/themeContext/theme';
import PwaRegistration from '@/app/components/pwa/pwa-registration';
import { Allura, DM_Mono, DM_Sans, Fraunces } from 'next/font/google';
import { NotificationsProvider } from '@/shared/notifications/notifications-context';
import { AccountNavigationProvider } from '@/shared/accountNavigationContext/AccountNavigationContext';

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

const signature = Allura({
  weight: '400',
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-allura',
});

export const viewport: Viewport = {
  colorScheme: `light dark`,
  themeColor: `#3e0d23`,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteConfig.title,
  manifest: `/manifest.json`,
  applicationName: siteConfig.name,
  description: siteConfig.description,
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: `default`,
  },
  icons: {
    icon: { url: `/favicon.svg?v=bb-arc`, type: `image/svg+xml` },
    apple: `/apple-icon-180x180.png?v=bb-arc`,
    shortcut: `/favicon.svg?v=bb-arc`,
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
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${mono.variable} ${signature.variable}`}>
      <head>
        <script id={`bb-theme-bootstrap`} dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <NotificationsProvider>
              <AccountNavigationProvider>
                <BlushLoader />
                {children}
                <PwaRegistration />
                <Analytics />
              </AccountNavigationProvider>
            </NotificationsProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
