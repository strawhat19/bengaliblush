import { Globe } from 'lucide-react';
import type { AuthMode } from './auth-types';
import AuthForm from './auth-form/auth-form';
import AuthStory from './auth-story/auth-story';
import { siteRoutes } from '@/shared/navigation/routes';
import Link from '@/app/components/navigation/page-link/page-link';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

const AuthPage = ({ mode }: { mode: AuthMode }) => (
  <BengaliBlushLanding onboarding>
    <div id={`bb-auth-${mode}-page`} className={`bb-auth-page bb-auth-page-${mode}`}>
      <AuthStory mode={mode} />
      <section
        id={`bb-auth-form-panel`}
        className={`bb-auth-form-panel`}
        aria-label={mode === `signup` ? `Create Your Bengali Blush Account` : `Sign In To Bengali Blush`}
      >
        <div id={`bb-auth-${mode}-form-content`} className={`bb-auth-form-content`}>
          <AuthForm mode={mode} />
        </div>
        <footer id={`bb-auth-${mode}-footer`} className={`bb-auth-footer`}>
          <span id={`bb-auth-${mode}-copyright`} className={`bb-auth-copyright`}>
            © {new Date().getFullYear()} Bengali Blush
          </span>
          <nav id={`bb-auth-${mode}-legal-links`} className={`bb-auth-legal-links`} aria-label={`Legal Information`}>
            <Link href={siteRoutes.privacy.href} id={`bb-auth-${mode}-footer-privacy-link`} className={`bb-auth-footer-link`}>Privacy</Link>
            <Link href={siteRoutes.terms.href} id={`bb-auth-${mode}-footer-terms-link`} className={`bb-auth-footer-link`}>Terms</Link>
          </nav>
          <a
            target={`_blank`}
            rel={`noreferrer`}
            href={`https://piratechs.com/`}
            id={`bb-auth-${mode}-piratechs-link`}
            className={`bb-auth-footer-link bb-auth-credit`}
          >
            <Globe size={12} aria-hidden={`true`} />Piratechs
          </a>
        </footer>
      </section>
    </div>
  </BengaliBlushLanding>
);

export default AuthPage;
