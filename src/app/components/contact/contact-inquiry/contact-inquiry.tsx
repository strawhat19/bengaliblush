'use client';

import { siteContact } from '@/shared/config/site';
import ContactForm from '../contact-form/contact-form';
import { useContactInquiry } from './use-contact-inquiry';
import { CalendarDays, MessageCircle, ArrowUpRight } from 'lucide-react';
import BookingForm from '@/app/components/booking/booking-form/booking-form';

const inquiryTabs = [
  { id: `message`, Icon: MessageCircle, label: `Send Message` },
  { id: `appointment`, Icon: CalendarDays, label: `Appointment` },
] as const;

const ContactInquiry = () => {
  const { mode, setMode, handleTabKeyDown, clearAppointmentDraft, handleAppointmentSubmit, appointmentDraftCreated } = useContactInquiry();
  const isAppointment = mode === `appointment`;

  return (
    <section
      id={`bb-contact-message-section`}
      aria-labelledby={`bb-contact-message-title`}
      className={`bb-section bb-booking bb-contact-message-section`}
    >
      <div id={`bb-contact-form-layout`} className={`bb-container bb-booking-layout`}>
        <div data-reveal id={`bb-contact-form-copy`} className={`bb-booking-copy`}>
          <span id={`bb-contact-form-eyebrow`} className={`bb-eyebrow`}>
            {isAppointment ? `Your next beauty moment` : `Straight from you to us`}
          </span>
          <h2 id={`bb-contact-message-title`} className={`bb-contact-message-title`}>
            {isAppointment ? `Make it` : `Leave a`}<br />
            <em>{isAppointment ? `a date.` : `little note.`}</em>
          </h2>
          <p id={`bb-contact-form-description`} className={`bb-contact-form-description`}>
            {isAppointment
              ? `Choose your service and preferred time. Share a few details so we can plan your next visit.`
              : `Tell us what you’re dreaming up. Share your email or phone number and a message, and we’ll take it from there.`}
          </p>
        </div>
        <div data-reveal id={`bb-contact-form-wrap`} className={`bb-contact-form-wrap`}>
          <div
            role={`tablist`}
            aria-label={`Contact the studio`}
            id={`bb-contact-inquiry-tabs`}
            className={`bb-contact-inquiry-tabs`}
          >
            {inquiryTabs.map(({ id, Icon, label }) => (
              <button
                key={id}
                role={`tab`}
                type={`button`}
                aria-selected={mode === id}
                id={`bb-contact-${id}-tab`}
                onClick={() => setMode(id)}
                onKeyDown={handleTabKeyDown}
                tabIndex={mode === id ? 0 : -1}
                className={`bb-contact-inquiry-tab`}
                aria-controls={`bb-contact-${id}-panel`}
                data-testid={`button-contact-tab-${id}`}
              >
                <Icon size={15} aria-hidden={`true`} />
                {label}
              </button>
            ))}
          </div>
          <div
            role={`tabpanel`}
            hidden={isAppointment}
            id={`bb-contact-message-panel`}
            className={`bb-contact-inquiry-panel`}
            aria-labelledby={`bb-contact-message-tab`}
          >
            <ContactForm />
          </div>
          <div
            role={`tabpanel`}
            hidden={!isAppointment}
            id={`bb-contact-appointment-panel`}
            className={`bb-contact-inquiry-panel`}
            onChangeCapture={clearAppointmentDraft}
            aria-labelledby={`bb-contact-appointment-tab`}
          >
            <BookingForm idPrefix={`bb-contact-appointment`} onSuccess={handleAppointmentSubmit} />
            <p id={`bb-contact-appointment-delivery-note`} className={`bb-contact-appointment-delivery-note`}>
              Opens a draft in your email app. Send it from there to request your appointment.
            </p>
            {appointmentDraftCreated && (
              <div
                role={`status`}
                id={`bb-contact-appointment-draft-status`}
                className={`bb-contact-draft-status`}
                data-testid={`status-contact-appointment-draft`}
              >
                <p id={`bb-contact-appointment-draft-message`} className={`bb-contact-draft-message`}>
                  Finish sending your appointment request in your email app.
                </p>
                <a
                  href={`mailto:${siteContact.email}`}
                  id={`bb-contact-appointment-email-fallback`}
                  className={`bb-contact-email-fallback`}
                >
                  Email the studio <ArrowUpRight size={14} aria-hidden={`true`} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInquiry;
