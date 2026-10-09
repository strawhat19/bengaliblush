import Image from 'next/image';
import { siteRoutes } from '@/shared/navigation/routes';
import { getBlogArticles } from '@/shared/blog/blog-utils';
import Link from '@/app/components/navigation/page-link/page-link';
import { Heart, BookOpen, Sparkles, ArrowUpRight, WandSparkles } from 'lucide-react';
import OrnamentalArch from '@/app/components/effects/ornamental-arch/ornamental-arch';

const featuredArticle = getBlogArticles()?.[0];
const beautyDetails = [
  {
    id: `your-look`,
    icon: Heart,
    title: `Your glow, your way`,
    description: `There is no one way to be beautiful. From softly defined lashes to a luminous makeup look, the feeling should always be yours.`,
  },
  {
    id: `little-details`,
    icon: Sparkles,
    title: `A little magic in the details`,
    description: `Fluttery lashes, polished waves, and a little extra blush. Thoughtful touches bring a look together for everyday rituals and celebrations alike.`,
  },
];

const AboutPage = () => (
  <div className={`bb-about`} id={`bb-about-page`}>
    <section className={`bb-section bb-intro bb-about-hero`} id={`top`} aria-labelledby={`bb-about-heading`}>
      <div className={`bb-container bb-intro-grid`} id={`bb-about-intro-grid`}>
        <div className={`bb-intro-copy bb-about-copy`} id={`bb-about-intro-copy`} data-reveal>
          <div className={`bb-section-marker`} id={`bb-about-story-marker`}>
            <span className={`bb-section-marker-icon`} id={`bb-about-story-icon`} aria-hidden={`true`}><Heart size={14} strokeWidth={1.7} /></span>
            <span className={`bb-section-marker-name`} id={`bb-about-story-label`}>Our Story</span>
            <span className={`bb-section-marker-line`} id={`bb-about-story-line`} aria-hidden={`true`} />
            <span className={`bb-section-marker-index`} id={`bb-about-story-index`} aria-hidden={`true`}>01</span>
          </div>
          <span className={`bb-eyebrow`} id={`bb-about-eyebrow`}>California Girls</span>
          <h1 className={`bb-about-heading`} id={`bb-about-heading`}>
            Bangladesh<br />
            <em>Los Angeles</em><br />
            Atlanta
          </h1>
          <p className={`bb-about-introduction`} id={`bb-about-introduction`}>Modern glam, Bengali warmth, and the joy of being beautifully seen. Welcome to Bengali Blush, an Atlanta beauty atelier founded and led by Sadia Islam Misty.</p>
          <div className={`bb-founder-note`} id={`bb-about-founder-note`}>
            <div className={`bb-founder-signature`} id={`bb-about-founder-signature`}>
              <span className={`bb-about-signature-intro`} id={`bb-about-signature-intro`}>with love,</span>
              <strong className={`bb-about-signature-name`} id={`bb-about-signature-name`}>Sadia Islam Misty</strong>
            </div>
            <div className={`bb-founder-meta`} id={`bb-about-founder-meta`}>
              <span className={`bb-about-founder-title`} id={`bb-about-founder-title`}>Certified Lash Technician</span>
            </div>
          </div>
        </div>
        <div className={`bb-intro-art bb-about-art`} id={`bb-about-art`} data-reveal>
          <div className={`bb-intro-circle`} id={`bb-about-art-circle`} aria-hidden={`true`} />
          <div className={`bb-intro-photo`} id={`bb-about-photo`}>
            <div className={`bb-intro-photo-image`} id={`bb-about-photo-image`} role={`img`} aria-label={`Soft glam party makeup portrait`} />
            <OrnamentalArch id={`bb-about-photo-arch`} />
          </div>
          <div className={`bb-intro-stamp`} id={`bb-about-stamp`} aria-hidden={`true`}>
            <div className={`bb-about-stamp-content`} id={`bb-about-stamp-content`}>
              <strong className={`bb-about-stamp-mark`} id={`bb-about-stamp-mark`}>BB</strong>
              <span className={`bb-about-stamp-year`} id={`bb-about-stamp-year`}>since 2021</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className={`bb-section bb-about-philosophy`} id={`bb-about-philosophy`} aria-labelledby={`bb-about-philosophy-heading`}>
      <div className={`bb-container bb-about-philosophy-grid`} id={`bb-about-philosophy-grid`}>
        <div className={`bb-about-philosophy-copy`} id={`bb-about-philosophy-copy`} data-reveal>
          <span className={`bb-eyebrow`} id={`bb-about-philosophy-eyebrow`}>The Bengali Blush Feeling</span>
          <h2 className={`bb-about-section-heading`} id={`bb-about-philosophy-heading`}>Beauty<br /><em>Studio</em></h2>
          <p className={`bb-about-philosophy-introduction`} id={`bb-about-philosophy-introduction`}>Soft glam, big energy, and a look that feels like you on your very best day. Our services bring together expressive lashes, hair styling, and party makeup for your next main character moment.</p>
        </div>
        <div className={`bb-about-details`} id={`bb-about-details`}>
          {beautyDetails.map(({ id, icon: Icon, title, description }, index) => (
            <article className={`bb-about-detail`} id={`bb-about-detail-${id}`} key={id} data-reveal>
              <div className={`bb-about-detail-marker`} id={`bb-about-detail-marker-${id}`}>
                <Icon size={18} strokeWidth={1.5} aria-hidden={`true`} />
                <span className={`bb-about-detail-number`} id={`bb-about-detail-number-${id}`}>0{index + 1}</span>
              </div>
              <h3 className={`bb-about-detail-heading`} id={`bb-about-detail-heading-${id}`}>{title}</h3>
              <p className={`bb-about-detail-description`} id={`bb-about-detail-description-${id}`}>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
    {featuredArticle ? (
      <section className={`bb-section bb-about-journal`} id={`bb-about-journal`} aria-labelledby={`bb-about-journal-heading`}>
        <div className={`bb-container bb-about-journal-grid`} id={`bb-about-journal-grid`}>
          <div className={`bb-about-journal-visual`} id={`bb-about-journal-visual-${featuredArticle.slug}`} data-reveal>
            <div className={`bb-about-journal-photo`} id={`bb-about-journal-photo-${featuredArticle.slug}`}>
              <Image
                fill
                src={featuredArticle.image}
                alt={featuredArticle.imageAlt}
                className={`bb-about-journal-image`}
                id={`bb-about-journal-image-${featuredArticle.slug}`}
                sizes={`(max-width: 800px) calc(100vw - 36px), 530px`}
              />
            </div>
            <OrnamentalArch id={`bb-about-journal-arch-${featuredArticle.slug}`} />
          </div>
          <div className={`bb-about-journal-copy`} id={`bb-about-journal-copy`} data-reveal>
            <span className={`bb-eyebrow`} id={`bb-about-journal-eyebrow`}>From The Bengali Blush Journal</span>
            <h2 className={`bb-about-section-heading`} id={`bb-about-journal-heading`}>A little beauty,<br /><em>every day.</em></h2>
            <span className={`bb-about-journal-label`} id={`bb-about-journal-label`}><BookOpen size={14} aria-hidden={`true`} />Featured Read</span>
            <h3 className={`bb-about-journal-title`} id={`bb-about-journal-title-${featuredArticle.slug}`}>{featuredArticle.title}</h3>
            <p className={`bb-about-journal-excerpt`} id={`bb-about-journal-excerpt-${featuredArticle.slug}`}>{featuredArticle.excerpt}</p>
            <Link href={siteRoutes.blog.href} id={`bb-about-blog-link`} className={`bb-button bb-button-primary bb-about-blog-link`}>
              Explore The Blog <ArrowUpRight size={15} aria-hidden={`true`} />
            </Link>
          </div>
        </div>
      </section>
    ) : null}
    <section className={`bb-section bb-about-invitation`} id={`bb-about-invitation`} aria-labelledby={`bb-about-invitation-heading`}>
      <div className={`bb-container bb-about-invitation-inner`} id={`bb-about-invitation-inner`} data-reveal>
        <div className={`bb-about-invitation-copy`} id={`bb-about-invitation-copy`}>
          <span className={`bb-eyebrow`} id={`bb-about-invitation-eyebrow`}>Atlanta · By Appointment</span>
          <h2 className={`bb-about-section-heading`} id={`bb-about-invitation-heading`}>Your beauty ritual<br /><em>starts here.</em></h2>
          <p className={`bb-about-invitation-description`} id={`bb-about-invitation-description`}>Have a look in mind or a question before you book? We would love to hear from you.</p>
        </div>
        <div className={`bb-about-actions`} id={`bb-about-actions`}>
          <Link href={siteRoutes.contact.href} id={`bb-about-contact-link`} className={`bb-button bb-button-primary`}>Say Hello <ArrowUpRight size={15} aria-hidden={`true`} /></Link>
          <Link href={siteRoutes.services.href} id={`bb-about-services-link`} className={`bb-button bb-button-outline`}>Explore Services <WandSparkles size={15} aria-hidden={`true`} /></Link>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
