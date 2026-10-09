import { useState } from 'react';
import type { NotificationInput, NotificationRecord, NotificationStatus, NotificationKind } from '@/shared/models/notifications/Notification';

export const useNotificationEditor = (record: NotificationRecord | null, onSave: (input: NotificationInput, id?: string) => Promise<boolean>) => {
  const [error, setError] = useState(``);
  const [values, setValues] = useState(() => ({
    body: record?.body ?? ``,
    slug: record?.slug ?? ``,
    title: record?.title ?? ``,
    suffix: record?.suffix ?? ``,
    linkHref: record?.link?.href ?? ``,
    linkLabel: record?.link?.label ?? ``,
    kind: record?.kind ?? `announcement`,
  }));
  const setField = (key: keyof typeof values, value: string) => {
    setError(``);
    setValues((current) => ({ ...current, [key]: value }));
  };
  const submit = async (status: NotificationStatus) => {
    if (Boolean(values.linkHref.trim()) !== Boolean(values.linkLabel.trim())) {
      setError(`Enter A Link Label And Destination, Or Leave Both Empty`);
      return false;
    }
    setError(``);
    return onSave({
      status,
      body: values.body,
      slug: values.slug,
      title: values.title,
      kind: values.kind as NotificationKind,
      ...(values.suffix ? { suffix: values.suffix } : {}),
      ...(values.linkHref.trim() ? { link: { href: values.linkHref, label: values.linkLabel } } : {}),
    }, record?.id);
  };
  return { error, values, submit, setField };
};
