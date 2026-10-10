import { useAuth } from '@/shared/authContext/useAuth';
import type { Service } from '@/shared/types/storefront';
import { useCatalog } from '@/shared/shop/catalog-context';
import { createAppointmentSubmission } from '@/api/submissions';
import { useRef, useState, useEffect, type FormEvent } from 'react';

export type BookingFormValues = {
  name: string;
  date: string;
  time: string;
  email: string;
  notes: string;
  service: string;
};

export type BookingSuccessHandler = (name: string, service: string, values: BookingFormValues) => void;

type BookingIdentityDraft = {
  name?: string;
  email?: string;
  accountId: string | null;
};

export const useBookingForm = (onSuccess: BookingSuccessHandler, selectedService?: Service) => {
  const { services } = useCatalog(`services`);
  const { user } = useAuth();
  const accountId = user?.id ?? null;
  const pendingRef = useRef(false);
  const [date, setDate] = useState(``);
  const [time, setTime] = useState(``);
  const [notes, setNotes] = useState(``);
  const [error, setError] = useState(``);
  const [submitting, setSubmitting] = useState(false);
  const [service, setService] = useState(selectedService?.id ?? ``);
  const [identityDraft, setIdentityDraft] = useState<BookingIdentityDraft>({ accountId });
  const dateInputRef = useRef<HTMLInputElement>(null);
  let activeIdentity = identityDraft;

  if (identityDraft.accountId !== accountId) {
    activeIdentity = identityDraft.accountId === null && accountId !== null ? { ...identityDraft, accountId } : { accountId };
    setIdentityDraft(activeIdentity);
  }

  const name = activeIdentity.name ?? user?.name ?? ``;
  const email = activeIdentity.email ?? user?.email ?? ``;
  const setName = (name: string) => setIdentityDraft((current) => ({ ...current, name, accountId }));
  const setEmail = (email: string) => setIdentityDraft((current) => ({ ...current, email, accountId }));

  useEffect(() => {
    if (dateInputRef.current) dateInputRef.current.min = new Date().toISOString().split(`T`)?.[0] ?? ``;
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pendingRef.current) return;
    const chosen = services.records.find((item) => item.id === service)?.name;
    if (!chosen) { setError(`Choose A Service`); return; }
    const values = { date, time, service: chosen, name: name.trim(), notes: notes.trim(), email: email.trim() };

    setError(``);
    pendingRef.current = true;
    setSubmitting(true);
    try {
      await createAppointmentSubmission(values);
      setIdentityDraft({ accountId });
      setDate(``);
      setTime(``);
      setNotes(``);
      setService(selectedService?.id ?? ``);
      onSuccess(values.name, values.service, values);
    } catch (error) {
      setError(error instanceof Error ? error.message : `Unable To Save Your Request. Please Try Again`);
    } finally {
      pendingRef.current = false;
      setSubmitting(false);
    }
  };

  return {
    name, date, time, email, notes, error, service, submitting,
    submit, setName, setDate, setTime, setEmail, setNotes, setError, setService,
    services, dateInputRef, canSubmit: !submitting && !services.loading && !services.error && Boolean(services.records.length),
  };
};
