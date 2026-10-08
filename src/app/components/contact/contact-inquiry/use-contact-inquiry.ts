import { siteContact } from '@/shared/config/site';
import { useState, type KeyboardEvent } from 'react';
import type { BookingFormValues } from '@/app/components/booking/booking-form/booking-form';

const formModes = [`message`, `appointment`] as const;

export const useContactInquiry = () => {
  const [mode, setMode] = useState<(typeof formModes)[number]>(`message`);
  const [appointmentDraftCreated, setAppointmentDraftCreated] = useState(false);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (![ `End`, `Home`, `ArrowLeft`, `ArrowRight` ].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = formModes.indexOf(mode);
    const nextIndex = event.key === `Home` ? 0 : event.key === `End` ? formModes.length - 1
      : (currentIndex + (event.key === `ArrowLeft` ? -1 : 1) + formModes.length) % formModes.length;
    const nextMode = formModes[nextIndex];
    if (!nextMode) return;
    setMode(nextMode);
    document.getElementById(`bb-contact-${nextMode}-tab`)?.focus();
  };

  const clearAppointmentDraft = () => setAppointmentDraftCreated(false);
  const handleAppointmentSubmit = (name: string, service: string, values: BookingFormValues) => {
    const subject = encodeURIComponent(`Appointment Request: ${service}`);
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Service: ${service}`,
      `Preferred Date: ${values.date}`,
      `Preferred Time: ${values.time}`,
      `Reply To: ${values.email}`,
      ``,
      `Notes: ${values.notes.trim() || `None`}`,
    ].join(`\n`));

    window.location.href = `mailto:${siteContact.email}?subject=${subject}&body=${body}`;
    setAppointmentDraftCreated(true);
  };

  return { mode, setMode, handleTabKeyDown, clearAppointmentDraft, handleAppointmentSubmit, appointmentDraftCreated };
};
