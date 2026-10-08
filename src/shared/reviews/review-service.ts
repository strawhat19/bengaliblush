import { sampleTestimonials, type Review } from '@/shared/reviews/review-content';

export const getReviews = async (): Promise<Review[]> => sampleTestimonials;
