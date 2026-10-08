'use client';

import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/shared/types/storefront';
import { services } from '@/shared/services/service-content';
import { useRef, useState, useEffect, type FormEvent } from 'react';

export type BookingFormValues = {
  name: string;
  date: string;
  time: string;
  email: string;
  notes: string;
  service: string;
};

type BookingFormProps = {
  compact?: boolean;
  idPrefix?: string;
  selectedService?: Service;
  onSuccess: (name: string, service: string, values: BookingFormValues) => void;
};

const BookingForm = ({
  onSuccess,
  compact = false,
  selectedService,
  idPrefix = compact ? `modal` : undefined,
}: BookingFormProps) => {
  const [name, setName] = useState(``);
  const [date, setDate] = useState(``);
  const [time, setTime] = useState(``);
  const [email, setEmail] = useState(``);
  const [notes, setNotes] = useState(``);
  const [service, setService] = useState(selectedService?.id ?? ``);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const fieldId = (field: string) => `${idPrefix ? `${idPrefix}-` : ``}${field}`;
  const elementId = (element: string) => `${idPrefix ?? `bb-booking`}-${element}`;

  useEffect(() => {
    if (dateInputRef.current) dateInputRef.current.min = new Date().toISOString().split(`T`)?.[0] ?? ``;
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const chosen = services.find((item) => item.id === service)?.name ?? `your beauty appointment`;
    onSuccess(name || `there`, chosen, { name, date, time, email, notes, service: chosen });
  };

  return (
    <form
      onSubmit={submit}
      id={elementId(`form`)}
      className={`bb-booking-form`}
      data-testid={compact ? `form-modal-booking` : `form-booking`}
    >
      <div className={`bb-field`} id={elementId(`name-field`)}>
        <label className={`bb-booking-label`} id={elementId(`name-label`)} htmlFor={fieldId(`name`)}>Your name</label>
        <input
          required
          value={name}
          id={fieldId(`name`)}
          placeholder={`First and last`}
          className={`bb-booking-input`}
          data-testid={`input-booking-name`}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className={`bb-field`} id={elementId(`service-field`)}>
        <label className={`bb-booking-label`} id={elementId(`service-label`)} htmlFor={fieldId(`service`)}>I’m here for</label>
        <select
          required
          value={service}
          id={fieldId(`service`)}
          className={`bb-booking-select`}
          data-testid={`select-booking-service`}
          onChange={(event) => setService(event.target.value)}
        >
          <option value={``} disabled className={`bb-booking-option`} id={elementId(`service-placeholder`)}>Choose a service</option>
          {services.map((item) => (
            <option
              key={item.id}
              value={item.id}
              className={`bb-booking-option`}
              id={elementId(`service-option-${item.id}`)}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className={`bb-field`} id={elementId(`date-field`)}>
        <label className={`bb-booking-label`} id={elementId(`date-label`)} htmlFor={fieldId(`date`)}>Preferred date</label>
        <input
          required
          type={`date`}
          value={date}
          id={fieldId(`date`)}
          ref={dateInputRef}
          className={`bb-booking-input`}
          data-testid={`input-booking-date`}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>
      <div className={`bb-field`} id={elementId(`time-field`)}>
        <label className={`bb-booking-label`} id={elementId(`time-label`)} htmlFor={fieldId(`time`)}>Preferred time</label>
        <select
          required
          value={time}
          id={fieldId(`time`)}
          className={`bb-booking-select`}
          data-testid={`select-booking-time`}
          onChange={(event) => setTime(event.target.value)}
        >
          <option value={``} disabled className={`bb-booking-option`} id={elementId(`time-placeholder`)}>Pick a window</option>
          {[`10:00 AM`, `12:30 PM`, `3:00 PM`, `5:30 PM`].map((window, index) => (
            <option className={`bb-booking-option`} id={elementId(`time-option-${index}`)} key={window}>{window}</option>
          ))}
        </select>
      </div>
      <div className={`bb-field bb-field-full`} id={elementId(`email-field`)}>
        <label className={`bb-booking-label`} id={elementId(`email-label`)} htmlFor={fieldId(`email`)}>Email address</label>
        <input
          required
          type={`email`}
          value={email}
          id={fieldId(`email`)}
          className={`bb-booking-input`}
          placeholder={`you@example.com`}
          data-testid={`input-booking-email`}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className={`bb-field bb-field-full`} id={elementId(`notes-field`)}>
        <label className={`bb-booking-label`} id={elementId(`notes-label`)} htmlFor={fieldId(`notes`)}>
          Anything I should know? <span className={`bb-booking-optional`} id={elementId(`notes-optional`)} style={{ opacity: .55 }}>(optional)</span>
        </label>
        <textarea
          value={notes}
          id={fieldId(`notes`)}
          className={`bb-booking-textarea`}
          data-testid={`input-booking-notes`}
          placeholder={`Tell me about the occasion...`}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>
      <button
        type={`submit`}
        id={elementId(`submit`)}
        className={`bb-button bb-submit`}
        data-testid={`button-submit-booking`}
      >
        Request this appointment <ArrowUpRight size={16} aria-hidden className={`bb-booking-submit-icon`} id={elementId(`submit-icon`)} />
      </button>
    </form>
  );
};

export default BookingForm;
