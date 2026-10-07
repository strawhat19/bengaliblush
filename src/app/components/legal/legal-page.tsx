import Link from 'next/link';
import { siteContact } from '@/shared/config/site';
import { siteRoutes } from '@/shared/navigation/routes';
import { legalContent, type LegalPageKind } from './legal-content';
import { Mail, FileText, ShieldCheck, ArrowUpRight } from 'lucide-react';

const LegalPage = ({ kind }: { kind: LegalPageKind }) => {
  const content = legalContent[kind];
  const Icon = kind === `privacy` ? ShieldCheck : FileText;
  const relatedRoute = kind === `privacy` ? siteRoutes.terms : siteRoutes.privacy;

  return (
    <div id={`bb-${kind}-page`} className={`bb-legal-page`}>
      <section
        id={`top`}
        className={`bb-section bb-legal-intro`}
        aria-labelledby={`bb-${kind}-title`}
      >
        <div id={`bb-${kind}-intro-layout`} className={`bb-container`}>
          <div id={`bb-${kind}-heading`} className={`bb-legal-heading`} data-reveal>
            <div id={`bb-${kind}-marker`} className={`bb-section-marker`}>
              <span id={`bb-${kind}-marker-icon`} className={`bb-section-marker-icon`} aria-hidden={`true`}>
                <Icon size={14} strokeWidth={1.7} />
              </span>
              <span id={`bb-${kind}-marker-name`} className={`bb-section-marker-name`}>Bengali Blush</span>
              <span id={`bb-${kind}-marker-line`} className={`bb-section-marker-line`} aria-hidden={`true`} />
              <span id={`bb-${kind}-marker-index`} className={`bb-section-marker-index`} aria-hidden={`true`}>01</span>
            </div>
            <span id={`bb-${kind}-eyebrow`} className={`bb-eyebrow`}>{content.eyebrow}</span>
            <h1 id={`bb-${kind}-title`} className={`bb-legal-title`}>
              {content.title}<br /><em>{content.accent}</em>
            </h1>
            <p id={`bb-${kind}-introduction`} className={`bb-legal-introduction`}>{content.introduction}</p>
            <p id={`bb-${kind}-updated`} className={`bb-legal-updated`}>
              Last updated <time id={`bb-${kind}-updated-date`} className={`bb-legal-updated-date`} dateTime={`2026-10-07`}>October 7, 2026</time>
            </p>
          </div>
        </div>
      </section>
      <section
        id={`bb-${kind}-details`}
        className={`bb-section bb-legal-details`}
        aria-label={`${content.title} ${content.accent} Details`}
      >
        <div id={`bb-${kind}-details-layout`} className={`bb-container bb-legal-layout`}>
          <div id={`bb-${kind}-sections`} className={`bb-legal-sections`}>
            {content.sections.map(({ id, title, paragraphs }, index) => (
              <article
                key={id}
                data-reveal
                id={`bb-${kind}-section-${id}`}
                className={`bb-legal-section`}
                aria-labelledby={`bb-${kind}-section-${id}-title`}
              >
                <span id={`bb-${kind}-section-${id}-number`} className={`bb-legal-section-number`} aria-hidden={`true`}>
                  {String(index + 1).padStart(2, `0`)}
                </span>
                <div id={`bb-${kind}-section-${id}-copy`} className={`bb-legal-section-copy`}>
                  <h2 id={`bb-${kind}-section-${id}-title`} className={`bb-legal-section-title`}>{title}</h2>
                  {paragraphs.map((paragraph, paragraphIndex) => (
                    <p
                      key={paragraphIndex}
                      className={`bb-legal-paragraph`}
                      id={`bb-${kind}-section-${id}-paragraph-${paragraphIndex}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <aside id={`bb-${kind}-contact`} className={`bb-legal-contact`} aria-labelledby={`bb-${kind}-contact-title`} data-reveal>
            <Mail size={22} strokeWidth={1.4} aria-hidden={`true`} />
            <h2 id={`bb-${kind}-contact-title`} className={`bb-legal-contact-title`}>A question?</h2>
            <p id={`bb-${kind}-contact-copy`} className={`bb-legal-contact-copy`}>Get in touch with Bengali Blush for more information.</p>
            <a id={`bb-${kind}-email-link`} className={`bb-legal-email-link`} href={`mailto:${siteContact.email}`}>
              <Mail size={14} aria-hidden={`true`} />{siteContact.email}
            </a>
            <div id={`bb-${kind}-links`} className={`bb-legal-links`}>
              <Link id={`bb-${kind}-contact-link`} className={`bb-legal-page-link`} href={siteRoutes.contact.href}>
                Contact <ArrowUpRight size={15} aria-hidden={`true`} />
              </Link>
              <Link id={`bb-${kind}-related-link`} className={`bb-legal-page-link`} href={relatedRoute.href}>
                {relatedRoute.label} <ArrowUpRight size={15} aria-hidden={`true`} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default LegalPage;
