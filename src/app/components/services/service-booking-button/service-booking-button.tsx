'use client';

import { useContext } from 'react';
import { CalendarDays } from 'lucide-react';
import type { Service } from '@/shared/types/storefront';
import { BookingContext } from '@/shared/services/booking-context';

type ServiceBookingButtonProps = {
  service: Service;
  idPrefix?: string;
};

const ServiceBookingButton = ({ service, idPrefix = `bb-service-booking` }: ServiceBookingButtonProps) => {
  const openBooking = useContext(BookingContext);

  return (
    <button
      type={`button`}
      id={`${idPrefix}-${service.id}`}
      onClick={() => openBooking?.(service)}
      aria-label={`Book ${service.name}`}
      className={`bb-button bb-button-primary bb-service-booking-button`}
    >
      <CalendarDays size={15} aria-hidden={`true`} />
      Book Appointment
    </button>
  );
};

export default ServiceBookingButton;
