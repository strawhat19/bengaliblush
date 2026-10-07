import type { Metadata } from 'next';
import AboutPage from '@/app/components/about/about-page';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

export const metadata: Metadata = {
  title: `About | Bengali Blush`,
  description: `Meet Bengali Blush, an Atlanta beauty atelier founded and led by Sadia Islam Misty, for expressive lashes, hair styling, and soft glam party makeup.`,
};

const AboutRoute = () => <BengaliBlushLanding><AboutPage /></BengaliBlushLanding>;

export default AboutRoute;
