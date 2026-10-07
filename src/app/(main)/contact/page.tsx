import type { Metadata } from 'next';
import ContactPage from '@/app/components/contact/contact-page';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

export const metadata: Metadata = {
  title: `Contact | Bengali Blush`,
  description: `Get in touch with Bengali Blush in Atlanta. Ask about lashes, makeup, hair styling, or the shop, and find the studio’s contact details and Instagram.`,
};

export default function ContactRoute() {
  return <BengaliBlushLanding><ContactPage /></BengaliBlushLanding>;
}
