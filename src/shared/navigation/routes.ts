export type NavigationIcon = `Info` | `Home` | `Quote` | `MapPin` | `ShoppingBag` | `WandSparkles`;

export type SiteRoute = {
  href: string;
  label: string;
  title?: string;
  section?: string;
  icon: NavigationIcon;
  description: string;
  aliases?: readonly string[];
};

export const siteRoutes = {
  home: {
    href: `/`,
    icon: `Home`,
    label: `Home`,
    description: `Beauty, with feeling`,
  },
  about: {
    icon: `Info`,
    href: `/about`,
    label: `About`,
    title: `About Bengali Blush`,
    description: `The story behind Bengali Blush`,
    aliases: [`/info`, `/company`, `/aboutus`, `/aboutme`, `/about-us`, `/about-me`],
  },
  services: {
    label: `Services`,
    href: `/#services`,
    section: `services`,
    icon: `WandSparkles`,
    description: `Signature looks made for your moment`,
  },
  shop: {
    label: `Shop`,
    href: `/#shop`,
    section: `shop`,
    icon: `ShoppingBag`,
    description: `Curated rituals and beauty essentials`,
  },
  reviews: {
    icon: `Quote`,
    label: `Reviews`,
    href: `/#reviews`,
    section: `reviews`,
    description: `Kind words from lash clients`,
  },
  contact: {
    icon: `MapPin`,
    href: `/contact`,
    label: `Contact`,
    title: `Contact Bengali Blush`,
    description: `Find us and plan your next visit`,
    aliases: [`/contactme`, `/contactus`, `/getintouch`, `/contact-me`, `/contact-us`, `/get-in-touch`],
  },
} satisfies Record<string, SiteRoute>;

export const navigationRoutes: readonly SiteRoute[] = [
  siteRoutes.about,
  siteRoutes.services,
  siteRoutes.shop,
  siteRoutes.reviews,
  siteRoutes.contact,
];

export const siteRedirects = Object.values<SiteRoute>(siteRoutes).flatMap(({ href, aliases }) =>
  aliases?.map((source) => ({ source, destination: href, permanent: true })) ?? [],
);
