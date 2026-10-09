import './status-cell.scss';

export const getStatusLabel = (status: string) => `${status?.[0]?.toUpperCase() ?? ``}${status.slice(1)}`;

const StatusCell = ({ id, status }: { id: string; status: string }) => {
  const color = status === `declined` ? `red` : [`owner`, `confirmed`, `completed`].includes(status) ? `green` : `gray`;

  return (
    <span id={`${id}-status`} className={`rowStatus is-${color}`}>
      <span id={`${id}-status-dot-wrap`} className={`statusDotWrap`} aria-hidden={`true`}><span id={`${id}-status-dot`} className={`statusDot`} /></span>
      <span id={`${id}-status-text`} className={`statusText`}>{getStatusLabel(status)}</span>
    </span>
  );
};

export default StatusCell;
