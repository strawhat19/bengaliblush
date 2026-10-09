import { useState } from 'react';
import type { CommerceMutation } from '../use-admin-commerce';
import type { EditableCommerceSection, EditableCommerceRecord } from '../commerce-data';

export type CommerceField = { key: string; label: string; required?: boolean; type?: `text` | `number` | `textarea` | `select`; options?: readonly string[]; min?: number; max?: number; step?: number; maxLength?: number; };

const commonFields: CommerceField[] = [{ key: `name`, label: `Name`, required: true, maxLength: 120 }];
const imageFields: CommerceField[] = [{ key: `image`, label: `Image URL Or Local Path`, maxLength: 2048 }, { key: `imageAlt`, label: `Image Description`, maxLength: 300 }];
const descriptionField: CommerceField = { key: `description`, type: `textarea`, label: `Description`, required: true };

export const commerceFields: Record<EditableCommerceSection, CommerceField[]> = {
  products: [
    ...commonFields,
    { key: `slug`, label: `Shop URL Slug`, required: true, maxLength: 100 },
    { key: `category_id`, label: `Category Slug`, required: true, maxLength: 100 },
    { key: `category_name`, label: `Category Name`, required: true, maxLength: 120 },
    { key: `price`, label: `Price (USD)`, required: true, type: `number`, min: 0, max: 1000000, step: .01 },
    { key: `label`, label: `Product Label`, maxLength: 120 },
    { key: `shade`, label: `Artwork Shade`, required: true, maxLength: 60 },
    { key: `visual`, label: `Artwork Type`, type: `select`, options: [``, `serum`, `apparel`, `candle`, `tool`] },
    descriptionField,
    ...imageFields,
  ],
  services: [
    ...commonFields,
    { key: `slug`, label: `Service URL Slug`, required: true, maxLength: 100 },
    { key: `price`, label: `Display Price`, required: true, maxLength: 80 },
    { key: `duration`, label: `Duration`, required: true, maxLength: 120 },
    descriptionField,
    ...imageFields,
  ],
  reviews: [
    ...commonFields,
    { key: `service`, label: `Service Or Client Description`, required: true, maxLength: 160 },
    { key: `rating`, label: `Rating`, type: `number`, min: 1, max: 5, step: 1, required: true },
    { key: `quote`, label: `Review`, type: `textarea`, required: true },
    { key: `headingFirst`, label: `Heading Start`, maxLength: 120 },
    { key: `headingAccent`, label: `Heading Accent`, maxLength: 120 },
    { key: `headingLast`, label: `Heading End`, maxLength: 120 },
    ...imageFields,
  ],
  paymentMethods: [
    ...commonFields,
    { key: `type`, label: `Method Type`, type: `select`, options: [`manual`, `card`] },
    { ...descriptionField, required: false, maxLength: 1000 },
  ],
};

const getInitialValues = (section: EditableCommerceSection, record: EditableCommerceRecord | null) => {
  const values: Record<string, string> = { name: ``, slug: ``, description: ``, status: section === `reviews` ? `draft` : `active`, price: section === `services` ? `$0+` : `0`, category_id: `health`, category_name: `Health`, shade: `rose`, visual: `serum`, label: ``, duration: ``, image: ``, imageAlt: ``, service: ``, rating: `5`, type: `manual`, headingFirst: ``, headingAccent: ``, headingLast: `` };
  if (record) Object.entries(record).forEach(([key, value]) => { if (typeof value === `string` || typeof value === `number`) values[key] = String(value); });
  if (record && `category_name` in record) values.visual = record.visual ?? ``;
  if (record && `heading` in record) {
    values.headingFirst = record.heading.first;
    values.headingAccent = record.heading.accent;
    values.headingLast = record.heading.last;
  }
  return values;
};

export const useCommerceEditor = (section: EditableCommerceSection, record: EditableCommerceRecord | null, onSave: (mutation: CommerceMutation) => Promise<boolean>) => {
  const [values, setValues] = useState(() => getInitialValues(section, record));
  const setField = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value, ...(section === `paymentMethods` && key === `type` && value === `card` ? { status: `disabled` } : {}) }));
  const submit = async () => {
    const id = record?.id;
    const { name, slug, status, description, image, imageAlt } = values;
    switch (section) {
      case `products`: return onSave({ id, section, input: { name, slug, description, image, imageAlt, price: Number(values.price), label: values.label, shade: values.shade, visual: values.visual ? values.visual as `serum` | `apparel` | `candle` | `tool` : undefined, status: status as `active` | `archived`, category_id: values.category_id, category_name: values.category_name } });
      case `services`: return onSave({ id, section, input: { name, slug, description, image, imageAlt, price: values.price, duration: values.duration, status: status as `active` | `archived`, legacy_id: record && `legacy_id` in record ? record.legacy_id : slug, overview: record && `overview` in record ? record.overview : [], faqs: record && `faqs` in record ? record.faqs : [], highlights: record && `highlights` in record ? record.highlights : [], preparation: record && `preparation` in record ? record.preparation : [], relatedBlogSlugs: record && `relatedBlogSlugs` in record ? record.relatedBlogSlugs : [] } });
      case `reviews`: return onSave({ id, section, input: { name, image, imageAlt, quote: values.quote, service: values.service, rating: Number(values.rating), status: status as `published` | `draft` | `archived`, heading: { first: values.headingFirst, accent: values.headingAccent, last: values.headingLast } } });
      case `paymentMethods`: return onSave({ id, section, input: { name, description, type: values.type as `manual` | `card`, status: values.type === `card` ? `disabled` : status as `active` | `disabled` } });
    }
  };
  return { values, setField, submit };
};
