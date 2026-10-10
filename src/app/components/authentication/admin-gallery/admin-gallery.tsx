'use client';

import './admin-gallery.scss';
import '../profile-page/profile-page.scss';
import '../owner-dashboard/owner-dashboard.scss';
import { Images } from 'lucide-react';
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
          <header id={`bb-admin-gallery-heading`} className={`bb-admin-gallery-heading`}>
            <div id={`bb-admin-gallery-heading-copy`} className={`bb-admin-gallery-heading-copy`}>
              <span id={`bb-admin-gallery-eyebrow`} className={`bb-eyebrow`}>Admin · Bengali Blush</span>
              <h1 id={`bb-admin-gallery-title`} className={`bb-admin-gallery-title`}>Gallery<span id={`bb-admin-gallery-title-mark`} className={`bb-admin-gallery-title-mark`} aria-hidden={`true`}>.</span></h1>
              <p id={`bb-admin-gallery-description`} className={`bb-admin-gallery-description`}>A little world of beauty, rituals, and the stories we share.</p>
            </div>
            <div id={`bb-admin-gallery-edition`} className={`bb-admin-gallery-edition`} aria-hidden={`true`}>
              <Images size={21} strokeWidth={1.2} />
              <span id={`bb-admin-gallery-edition-label`} className={`bb-admin-gallery-edition-label`}>The Visual Journal</span>
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
