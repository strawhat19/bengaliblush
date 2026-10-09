import Image from 'next/image';
import { siteRoutes } from '@/shared/navigation/routes';
import { services } from '@/shared/services/service-content';
import { ArrowUpRight, MapPin, WandSparkles } from 'lucide-react';
import { getServiceHref } from '@/shared/services/service-utils';
import Link from '@/app/components/navigation/page-link/page-link';
import ServiceCard from '@/app/components/services/service-card/service-card';
import OrnamentalArch from '@/app/components/effects/ornamental-arch/ornamental-arch';

const ServicesIndex = () => {
  const featuredService = services.find((service) => service.id === `signature-set`);

  return (
    <div id={`bb-services-page`} className={`bb-services-index`}>
      <section id={`top`} className={`bb-section bb-services-index-hero`} aria-labelledby={`bb-services-index-heading`}>
        <div id={`bb-services-index-hero-grid`} className={`bb-container bb-services-index-hero-grid`}>
          <div id={`bb-services-index-hero-copy`} className={`bb-services-index-hero-copy`}>
            <div id={`bb-services-index-marker`} className={`bb-section-marker`}>
              <span id={`bb-services-index-marker-icon`} className={`bb-section-marker-icon`}>
                <WandSparkles size={14} aria-hidden={`true`} />
              </span>
              <span id={`bb-services-index-marker-name`} className={`bb-section-marker-name`}>The Beauty Menu</span>
              <span id={`bb-services-index-marker-line`} className={`bb-section-marker-line`} aria-hidden={`true`} />
              <span id={`bb-services-index-marker-index`} className={`bb-section-marker-index`} aria-hidden={`true`}>01</span>
            </div>
            <span id={`bb-services-index-eyebrow`} className={`bb-eyebrow`}>A Look That Feels Like You</span>
            <h1 id={`bb-services-index-heading`} className={`bb-services-index-heading`}>
              Services<br /><em id={`bb-services-index-heading-accent`} className={`bb-services-index-heading-accent`}>your way.</em>
            </h1>
            <p id={`bb-services-index-introduction`} className={`bb-services-index-introduction`}>
              Discover expressive lashes, polished hair, and party makeup at Bengali Blush. Explore each service, find a little inspiration, and plan your next beauty moment with us.
            </p>
            <span id={`bb-services-index-location`} className={`bb-services-index-location`}>
              <MapPin size={15} aria-hidden={`true`} /> Atlanta · By Appointment
            </span>
          </div>
          {featuredService ? (
            <Link
              className={`bb-services-index-featured`}
              id={`bb-services-index-featured-${featuredService.id}`}
              href={getServiceHref(featuredService.slug)}
            >
              <OrnamentalArch id={`bb-services-index-featured-ornament-${featuredService.id}`} />
              <div id={`bb-services-index-featured-clip-${featuredService.id}`} className={`bb-services-index-featured-clip`}>
                <Image
                  fill
                  priority
                  src={featuredService.image}
                  alt={featuredService.imageAlt}
                  className={`bb-services-index-featured-image`}
                  id={`bb-services-index-featured-image-${featuredService.id}`}
                  sizes={`(max-width: 850px) calc(100vw - 36px), 520px`}
                />
              </div>
              <div id={`bb-services-index-featured-copy-${featuredService.id}`} className={`bb-services-index-featured-copy`}>
                <span id={`bb-services-index-featured-label-${featuredService.id}`} className={`bb-services-index-featured-label`}>A Little Lash Inspiration</span>
                <span id={`bb-services-index-featured-title-${featuredService.id}`} className={`bb-services-index-featured-title`}>{featuredService.name}</span>
                <span id={`bb-services-index-featured-link-${featuredService.id}`} className={`bb-services-index-featured-link`}>
                  Explore Service <ArrowUpRight size={17} aria-hidden={`true`} />
                </span>
              </div>
            </Link>
          ) : null}
        </div>
      </section>
      <section id={`bb-services-index-menu`} className={`bb-services-index-menu`} aria-labelledby={`bb-services-index-menu-heading`}>
        <div id={`bb-services-index-menu-container`} className={`bb-container`}>
          <div id={`bb-services-index-menu-title-row`} className={`bb-services-index-menu-title-row`}>
            <div id={`bb-services-index-menu-copy`} className={`bb-services-index-menu-copy`}>
              <span id={`bb-services-index-menu-eyebrow`} className={`bb-eyebrow`}>Find Your Next Ritual</span>
              <h2 id={`bb-services-index-menu-heading`} className={`bb-services-index-menu-heading`}>Our Services</h2>
            </div>
            <p id={`bb-services-index-price-note`} className={`bb-services-index-price-note`}>Prices are negotiable.</p>
          </div>
          <div id={`bb-services-index-grid`} className={`bb-services-index-grid`}>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} idPrefix={`bb-services-index-card`} />
            ))}
          </div>
        </div>
      </section>
      <section id={`bb-services-index-invitation`} className={`bb-services-index-invitation`} aria-labelledby={`bb-services-index-invitation-heading`}>
        <div id={`bb-services-index-invitation-container`} className={`bb-container bb-services-index-invitation-inner`}>
          <div id={`bb-services-index-invitation-copy`} className={`bb-services-index-invitation-copy`}>
            <span id={`bb-services-index-invitation-eyebrow`} className={`bb-eyebrow`}>Let Us Help You Plan</span>
            <h2 id={`bb-services-index-invitation-heading`} className={`bb-services-index-invitation-heading`}>Have a look<br /><em id={`bb-services-index-invitation-accent`} className={`bb-services-index-invitation-accent`}>in mind?</em></h2>
            <p id={`bb-services-index-invitation-description`} className={`bb-services-index-invitation-description`}>Share your inspiration, ask about a service, or talk through the details before your appointment.</p>
          </div>
          <Link id={`bb-services-index-contact-link`} className={`bb-button bb-button-primary bb-services-index-contact-link`} href={siteRoutes.contact.href}>
            Contact Bengali Blush <ArrowUpRight size={16} aria-hidden={`true`} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesIndex;
