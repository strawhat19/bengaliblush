import type { Metadata } from 'next';
import LegalPage from '@/app/components/legal/legal-page';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

export const metadata: Metadata = {
  title: `Terms | Bengali Blush`,
  description: `Read the terms for using the Bengali Blush website, arranging appointments, making enquiries, and browsing the shop.`,
};

const TermsRoute = () => <BengaliBlushLanding><LegalPage kind={`terms`} /></BengaliBlushLanding>;

export default TermsRoute;
