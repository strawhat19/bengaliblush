import { ArrowUpRight, WandSparkles } from 'lucide-react';
import { siteRoutes } from '@/shared/navigation/routes';
import { services } from '@/shared/services/service-content';
import Link from '@/app/components/navigation/page-link/page-link';
import ServiceRow from '@/app/components/services/service-row/service-row';

const LandingServices = () => (
  <section
    id={`services`}
    aria-labelledby={`bb-landing-services-heading`}
    className={`bb-section bb-services bb-landing-services`}
  >
    <div id={`bb-landing-services-container`} className={`bb-container`}>
      <div data-reveal id={`bb-landing-services-title-row`} className={`bb-section-heading bb-landing-services-title-row`}>
        <div id={`bb-landing-services-heading-copy`} className={`bb-landing-services-heading-copy`}>
          <div id={`bb-landing-services-marker`} className={`bb-section-marker`}>
            <span id={`bb-landing-services-marker-icon`} className={`bb-section-marker-icon`}>
              <WandSparkles size={14} aria-hidden={`true`} />
            </span>
            <span id={`bb-landing-services-marker-name`} className={`bb-section-marker-name`}>Services</span>
            <span id={`bb-landing-services-marker-line`} className={`bb-section-marker-line`} aria-hidden={`true`} />
            <span id={`bb-landing-services-marker-index`} className={`bb-section-marker-index`} aria-hidden={`true`}>03</span>
          </div>
          <span id={`bb-landing-services-eyebrow`} className={`bb-eyebrow`}>Choose Services</span>
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
      <div data-reveal id={`bb-landing-services-list`} className={`bb-service-list`}>
        {services.map((service) => (
          <ServiceRow key={service.id} service={service} />
        ))}
      </div>
    </div>
  </section>
);

export default LandingServices;
