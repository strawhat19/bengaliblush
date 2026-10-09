'use client';

import Image from 'next/image';
import { useContext } from 'react';
import { Clock3, Plus, WandSparkles } from 'lucide-react';
import { BookingContext } from '@/shared/services/booking-context';
import type { ServiceDetails } from '@/shared/services/service-types';

type ServiceRowProps = {
  service: ServiceDetails;
};

const ServiceRow = ({ service }: ServiceRowProps) => {
  const rowId = `bb-landing-service-${service.id}`;
  const openBooking = useContext(BookingContext);

  return (
    <button
      id={rowId}
      type={`button`}
      aria-label={`Book ${service.name}`}
      className={`bb-service bb-service-row`}
      onClick={() => openBooking?.(service)}
      data-testid={`card-service-${service.id}`}
    >
      <span id={`${rowId}-number`} className={`bb-service-number`}>{service.number}</span>
      <span id={`${rowId}-visual`} className={`bb-service-visual`}>
        {service.image ? <Image
          fill
          unoptimized={/^https?:\/\//.test(service.image)}
          src={service.image}
          alt={service.imageAlt}
          id={`${rowId}-image`}
          className={`bb-service-image`}
          sizes={`(max-width: 600px) 64px, (max-width: 800px) 76px, (max-width: 1000px) 88px, 100px`}
        /> : <WandSparkles className={`bb-service-image-placeholder`} size={28} aria-hidden={`true`} />}
      </span>
      <span id={`${rowId}-copy`} className={`bb-service-copy`}>
        <span id={`${rowId}-title`} className={`bb-service-title`}>{service.name}</span>
        <span id={`${rowId}-description`} className={`bb-service-description`}>{service.description}</span>
      </span>
      <span id={`${rowId}-duration`} className={`bb-service-meta`}>
        <Clock3 size={13} aria-hidden={`true`} />
        {service.duration}
      </span>
      <span id={`${rowId}-price`} className={`bb-service-price`}>{service.price}</span>
      <span aria-hidden={`true`} id={`${rowId}-book`} className={`bb-service-book`}>
        <Plus size={17} />
      </span>
    </button>
  );
};

export default ServiceRow;
