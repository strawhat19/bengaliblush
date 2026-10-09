import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import type { Review } from '@/shared/reviews/review-content';
import OrnamentalArch from '@/app/components/effects/ornamental-arch/ornamental-arch';

type ReviewCardProps = {
  review: Review;
};

const ReviewCard = ({ review }: ReviewCardProps) => (
  <article
    id={`bb-review-card-${review.id}`}
    className={`bb-review-card`}
    aria-labelledby={`bb-review-card-heading-${review.id}`}
  >
    <div id={`bb-review-card-portrait-frame-${review.id}`} className={`bb-review-card-portrait-frame`}>
      <div id={`bb-review-card-portrait-${review.id}`} className={`bb-review-card-portrait`}>
        <Image
          fill
          src={review.image}
          alt={review.imageAlt}
          className={`bb-review-card-image`}
          id={`bb-review-card-image-${review.id}`}
          sizes={`(max-width: 600px) calc(100vw - 70px), (max-width: 900px) 45vw, 350px`}
        />
        <span id={`bb-review-card-portrait-label-${review.id}`} className={`bb-review-card-portrait-label`}>
          The Bengali Blush Feeling
        </span>
      </div>
      <OrnamentalArch id={`bb-review-card-portrait-arch-${review.id}`} />
    </div>
    <div id={`bb-review-card-copy-${review.id}`} className={`bb-review-card-copy`}>
      <div
        className={`bb-review-card-rating`}
        id={`bb-review-card-rating-${review.id}`}
        aria-label={`Sample rating: ${review.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            size={14}
            key={index}
            strokeWidth={1.2}
            aria-hidden={`true`}
            className={`bb-review-card-star`}
            id={`bb-review-card-star-${review.id}-${index + 1}`}
            fill={index < Math.round(review.rating) ? `currentColor` : `none`}
          />
        ))}
      </div>
      <h3 id={`bb-review-card-heading-${review.id}`} className={`bb-review-card-heading`}>
        {review.heading.first} <em>{review.heading.accent}</em> {review.heading.last}.
      </h3>
      <blockquote id={`bb-review-card-quote-${review.id}`} className={`bb-review-card-quote`}>
        <Quote size={22} strokeWidth={1.2} aria-hidden={`true`} className={`bb-review-card-quote-mark`} />
        <p id={`bb-review-card-quote-text-${review.id}`} className={`bb-review-card-quote-text`}>{review.quote}</p>
        <cite id={`bb-review-card-attribution-${review.id}`} className={`bb-review-card-attribution`}>
          <span id={`bb-review-card-name-${review.id}`} className={`bb-review-card-name`}>{review.name}</span>
          <span id={`bb-review-card-service-${review.id}`} className={`bb-review-card-service`}>{review.service}</span>
        </cite>
      </blockquote>
    </div>
  </article>
);

export default ReviewCard;
