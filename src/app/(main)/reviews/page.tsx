import type { Metadata } from 'next';
import { getReviews } from '@/shared/reviews/review-service';
import ReviewsPage from '@/app/components/reviews/reviews-page/reviews-page';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

export const metadata: Metadata = {
  title: `Reviews | Bengali Blush`,
  alternates: { canonical: `/reviews` },
  description: `Explore illustrative beauty stories and the Bengali Blush feeling, with soft lash looks and inspiration for your next Atlanta studio visit.`,
};

const ReviewsRoute = async () => {
  const reviews = await getReviews();

  return <BengaliBlushLanding><ReviewsPage reviews={reviews} /></BengaliBlushLanding>;
};

export default ReviewsRoute;
