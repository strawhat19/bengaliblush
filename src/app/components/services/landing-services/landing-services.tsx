import Link from 'next/link';
import { ArrowUpRight, WandSparkles } from 'lucide-react';
import { siteRoutes } from '@/shared/navigation/routes';
import { services } from '@/shared/services/service-content';
import ServiceCard from '@/app/components/services/service-card/service-card';

const LandingServices = () => (
  <section
    id={`services`}
    aria-labelledby={`bb-landing-services-heading`}
    className={`bb-section bb-services bb-landing-services`}
  >
    <div id={`bb-landing-services-container`} className={`bb-container`}>
      <div id={`bb-landing-services-title-row`} className={`bb-section-heading bb-landing-services-title-row`}>
        <div id={`bb-landing-services-heading-copy`} className={`bb-landing-services-heading-copy`}>
          <div id={`bb-landing-services-marker`} className={`bb-section-marker`}>
            <span id={`bb-landing-services-marker-icon`} className={`bb-section-marker-icon`}>
              <WandSparkles size={14} aria-hidden={`true`} />
            </span>
            <span id={`bb-landing-services-marker-name`} className={`bb-section-marker-name`}>Services</span>
            <span id={`bb-landing-services-marker-line`} className={`bb-section-marker-line`} aria-hidden={`true`} />
            <span id={`bb-landing-services-marker-index`} className={`bb-section-marker-index`} aria-hidden={`true`}>03</span>
          </div>
          <span id={`bb-landing-services-eyebrow`} className={`bb-eyebrow`}>Choose Your Look</span>
          <h2 id={`bb-landing-services-heading`} className={`bb-landing-services-heading`}>Services Menu</h2>
        </div>
        <div id={`bb-landing-services-heading-actions`} className={`bb-landing-services-heading-actions`}>
          <p id={`bb-landing-services-price-note`} className={`bb-landing-services-price-note`}>Prices are negotiable.</p>
          <Link
            href={siteRoutes.services.href}
            id={`bb-landing-services-view-all`}
            className={`bb-button bb-button-outline bb-button-outline-dark bb-landing-services-view-all`}
          >
            View All Services <ArrowUpRight size={16} aria-hidden={`true`} />
          </Link>
        </div>
      </div>
      <div id={`bb-landing-services-grid`} className={`bb-landing-services-grid`}>
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} idPrefix={`bb-landing-service`} />
        ))}
      </div>
    </div>
  </section>
);

export default LandingServices;
