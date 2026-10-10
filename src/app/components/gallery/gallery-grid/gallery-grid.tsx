'use client';

import './gallery-grid.scss';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useGalleryGrid } from './use-gallery-grid';
import { Play, LoaderCircle, ArrowUpRight } from 'lucide-react';
import type { GalleryImage } from '@/shared/models/gallery/Gallery';

const GalleryLightbox = dynamic(() => import('../gallery-lightbox/gallery-lightbox'), {
  ssr: false,
  loading: () => <div id={`bb-gallery-opening`} className={`bb-gallery-opening`} role={`status`}><LoaderCircle size={18} aria-hidden={`true`} />Opening Gallery</div>,
});

type GalleryGridProps = {
  error?: string;
  loading?: boolean;
  images: GalleryImage[];
};

const GalleryGrid = ({ images, loading = false, error = `` }: GalleryGridProps) => {
  const { category, categories, openImage, selectedId, visibleImages, setOpenedId, selectCategory, preloadLightbox } = useGalleryGrid(images);
  return (
    <div id={`bb-gallery`} className={`bb-gallery`}>
      <div id={`bb-gallery-toolbar`} className={`bb-gallery-toolbar`}>
        <div id={`bb-gallery-filters`} className={`bb-gallery-filters`} role={`group`} aria-label={`Filter Gallery`}>
          {([`All`, ...categories] as const).map((filter) => <button
            key={filter}
            type={`button`}
            id={`bb-gallery-filter-${filter.toLowerCase()}`}
            aria-pressed={category === filter}
            className={`bb-gallery-filter${category === filter ? ` is-active` : ``}`}
            onClick={() => selectCategory(filter)}
          >{filter}</button>)}
        </div>
        <div id={`bb-gallery-toolbar-actions`} className={`bb-gallery-toolbar-actions`}>
          <span id={`bb-gallery-count`} className={`bb-gallery-count`} role={`status`}>{visibleImages.length} Photo(s)</span>
          <button
            type={`button`}
            disabled={!visibleImages.length}
            onFocus={preloadLightbox}
            aria-haspopup={`dialog`}
            id={`bb-gallery-view-slideshow`}
            className={`bb-gallery-view-slideshow`}
            onPointerEnter={preloadLightbox}
            onClick={(event) => openImage(event, visibleImages?.[0]?.id)}
          ><Play size={13} aria-hidden={`true`} />View Slideshow</button>
        </div>
      </div>
      {error && <p id={`bb-gallery-notice`} className={`bb-gallery-notice`} role={`status`}>{error}</p>}
      <div id={`bb-gallery-grid`} className={`bb-gallery-grid`}>
        {visibleImages.map((image, index) => <button
          type={`button`}
          key={image.id}
          onFocus={preloadLightbox}
          id={`bb-gallery-image-${image.id}`}
          onClick={(event) => openImage(event, image.id)}
          onPointerEnter={preloadLightbox}
          aria-label={`Open ${image.title} In Gallery`}
          aria-haspopup={`dialog`}
          className={`bb-gallery-tile${index === 0 ? ` is-featured` : ``}${image.category === `Reviews` ? ` is-portrait` : ``}`}
        >
          <Image
            fill
            src={image.src}
            alt={image.alt}
            id={`bb-gallery-photo-${image.id}`}
            className={`bb-gallery-photo`}
            unoptimized={/^https?:\/\//.test(image.src)}
            loading={index === 0 ? `eager` : `lazy`}
            sizes={index === 0 ? `(max-width: 650px) 100vw, (max-width: 1100px) 65vw, 50vw` : `(max-width: 650px) 50vw, (max-width: 1000px) 50vw, (max-width: 1400px) 33vw, 25vw`}
          />
          <span id={`bb-gallery-tile-number-${image.id}`} className={`bb-gallery-tile-number`} aria-hidden={`true`}>{String(index + 1).padStart(2, `0`)}</span>
          <span id={`bb-gallery-tile-caption-${image.id}`} className={`bb-gallery-tile-caption`}>
            <span id={`bb-gallery-tile-category-${image.id}`} className={`bb-gallery-tile-category`}>{image.category}</span>
            <span id={`bb-gallery-tile-title-${image.id}`} className={`bb-gallery-tile-title`}>{image.title}</span>
          </span>
          <span id={`bb-gallery-tile-open-${image.id}`} className={`bb-gallery-tile-open`} aria-hidden={`true`}><ArrowUpRight size={18} strokeWidth={1.5} /></span>
        </button>)}
      </div>
      {!visibleImages.length && <p id={`bb-gallery-empty`} className={`bb-gallery-empty`}>Photos will appear here soon.</p>}
      {loading && <p id={`bb-gallery-loading`} className={`bb-gallery-loading`} role={`status`}><LoaderCircle size={13} aria-hidden={`true`} />Loading More Photos</p>}
      {selectedId && <GalleryLightbox images={visibleImages} initialId={selectedId} onClose={() => setOpenedId(null)} />}
    </div>
  );
};

export default GalleryGrid;
