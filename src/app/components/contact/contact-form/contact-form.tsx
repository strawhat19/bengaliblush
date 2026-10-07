'use client';

import { Send, ArrowUpRight } from 'lucide-react';
import { useContactForm } from './use-contact-form';
import { siteContact } from '@/shared/config/site';

export default function ContactForm() {
  const { handleInput, handleSubmit, draftCreated } = useContactForm();

  return (
    <form id={`bb-contact-form`} className={`bb-booking-form bb-contact-form`} onSubmit={handleSubmit} data-testid={`form-contact`}>
      <div id={`bb-contact-reply-field`} className={`bb-field bb-field-full`}>
        <label id={`bb-contact-reply-label`} htmlFor={`bb-contact-reply`}>Email or phone number</label>
        <input
          required
          type={`text`}
          name={`contact`}
          maxLength={254}
          autoCorrect={`off`}
          onInput={handleInput}
          autoCapitalize={`none`}
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
        id={`bb-contact-submit`}
        data-testid={`button-submit-contact`}
        aria-describedby={`bb-contact-delivery-note`}
        className={`bb-button bb-submit bb-contact-submit`}
      >
        Send message <Send size={15} aria-hidden={`true`} />
      </button>
      <p id={`bb-contact-delivery-note`} className={`bb-contact-delivery-note bb-field-full`}>
        Opens a draft in your email app. Send it from there to reach the studio.
      </p>
      {draftCreated && (
        <div role={`status`} id={`bb-contact-draft-status`} className={`bb-contact-draft-status bb-field-full`} data-testid={`status-contact-draft`}>
          <p id={`bb-contact-draft-message`} className={`bb-contact-draft-message`}>Finish sending your message in your email app.</p>
          <a id={`bb-contact-email-fallback`} className={`bb-contact-email-fallback`} href={`mailto:${siteContact.email}`}>
            Email the studio <ArrowUpRight size={14} aria-hidden={`true`} />
          </a>
        </div>
      )}
    </form>
  );
}
