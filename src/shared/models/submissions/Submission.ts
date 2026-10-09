export type SubmissionStatus = `new` | `requested` | `reviewed` | `confirmed` | `declined` | `completed`;

export type Submission = {
  id: string;
  number: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  firebase_uid: string;
  status: SubmissionStatus;
};

export type ContactSubmissionInput = {
  contact: string;
  message: string;
};

export type AppointmentSubmissionInput = {
  name: string;
  date: string;
  time: string;
  email: string;
  notes: string;
  service: string;
};

export type ContactSubmission = Submission & ContactSubmissionInput;
export type AppointmentSubmission = Submission & AppointmentSubmissionInput;
export type SubmissionKind = `contact` | `appointment`;

export const submissionStatuses: Record<SubmissionKind, readonly SubmissionStatus[]> = {
  contact: [`new`, `reviewed`, `completed`],
  appointment: [`requested`, `confirmed`, `declined`, `completed`],
};
