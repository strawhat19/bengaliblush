export type NavigationIcon = `Info` | `Home` | `LogIn` | `Quote` | `MapPin` | `FileText` | `UserPlus` | `ShieldCheck` | `ShoppingBag` | `WandSparkles`;

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
    description: `Beauty Studio`,
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
  terms: {
    href: `/terms`,
    label: `Terms`,
    icon: `FileText`,
    title: `Terms | Bengali Blush`,
    aliases: [`/terms-of-service`],
    description: `Using the website and requesting appointments`,
  },
  privacy: {
    href: `/privacy`,
    icon: `ShieldCheck`,
    label: `Privacy Policy`,
    aliases: [`/privacy-policy`],
    title: `Privacy Policy | Bengali Blush`,
    description: `How information is used on the website`,
  },
  signin: {
    icon: `LogIn`,
    href: `/signin`,
    label: `Sign In`,
    title: `Sign In | Bengali Blush`,
    description: `Welcome back to your beauty ritual`,
    aliases: [`/log`, `/sign`, `/login`, `/log-in`, `/sign-in`],
  },
  signup: {
    href: `/signup`,
    icon: `UserPlus`,
    label: `Sign Up`,
    title: `Sign Up | Bengali Blush`,
    description: `Make yourself at home at Bengali Blush`,
    aliases: [`/new`, `/sign-up`, `/register`, `/subscribe`, `/onboarding`],
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
