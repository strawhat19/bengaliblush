import { getPageName } from '@/shared/navigation/page-name';
import { navigationIcons } from '@/shared/navigation/navigation-icons';
import { siteRoutes, type SiteRoute } from '@/shared/navigation/routes';
import flagCodes from '../../../../../../public/analytics/flags/codes.json';
import { formatTrafficSegment, isOtherTrafficSegment, type TrafficSegment } from '../traffic-analytics-data';
import { Globe, Link2, MapPin, Laptop, Tablet, FileText, Monitor, Smartphone, MonitorSmartphone, type LucideIcon } from 'lucide-react';

const countryCodes = new Set(flagCodes);
const deviceIcons: Record<string, LucideIcon> = { laptop: Laptop, tablet: Tablet, desktop: Monitor, mobile: Smartphone };
const pageRoutes = Object.values<SiteRoute>(siteRoutes).flatMap((route) => [route.href, ...(route.aliases ?? [])].map((path) => ({ path, route }))).sort((first, second) => second.path.length - first.path.length);
const sourceBrands = [
  { key: `x`, label: `X / Twitter`, color: `currentColor`, hosts: [`x.com`, `t.co`, `twitter.com`] },
  { key: `bing`, label: `Bing`, color: `#008373`, hosts: [`bing.com`] },
  { key: `vercel`, label: `Vercel`, color: `currentColor`, hosts: [`vercel.app`, `vercel.com`] },
  { key: `github`, label: `GitHub`, color: `currentColor`, hosts: [`github.com`] },
  { key: `tiktok`, label: `TikTok`, color: `currentColor`, hosts: [`tiktok.com`] },
  { key: `reddit`, label: `Reddit`, color: `#ff4500`, hosts: [`reddit.com`, `redd.it`] },
  { key: `youtube`, label: `YouTube`, color: `#ff0000`, hosts: [`youtube.com`, `youtu.be`] },
  { key: `linkedin`, label: `LinkedIn`, color: `#0a66c2`, hosts: [`linkedin.com`, `lnkd.in`] },
  { key: `facebook`, label: `Facebook`, color: `#1877f2`, hosts: [`facebook.com`, `fb.com`, `fb.me`] },
  { key: `instagram`, label: `Instagram`, color: `#e4405f`, hosts: [`instagram.com`, `instagr.am`] },
  { key: `whatsapp`, label: `WhatsApp`, color: `#128c7e`, hosts: [`whatsapp.com`, `wa.me`] },
  { key: `duckduckgo`, label: `DuckDuckGo`, color: `#de5833`, hosts: [`duckduckgo.com`] },
  { key: `pinterest`, label: `Pinterest`, color: `#bd081c`, hosts: [`pinterest.com`, `pinterest.co.uk`, `pin.it`] },
  { key: `google`, label: `Google`, color: `#4285f4`, hosts: [`google.com`, `google.ca`, `google.de`, `google.fr`, `google.co.uk`, `google.co.in`, `google.com.bd`, `google.com.au`] },
] as const;

export type TrafficSegmentIdentity = { label: string; Icon: LucideIcon; caption?: string; countryCode?: string; brand?: { key: string; color: string } };

const getTrafficURL = (value: string) => {
  const raw = value.trim();
  if (!/^(https?:\/\/|\/\/|[\w-]+(?:\.[\w-]+)+(?:[:/?#]|$))/i.test(raw)) return null;
  try {
    const url = new URL(raw.startsWith(`//`) ? `https:${raw}` : /^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return [`https:`, `http:`].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
};

export const getTrafficSegmentIdentity = (segment: TrafficSegment, value: string): TrafficSegmentIdentity => {
  const fallbackIcon = segment === `country` ? MapPin : segment === `path` ? FileText : segment === `device` ? deviceIcons[value.toLowerCase()] ?? MonitorSmartphone : Globe;
  if (isOtherTrafficSegment(value)) return { label: `Other`, Icon: fallbackIcon };
  if (segment === `country`) {
    const countryCode = value.toLowerCase();
    return countryCodes.has(countryCode) ? { countryCode, Icon: MapPin, label: formatTrafficSegment(segment, value.toUpperCase()) } : { Icon: MapPin, label: formatTrafficSegment(segment, value) };
  }
  if (segment === `path`) {
    const path = getTrafficURL(value)?.pathname ?? value.split(/[?#]/)?.[0] ?? `/`;
    const pathname = path.replace(/\/+$/, ``) || `/`;
    const route = pageRoutes.find(({ path }) => pathname === path || path !== `/` && pathname.startsWith(`${path}/`))?.route;
    return { caption: value || `/`, label: route?.label ?? getPageName(pathname), Icon: route ? navigationIcons[route.icon] : FileText };
  }
  if (segment === `referrer`) {
    if (!value || [`__direct__`, `__unknown__`, `direct`, `(direct)`].includes(value.toLowerCase())) return { Icon: Link2, label: `Direct / Unknown` };
    const host = getTrafficURL(value)?.hostname.toLowerCase() ?? ``;
    const brand = sourceBrands.find(({ key, label, hosts }) => value.toLowerCase() === key || label.toLowerCase().split(`/`).some((name) => value.toLowerCase() === name.trim()) || hosts.some((domain) => host === domain || host.endsWith(`.${domain}`)));
    return { caption: value, Icon: Globe, label: brand?.label ?? (host ? host.replace(/^www\./, ``) : formatTrafficSegment(segment, value)), ...(brand ? { brand: { key: brand.key, color: brand.color } } : {}) };
  }
  return { Icon: fallbackIcon, label: formatTrafficSegment(segment, value) };
};
