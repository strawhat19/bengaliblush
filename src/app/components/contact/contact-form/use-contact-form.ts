import { useAuth } from '@/shared/authContext/useAuth';
import { createContactSubmission } from '@/api/submissions';
import { useRef, useState, useEffect, type FormEvent } from 'react';

export const useContactForm = () => {
  const { user, loading } = useAuth();
  const accountId = user?.id ?? null;
  const pendingRef = useRef(false);
  const contactInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(``);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyDraft, setReplyDraft] = useState<{ value?: string; accountId: string | null }>({ accountId });
  let activeReply = replyDraft;
  if (replyDraft.accountId !== accountId) {
    activeReply = replyDraft.accountId === null && accountId ? { ...replyDraft, accountId } : { accountId };
    setReplyDraft(activeReply);
  }
  const contact = activeReply.value ?? (loading ? `` : user?.email ?? ``);
  const setContact = (value: string) => setReplyDraft({ value, accountId });

  useEffect(() => { contactInputRef.current?.setCustomValidity(``); }, [contact]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || pendingRef.current) return;
    if (!user) { setError(`Sign In To Send Your Message`); return; }
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

    setError(``);
    pendingRef.current = true;
    setSubmitted(false);
    setSubmitting(true);
    try {
      await createContactSubmission({ contact, message });
      form.reset();
      setReplyDraft({ accountId });
      setSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : `Unable To Save Your Message. Please Try Again`);
    } finally {
      pendingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleInput = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.currentTarget.setCustomValidity(``);
    setError(``);
    setSubmitted(false);
  };

  return { error, contact, loading, submitting, submitted, setContact, handleInput, handleSubmit, contactInputRef, canSubmit: !!user && !loading && !submitting };
};
