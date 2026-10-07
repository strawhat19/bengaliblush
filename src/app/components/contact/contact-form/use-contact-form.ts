import { useState, type FormEvent } from 'react';
import { siteContact } from '@/shared/config/site';

export const useContactForm = () => {
  const [draftCreated, setDraftCreated] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const message = String(formData.get(`message`) ?? ``).trim();
    const contact = String(formData.get(`contact`) ?? ``).trim();
    const contactInput = form.elements.namedItem(`contact`) as HTMLInputElement;
    const messageInput = form.elements.namedItem(`message`) as HTMLTextAreaElement;
    const phoneDigits = contact.replace(/\D/g, ``);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const isPhone = /^\+?[\d\s().-]+$/.test(contact) && phoneDigits.length >= 7 && phoneDigits.length <= 15;

    contactInput.setCustomValidity(isEmail || isPhone ? `` : `Enter A Valid Email Or Phone Number`);
    messageInput.setCustomValidity(message ? `` : `Enter Your Message`);
    if (!form.reportValidity()) return;

    const subject = encodeURIComponent(`A Hello For Bengali Blush`);
    const body = encodeURIComponent(`${message}\n\nReply to: ${contact}`);
    window.location.href = `mailto:${siteContact.email}?subject=${subject}&body=${body}`;
    setDraftCreated(true);
  };

  const handleInput = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.currentTarget.setCustomValidity(``);
    setDraftCreated(false);
  };

  return { handleInput, handleSubmit, draftCreated };
};
