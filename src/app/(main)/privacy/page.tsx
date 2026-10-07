import type { Metadata } from 'next';
import LegalPage from '@/app/components/legal/legal-page';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

export const metadata: Metadata = {
  title: `Privacy Policy | Bengali Blush`,
  description: `Learn how Bengali Blush handles contact enquiries, browser storage, analytics, and external services on this website.`,
};

const PrivacyRoute = () => <BengaliBlushLanding><LegalPage kind={`privacy`} /></BengaliBlushLanding>;

export default PrivacyRoute;
