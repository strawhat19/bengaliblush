'use client';

import { Send } from 'lucide-react';
import { useContactForm } from './use-contact-form';

export default function ContactForm() {
  const { error, contact, submitting, submitted, canSubmit, setContact, handleInput, handleSubmit, contactInputRef } = useContactForm();

  return (
    <form id={`bb-contact-form`} aria-busy={submitting} className={`bb-booking-form bb-contact-form`} onSubmit={handleSubmit} data-testid={`form-contact`}>
      <div id={`bb-contact-reply-field`} className={`bb-field bb-field-full`}>
        <label id={`bb-contact-reply-label`} htmlFor={`bb-contact-reply`}>Email or phone number</label>
        <input
          required
          disabled={submitting}
          type={`text`}
          name={`contact`}
          value={contact}
          maxLength={254}
          ref={contactInputRef}
          autoCorrect={`off`}
          onInput={handleInput}
          autoCapitalize={`none`}
          onChange={(event) => setContact(event.currentTarget.value)}
          id={`bb-contact-reply`}
          className={`bb-contact-input`}
          data-testid={`input-contact-reply`}
          aria-describedby={`bb-contact-reply-help`}
          placeholder={`you@example.com or +1 (555) 123-4567`}
        />
        <small id={`bb-contact-reply-help`} className={`bb-contact-field-help`}>Just one is enough. Let us know where to reach you.</small>
      </div>
      <div id={`bb-contact-message-field`} className={`bb-field bb-field-full`}>
        <label id={`bb-contact-message-label`} htmlFor={`bb-contact-message`}>Your message</label>
        <textarea
          required
          rows={5}
          disabled={submitting}
          name={`message`}
          maxLength={5000}
          onInput={handleInput}
          id={`bb-contact-message`}
          className={`bb-contact-message`}
          data-testid={`input-contact-message`}
          placeholder={`A question, an occasion, or a little hello…`}
        />
      </div>
      <button
        type={`submit`}
        disabled={!canSubmit}
        id={`bb-contact-submit`}
        data-testid={`button-submit-contact`}
        aria-describedby={`bb-contact-delivery-note`}
        className={`bb-button bb-submit bb-contact-submit`}
      >
        {submitting ? `Saving Message…` : `Send Message`} <Send size={15} aria-hidden={`true`} />
      </button>
      <p id={`bb-contact-delivery-note`} className={`bb-contact-delivery-note bb-field-full`}>
        Your message is saved securely for the studio to review. No account is needed.
      </p>
      {error && <p role={`alert`} id={`bb-contact-error`} className={`bb-submission-error bb-field-full`}>{error}</p>}
      {submitted && (
        <div role={`status`} id={`bb-contact-saved-status`} className={`bb-contact-saved-status bb-field-full`} data-testid={`status-contact-saved`}>
          <p id={`bb-contact-saved-message`} className={`bb-contact-saved-message`}>Your message has been saved for the studio to review. The studio can reply using the contact details you shared.</p>
        </div>
      )}
    </form>
  );
}
