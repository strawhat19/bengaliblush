import './owner-submission-card.scss';
import { CalendarDays, MessageCircle } from 'lucide-react';
import StatusCell, { getStatusLabel } from '../status-cell/status-cell';
import { submissionStatuses, type ContactSubmission, type AppointmentSubmission, type SubmissionStatus } from '@/shared/models/submissions/Submission';

type OwnerSubmissionCardProps = {
  savingId: string;
  kind: `contact` | `appointment`;
  submission: ContactSubmission | AppointmentSubmission;
  onStatus: (kind: `contact` | `appointment`, id: string, status: SubmissionStatus) => Promise<void>;
};

const OwnerSubmissionCard = ({ kind, savingId, submission, onStatus }: OwnerSubmissionCardProps) => {
  const appointment = `service` in submission ? submission : null;
  const contact = `contact` in submission ? submission : null;
  const idPrefix = `bb-owner-${kind}-${submission.id}`;
  const statuses = submissionStatuses[kind];
  const Icon = appointment ? CalendarDays : MessageCircle;

  return (
    <article id={idPrefix} className={`bb-owner-submission`}>
      <div id={`${idPrefix}-heading`} className={`bb-owner-submission-heading`}>
        <Icon size={20} aria-hidden={`true`} />
        <h3 id={`${idPrefix}-title`} className={`bb-owner-submission-title`}>{appointment ? `${appointment.name} · ${appointment.service}` : contact?.contact}</h3>
        <span id={`${idPrefix}-number`} className={`bb-owner-submission-number`}>#{submission.number}</span>
      </div>
      {appointment && (
        <dl id={`${idPrefix}-details`} className={`bb-owner-submission-details`}>
          {[
            { id: `date`, label: `Date`, value: appointment.date },
            { id: `time`, label: `Time`, value: appointment.time },
            { id: `email`, label: `Email`, value: appointment.email },
          ].map(({ id, label, value }) => (
            <div key={id} id={`${idPrefix}-${id}`} className={`bb-owner-submission-detail`}>
              <dt id={`${idPrefix}-${id}-label`} className={`bb-owner-submission-label`}>{label}</dt>
              <dd id={`${idPrefix}-${id}-value`} className={`bb-owner-submission-value`}>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {(contact?.message || appointment?.notes) && <p id={`${idPrefix}-message`} className={`bb-owner-submission-message`}>{contact?.message || appointment?.notes}</p>}
      <p id={`${idPrefix}-received`} className={`bb-owner-submission-received`}>Received {new Date(submission.created_at).toLocaleString()}</p>
      <div id={`${idPrefix}-actions`} className={`actionsCell`}>
        <StatusCell id={idPrefix} status={submission.status} />
        <label id={`${idPrefix}-status-label`} className={`bb-owner-status-label`} htmlFor={`${idPrefix}-status-select`}>{savingId === submission.id ? `Saving Status` : `Update Status`}</label>
        <select
          value={submission.status}
          disabled={Boolean(savingId)}
          id={`${idPrefix}-status-select`}
          className={`bb-owner-status-select`}
          onChange={(event) => { void onStatus(kind, submission.id, event.currentTarget.value as SubmissionStatus); }}
        >
          {statuses.map((status) => <option key={status} value={status} id={`${idPrefix}-status-option-${status}`}>{getStatusLabel(status)}</option>)}
        </select>
      </div>
    </article>
  );
};

export default OwnerSubmissionCard;
