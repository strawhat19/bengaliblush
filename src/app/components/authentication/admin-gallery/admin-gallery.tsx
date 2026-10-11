'use client';

import { Images } from 'lucide-react';
import '../profile-page/profile-page.scss';
import '../owner-dashboard/owner-dashboard.scss';
import { useAdminGallery } from './use-admin-gallery';
import AccountAccess from '../account-access/account-access';
import GalleryGrid from '../../gallery/gallery-grid/gallery-grid';
import type { GalleryImage } from '@/shared/models/gallery/Gallery';
import AccountNavigation from '../account-navigation/account-navigation';

const AdminGalleryContent = ({ images: siteImages }: { images: readonly GalleryImage[] }) => {
  const { images, loading, error } = useAdminGallery(siteImages);
  return (
    <section id={`bb-admin-gallery`} className={`bb-section bb-owner-dashboard bb-admin-gallery`} aria-labelledby={`bb-admin-gallery-title`}>
      <div id={`bb-admin-gallery-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`bb-admin-gallery-content`} className={`bb-owner-dashboard-content bb-admin-gallery-content`}>
          <header id={`bb-admin-gallery-heading`} className={`bb-owner-dashboard-heading is-record-page bb-admin-gallery-heading`}>
            <div id={`bb-admin-gallery-heading-copy`} className={`bb-owner-dashboard-heading-copy bb-admin-gallery-heading-copy`}>
              <span id={`bb-admin-gallery-eyebrow`} className={`bb-eyebrow`}><span id={`bb-admin-gallery-eyebrow-label`} className={`bb-owner-dashboard-eyebrow-label`}>Admin <span aria-hidden={`true`} id={`bb-admin-gallery-eyebrow-separator`} className={`bb-owner-dashboard-eyebrow-separator`}>·</span> Bengali Blush</span></span>
              <h1 id={`bb-admin-gallery-title`} className={`bb-owner-dashboard-title has-table-icon bb-admin-gallery-title`}><Images size={28} aria-hidden={`true`} id={`bb-admin-gallery-title-icon`} className={`bb-owner-dashboard-title-icon`} />Gallery</h1>
            </div>
          </header>
          <GalleryGrid images={images} loading={loading} error={error} />
        </div>
      </div>
    </section>
  );
};

const AdminGallery = ({ images }: { images: readonly GalleryImage[] }) => <AccountAccess adminOnly><AdminGalleryContent images={images} /></AccountAccess>;

export default AdminGallery;
