import { siteContact } from '@/shared/config/site';
import ContactInquiry from './contact-inquiry/contact-inquiry';
import { Mail, Phone, MapPin, Instagram, ArrowUpRight, MessageCircle } from 'lucide-react';

const contactDetails = [
  { id: `phone`, icon: Phone, label: `Call the studio`, value: siteContact.phone, href: siteContact.phoneHref },
  { id: `email`, icon: Mail, label: `Write to us`, value: siteContact.email, href: `mailto:${siteContact.email}` },
];

export default function ContactPage() {
  return (
    <>
      <section id={`top`} className={`bb-section bb-contact-intro`} aria-labelledby={`bb-contact-title`}>
        <div id={`bb-contact-intro-layout`} className={`bb-container bb-contact-intro-layout`}>
          <div id={`bb-contact-heading`} className={`bb-contact-heading`} data-reveal>
            <div id={`bb-contact-marker`} className={`bb-section-marker`}>
              <span id={`bb-contact-marker-icon`} className={`bb-section-marker-icon`} aria-hidden={`true`}><MessageCircle size={14} strokeWidth={1.7} /></span>
              <span id={`bb-contact-marker-name`} className={`bb-section-marker-name`}>Say Hello</span>
              <span id={`bb-contact-marker-line`} className={`bb-section-marker-line`} aria-hidden={`true`} />
              <span id={`bb-contact-marker-index`} className={`bb-section-marker-index`} aria-hidden={`true`}>01</span>
            </div>
            <span id={`bb-contact-eyebrow`} className={`bb-eyebrow`}>A little hello goes a long way</span>
            <h1 id={`bb-contact-title`} className={`bb-contact-title`}>Let’s talk<br /><em>beautiful.</em></h1>
            <p id={`bb-contact-intro-copy`} className={`bb-contact-intro-copy`}>Have a question about your next look, a special occasion, or something in the shop? There’s always room for a conversation.</p>
          </div>
          <div id={`bb-contact-details`} className={`bb-contact-details`} data-reveal>
            {contactDetails.map(({ id, icon: Icon, label, value, href }) => (
              <a key={id} href={href} id={`bb-contact-${id}-link`} className={`bb-contact-detail`}>
                <span id={`bb-contact-${id}-icon`} className={`bb-contact-detail-icon`} aria-hidden={`true`}><Icon size={20} strokeWidth={1.4} /></span>
                <span id={`bb-contact-${id}-copy`} className={`bb-contact-detail-copy`}>
                  <span id={`bb-contact-${id}-label`} className={`bb-contact-detail-label`}>{label}</span>
                  <span id={`bb-contact-${id}-value`} className={`bb-contact-detail-value`}>{value}</span>
                </span>
                <ArrowUpRight size={16} aria-hidden={`true`} />
              </a>
            ))}
            <address id={`bb-contact-address`} className={`bb-contact-address`}>
              <a id={`bb-contact-address-link`} className={`bb-contact-detail`} href={siteContact.mapUrl} target={`_blank`} rel={`noreferrer`}>
                <span id={`bb-contact-address-icon`} className={`bb-contact-detail-icon`} aria-hidden={`true`}><MapPin size={20} strokeWidth={1.4} /></span>
                <span id={`bb-contact-address-copy`} className={`bb-contact-detail-copy`}>
                  <span id={`bb-contact-address-label`} className={`bb-contact-detail-label`}>Find the atelier</span>
                  <span id={`bb-contact-address-value`} className={`bb-contact-detail-value`}>{siteContact.address}</span>
                  <small id={`bb-contact-visit-note`} className={`bb-contact-visit-note`}>Visits by appointment</small>
                </span>
                <ArrowUpRight size={16} aria-hidden={`true`} />
              </a>
            </address>
            <div id={`bb-contact-socials`} className={`bb-contact-socials`}>
              <span id={`bb-contact-socials-label`} className={`bb-contact-detail-label`}>A little more blush</span>
              {siteContact.socials.map(({ id, href, label, handle }) => (
                <a key={id} href={href} target={`_blank`} rel={`noreferrer`} id={`bb-contact-social-${id}`} className={`bb-contact-social-link`} aria-label={`${label}: ${handle}`}>
                  <Instagram size={16} strokeWidth={1.6} aria-hidden={`true`} />{handle}<ArrowUpRight size={14} aria-hidden={`true`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ContactInquiry />
      <section id={`bb-contact-location`} className={`bb-section bb-contact-location`} aria-labelledby={`bb-contact-location-title`}>
        <div id={`bb-contact-location-layout`} className={`bb-container bb-contact-location-layout`}>
          <div id={`bb-contact-location-copy`} className={`bb-contact-location-copy`} data-reveal>
            <span id={`bb-contact-location-eyebrow`} className={`bb-eyebrow`}>Atlanta · by appointment</span>
            <h2 id={`bb-contact-location-title`} className={`bb-contact-location-title`}>Your next<br /><em>beauty stop.</em></h2>
            <p id={`bb-contact-location-description`} className={`bb-contact-location-description`}>Let’s plan your visit to Bengali Blush. Get in touch to arrange your appointment and confirm the studio details.</p>
            <a id={`bb-contact-map-link`} className={`bb-button bb-button-outline bb-button-outline-dark`} href={siteContact.mapUrl} target={`_blank`} rel={`noreferrer`}>
              Explore the area <MapPin size={15} aria-hidden={`true`} />
            </a>
          </div>
          <div id={`bb-contact-map-frame`} className={`bb-contact-map-frame`} data-reveal>
            <iframe id={`bb-contact-map`} className={`bb-contact-map`} title={`Bengali Blush Area In Atlanta`} src={siteContact.mapEmbedUrl} loading={`lazy`} referrerPolicy={`no-referrer-when-downgrade`} />
          </div>
        </div>
      </section>
    </>
  );
}
