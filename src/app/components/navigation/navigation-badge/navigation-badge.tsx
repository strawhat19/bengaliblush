import './navigation-badge.scss';

type NavigationBadgeProps = { id: string; count?: number; };

const NavigationBadge = ({ id, count }: NavigationBadgeProps) => {
  if (!count || count <= 0 || !Number.isFinite(count)) return null;
  return <span id={id} aria-hidden={`true`} className={`bb-navigation-badge`}>{count.toLocaleString(`en-US`)}</span>;
};

export default NavigationBadge;
