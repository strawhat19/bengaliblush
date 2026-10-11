import { useState } from 'react';
import type { EventInput, EventRecord } from '@/shared/models/events/Event';

export const useEventEditor = (record: EventRecord | null, onSave: (input: EventInput, id?: string) => Promise<boolean>) => {
  const [error, setError] = useState(``);
  const [values, setValues] = useState<EventInput>(() => ({
    date: record?.date ?? ``,
    time: record?.time ?? ``,
    title: record?.title ?? ``,
    status: record?.status ?? `draft`,
    location: record?.location ?? ``,
    description: record?.description ?? ``,
  }));
  const setField = <Key extends keyof EventInput>(key: Key, value: EventInput[Key]) => {
    setError(``);
    setValues((current) => ({ ...current, [key]: value }));
  };
  const submit = async () => {
    setError(``);
    try { return await onSave(values, record?.id); }
    catch { setError(`Unable To Save Event`); return false; }
  };
  return { error, values, submit, setField };
};
