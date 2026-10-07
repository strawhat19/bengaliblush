import type { Metadata } from 'next';
import AuthPage from '@/app/components/authentication/auth-page';
import { siteRoutes } from '@/shared/navigation/routes';

export const metadata: Metadata = {
  title: siteRoutes.signin.title,
  description: siteRoutes.signin.description,
};

const SignInRoute = () => <AuthPage mode={`signin`} />;

export default SignInRoute;
