import Image from 'next/image';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import { getServiceHref } from '@/shared/services/service-utils';
import Link from '@/app/components/navigation/page-link/page-link';
import type { ServiceDetails } from '@/shared/services/service-types';
import ServiceBookingButton from '@/app/components/services/service-booking-button/service-booking-button';

type ServiceCardProps = {
  idPrefix?: string;
  service: ServiceDetails;
};

const ServiceCard = ({ service, idPrefix = `bb-service-card` }: ServiceCardProps) => {
  const cardId = `${idPrefix}-${service.id}`;

  return (
    <article
      id={cardId}
      className={`bb-service-card`}
      aria-labelledby={`${cardId}-title`}
    >
      <Link
        id={`${cardId}-link`}
        className={`bb-service-card-link`}
        href={getServiceHref(service.slug)}
      >
        <div id={`${cardId}-visual`} className={`bb-service-card-visual`}>
          <Image
            fill
            src={service.image}
            alt={service.imageAlt}
            id={`${cardId}-image`}
            className={`bb-service-card-image`}
            sizes={`(max-width: 600px) calc(100vw - 36px), (max-width: 1000px) 45vw, 380px`}
          />
          <span id={`${cardId}-number`} className={`bb-service-card-number`}>{service.number}</span>
        </div>
        <div id={`${cardId}-body`} className={`bb-service-card-body`}>
          <h3 id={`${cardId}-title`} className={`bb-service-card-title`}>{service.name}</h3>
          <p id={`${cardId}-description`} className={`bb-service-card-description`}>{service.description}</p>
          <div id={`${cardId}-meta`} className={`bb-service-card-meta`}>
            <span id={`${cardId}-duration`} className={`bb-service-card-duration`}>
              <Clock3 size={13} aria-hidden={`true`} />
              {service.duration}
            </span>
            <span id={`${cardId}-price`} className={`bb-service-card-price`}>{service.price}</span>
          </div>
          <span id={`${cardId}-details`} className={`bb-service-card-details`}>
            Explore Service <ArrowUpRight size={16} aria-hidden={`true`} />
          </span>
        </div>
      </Link>
      <div id={`${cardId}-booking`} className={`bb-service-card-booking`}>
        <ServiceBookingButton service={service} idPrefix={`${cardId}-book`} />
      </div>
    </article>
  );
};

export default ServiceCard;
