import { Database } from 'lucide-react';
import './owner-dashboard-sidebar.scss';
import { siteConfig, siteUrl } from '@/shared/config/site';
import { formatRecordDate } from '../owner-dashboard/dashboard-data';

const OwnerDashboardSidebar = ({ loadedAt }: { loadedAt: string }) => {
  return (
    <aside id={`bb-owner-dashboard-sidebar`} className={`bb-profile-sidebar bb-owner-dashboard-sidebar`} aria-label={`Studio Details`}>
      <section id={`bb-owner-app-info`} className={`bb-owner-app-info`} aria-labelledby={`bb-owner-app-info-title`}>
        <h2 id={`bb-owner-app-info-title`} className={`bb-owner-sidebar-title bb-owner-app-info-title`}><Database size={17} aria-hidden={`true`} />Application</h2>
        <dl id={`bb-owner-app-info-record`} className={`bb-owner-app-info-record`}>
          {[
            { id: `name`, label: `App`, value: siteConfig.name },
            { id: `website`, label: `Website`, value: siteUrl },
            { id: `database`, label: `Database`, value: `Cloud Firestore · Connected` },
            { id: `loaded`, label: `Last Refreshed`, value: formatRecordDate(loadedAt, true) },
          ].map(({ id, label, value }) => (
            <div key={id} id={`bb-owner-app-info-${id}`} className={`bb-owner-app-info-field`}>
              <dt id={`bb-owner-app-info-${id}-label`} className={`bb-owner-app-info-label`}>{label}</dt>
              <dd id={`bb-owner-app-info-${id}-value`} className={`bb-owner-app-info-value`}>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </aside>
  );
};

export default OwnerDashboardSidebar;
