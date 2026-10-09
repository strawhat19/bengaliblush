import type { Metadata } from 'next';
import ReviewsPage from '@/app/components/reviews/reviews-page/reviews-page';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

export const metadata: Metadata = {
  title: `Reviews | Bengali Blush`,
  alternates: { canonical: `/reviews` },
  description: `Explore published Bengali Blush reviews and beauty stories from the studio.`,
};

const ReviewsRoute = () => {
  return <BengaliBlushLanding><ReviewsPage /></BengaliBlushLanding>;
};

export default ReviewsRoute;
