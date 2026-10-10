'use client';

import Image from 'next/image';
import './gallery-lightbox.scss';
import { X, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGalleryLightbox, type GalleryLightboxProps } from './use-gallery-lightbox';

const GalleryLightbox = (props: GalleryLightboxProps) => {
  const { images } = props;
  const { index, closing, playing, dismiss, expanded, nextImage, dialogRef, beginSwipe, finishSwipe, cancelSwipe, selectImage, moveImage, currentImage, canNavigate, reducedMotion, markImageLoaded, handleKeyDown, togglePlaying, backdropPressRef, activeThumbnailRef, thumbnailStripRef } = useGalleryLightbox(props);
  const id = `bb-gallery-lightbox`;
  const imageDescription = currentImage?.alt !== currentImage?.title ? currentImage?.alt : ``;
  const imageSizes = `(max-width: 600px) calc(100vw - 114px), (max-width: 900px) calc(100vw - 202px), (max-width: 1436px) calc(100vw - 490px), 946px`;

  return (
    <dialog
      id={id}
      ref={dialogRef}
      aria-modal={`true`}
      onKeyDown={handleKeyDown}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-caption-copy`}
      className={`bb-gallery-lightbox${expanded ? ` is-open` : ``}`}
      onCancel={(event) => { event.preventDefault(); dismiss(); }}
      onPointerDown={(event) => { backdropPressRef.current = event.target === event.currentTarget; }}
      onClick={(event) => { if (backdropPressRef.current && event.target === event.currentTarget) dismiss(); }}
    >
      <div id={`${id}-panel`} className={`bb-gallery-lightbox-panel`} inert={closing}>
        <div id={`${id}-toolbar`} className={`bb-gallery-lightbox-toolbar`}>
          <div id={`${id}-brand`} className={`bb-gallery-lightbox-brand`}>
            <span id={`${id}-signature`} className={`bb-gallery-lightbox-signature`}>Bengali Blush</span>
            <h2 id={`${id}-title`} className={`bb-gallery-lightbox-title`}>Gallery</h2>
          </div>
          <div id={`${id}-controls`} className={`bb-gallery-lightbox-controls`}>
            {canNavigate && !reducedMotion && <button
              type={`button`}
              id={`${id}-play`}
              aria-pressed={playing}
              onClick={togglePlaying}
              className={`bb-gallery-lightbox-play`}
              aria-label={`${playing ? `Pause` : `Play`} Slideshow`}
            >
              {playing ? <Pause size={14} aria-hidden={`true`} /> : <Play size={14} aria-hidden={`true`} />}
              <span className={`bb-gallery-lightbox-play-label`}>{playing ? `Pause` : `Play`}</span>
            </button>}
            <button type={`button`} onClick={dismiss} id={`${id}-close`} aria-label={`Close Gallery`} className={`bb-gallery-lightbox-close`}>
              <X size={20} aria-hidden={`true`} />
            </button>
          </div>
        </div>
        <div id={`${id}-stage`} className={`bb-gallery-lightbox-stage`}>
          <div
            onPointerDown={beginSwipe}
            onPointerUp={finishSwipe}
            onPointerCancel={cancelSwipe}
            id={`${id}-swipe-area`}
            className={`bb-gallery-lightbox-swipe-area`}
          >
            {currentImage && <div key={currentImage.id} id={`${id}-frame-${currentImage.id}`} className={`bb-gallery-lightbox-frame`}>
              <Image
                fill
                loading={`eager`}
                sizes={imageSizes}
                src={currentImage.src}
                alt={currentImage.alt}
                id={`${id}-image-${currentImage.id}`}
                className={`bb-gallery-lightbox-image`}
                onLoad={() => markImageLoaded(currentImage.id)}
                unoptimized={/^https?:\/\//.test(currentImage.src)}
              />
            </div>}
            {nextImage && <div aria-hidden={`true`} id={`${id}-preload-${nextImage.id}`} className={`bb-gallery-lightbox-preload`}>
              <Image
                fill
                alt={``}
                loading={`eager`}
                sizes={imageSizes}
                src={nextImage.src}
                fetchPriority={`low`}
                id={`${id}-preload-image-${nextImage.id}`}
                className={`bb-gallery-lightbox-preload-image`}
                unoptimized={/^https?:\/\//.test(nextImage.src)}
              />
            </div>}
          </div>
          {canNavigate && <>
            <button type={`button`} id={`${id}-previous`} onClick={() => moveImage(-1)} aria-label={`Previous Image`} className={`bb-gallery-lightbox-arrow is-previous`}>
              <ChevronLeft size={24} aria-hidden={`true`} />
            </button>
            <button type={`button`} id={`${id}-next`} onClick={() => moveImage(1)} aria-label={`Next Image`} className={`bb-gallery-lightbox-arrow is-next`}>
              <ChevronRight size={24} aria-hidden={`true`} />
            </button>
          </>}
        </div>
        <aside id={`${id}-caption`} aria-labelledby={`${id}-name`} className={`bb-gallery-lightbox-caption`}>
          <div id={`${id}-caption-copy`} className={`bb-gallery-lightbox-caption-copy`} aria-live={playing ? `off` : `polite`} aria-atomic={`true`}>
            {currentImage && <span id={`${id}-category-${currentImage.id}`} className={`bb-gallery-lightbox-category`}>{currentImage.category}</span>}
            <h3 id={`${id}-name`} className={`bb-gallery-lightbox-name`}>{currentImage?.title ?? `A Moment To Remember`}</h3>
            {imageDescription && <p id={`${id}-description-${currentImage?.id}`} className={`bb-gallery-lightbox-description`}>{imageDescription}</p>}
          </div>
          <p id={`${id}-counter`} className={`bb-gallery-lightbox-counter`} aria-label={`Image ${images.length ? index + 1 : 0} Of ${images.length}`}>
            <span className={`bb-gallery-lightbox-counter-current`}>{String(images.length ? index + 1 : 0).padStart(2, `0`)}</span>
            <span className={`bb-gallery-lightbox-counter-divider`} aria-hidden={`true`}>/</span>
            <span className={`bb-gallery-lightbox-counter-total`}>{String(images.length).padStart(2, `0`)}</span>
          </p>
        </aside>
        <div role={`group`} ref={thumbnailStripRef} id={`${id}-thumbnails`} aria-label={`Gallery Images`} className={`bb-gallery-lightbox-thumbnails`}>
          {images.map((image, thumbnailIndex) => <button
            type={`button`}
            key={image.id}
            onClick={() => selectImage(image.id)}
            id={`${id}-thumbnail-${image.id}`}
            aria-current={image.id === currentImage?.id ? `true` : undefined}
            ref={image.id === currentImage?.id ? activeThumbnailRef : undefined}
            aria-label={`View Image ${thumbnailIndex + 1}: ${image.title}`}
            className={`bb-gallery-lightbox-thumbnail${image.id === currentImage?.id ? ` is-active` : ``}`}
          >
            <Image
              fill
              alt={``}
              sizes={`80px`}
              src={image.src}
              loading={`lazy`}
              id={`${id}-thumbnail-image-${image.id}`}
              className={`bb-gallery-lightbox-thumbnail-image`}
              unoptimized={/^https?:\/\//.test(image.src)}
            />
          </button>)}
        </div>
      </div>
    </dialog>
  );
};

export default GalleryLightbox;
