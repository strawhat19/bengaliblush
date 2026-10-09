import './owner-submission-card.scss';
import { ChevronDown, UserRound } from 'lucide-react';
import { formatRecordDate } from '../owner-dashboard/dashboard-data';
import StatusCell, { getStatusLabel } from '../status-cell/status-cell';
import { submissionStatuses, type ContactSubmission, type AppointmentSubmission, type SubmissionStatus } from '@/shared/models/submissions/Submission';

type OwnerSubmissionCardProps = {
  savingId: string;
  disabled?: boolean;
  accountName?: string;
  kind: `contact` | `appointment`;
  submission: ContactSubmission | AppointmentSubmission;
  onStatus: (kind: `contact` | `appointment`, id: string, status: SubmissionStatus) => Promise<void>;
};

const OwnerSubmissionCard = ({ kind, disabled, savingId, submission, accountName, onStatus }: OwnerSubmissionCardProps) => {
  const appointment = `service` in submission ? submission : null;
  const contact = `contact` in submission ? submission : null;
  const idPrefix = `bb-owner-${kind}-${submission.id}`;
  const statuses = submissionStatuses[kind];
  const message = contact?.message || appointment?.notes;

  return (
    <tr id={idPrefix} className={`bb-owner-submission-row`}>
      <td id={`${idPrefix}-number`} className={`bb-owner-submission-number`}>{submission.number}</td>
      <td id={`${idPrefix}-request`} className={`bb-owner-submission-request`}>
        <strong id={`${idPrefix}-title`} className={`bb-owner-submission-title`}>{appointment?.name || contact?.contact}</strong>
        {appointment && <><span id={`${idPrefix}-service`} className={`bb-owner-submission-service`}>{appointment.service}</span><span id={`${idPrefix}-email`} className={`bb-owner-submission-email`}>{appointment.email}</span></>}
        {message && (
          <details id={`${idPrefix}-details`} className={`bb-owner-submission-details`}>
            <summary id={`${idPrefix}-details-summary`} className={`bb-owner-submission-summary`}>{appointment ? `Notes` : `Message`}<ChevronDown size={12} aria-hidden={`true`} /></summary>
            <p id={`${idPrefix}-message`} className={`bb-owner-submission-message`}>{message}</p>
          </details>
        )}
      </td>
      <td id={`${idPrefix}-submitter`} className={`bb-owner-submission-submitter`}>
        <span id={`${idPrefix}-attribution`} className={`bb-owner-submission-attribution`}><UserRound size={13} aria-hidden={`true`} />{submission.user_id ? `Account` : `Guest`}</span>
        {submission.user_id && <span id={`${idPrefix}-account-name`} className={`bb-owner-submission-account-name`}>{accountName || `Registered Account`}</span>}
      </td>
      {appointment && <td id={`${idPrefix}-preferred-time`} className={`bb-owner-submission-preferred-time`}><time dateTime={appointment.date} id={`${idPrefix}-date`} className={`bb-owner-submission-date`}>{appointment.date}</time><span id={`${idPrefix}-time`} className={`bb-owner-submission-time`}>{appointment.time}</span></td>}
      <td id={`${idPrefix}-received`} className={`bb-owner-submission-received`}><time dateTime={submission.created_at} id={`${idPrefix}-received-date`} className={`bb-owner-submission-received-date`} title={formatRecordDate(submission.created_at, true)}>{formatRecordDate(submission.created_at)}</time></td>
      <td id={`${idPrefix}-status-cell`} className={`bb-owner-submission-status-cell`}>
        <div id={`${idPrefix}-actions`} className={`actionsCell`}>
          <StatusCell id={idPrefix} status={submission.status} />
          <label id={`${idPrefix}-status-label`} className={`bb-owner-status-label`} htmlFor={`${idPrefix}-status-select`}>{savingId === submission.id ? `Saving Status` : `Update Status`}</label>
          <select
            value={submission.status}
            disabled={disabled || Boolean(savingId)}
            id={`${idPrefix}-status-select`}
            className={`bb-owner-status-select`}
            aria-describedby={`${idPrefix}-title`}
            onChange={(event) => { void onStatus(kind, submission.id, event.currentTarget.value as SubmissionStatus); }}
          >
            {statuses.map((status) => <option key={status} value={status} id={`${idPrefix}-status-option-${status}`}>{getStatusLabel(status)}</option>)}
          </select>
        </div>
      </td>
    </tr>
  );
};

export default OwnerSubmissionCard;
