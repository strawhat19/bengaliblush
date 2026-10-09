import { getPublishedReviews } from '@/api/commerce';
import type { Review } from '@/shared/reviews/review-content';

export const getReviews = async (): Promise<Review[]> => getPublishedReviews();
