import './status-cell.scss';

export const getStatusLabel = (status: string) => status === `published` ? `Active` : `${status?.[0]?.toUpperCase() ?? ``}${status.slice(1)}`;
export const getVisibilityStatus = (status: string): `active` | `inactive` => [`active`, `published`].includes(status) ? `active` : `inactive`;

type StatusCellProps = { id: string; status: string; label?: string; disabled?: boolean; onToggle?: () => void };

const StatusCell = ({ id, status, label, onToggle, disabled = false }: StatusCellProps) => {
  const color = [`declined`, `archived`, `cancelled`].includes(status) ? `red` : [`owner`, `active`, `published`, `scheduled`, `confirmed`, `completed`, `fulfilled`].includes(status) ? `green` : `gray`;
  const content = <><span id={`${id}-status-dot-wrap`} className={`statusDotWrap`} aria-hidden={`true`}><span id={`${id}-status-dot`} className={`statusDot`} /></span><span id={`${id}-status-text`} className={`statusText`}>{getStatusLabel(status)}</span></>;
  const actionLabel = `${status === `active` ? `Deactivate` : `Activate`} ${label ?? `Record`}`;

  return onToggle
    ? <button type={`button`} disabled={disabled} title={actionLabel} onClick={onToggle} aria-label={actionLabel} id={`${id}-status`} className={`rowStatus is-${color} is-editable`}>{content}</button>
    : <span id={`${id}-status`} className={`rowStatus is-${color}`}>{content}</span>;
};

export default StatusCell;
