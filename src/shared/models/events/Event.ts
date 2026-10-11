export const eventStatuses = [`draft`, `scheduled`, `cancelled`] as const;
export type EventStatus = typeof eventStatuses[number];

export type EventInput = {
  date: string;
  time: string;
  title: string;
  location: string;
  status: EventStatus;
  description: string;
};

export type EventRecord = EventInput & {
  id: string;
  number: number;
  created_at: string;
  updated_at: string;
};
