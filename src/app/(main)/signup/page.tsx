import type { Metadata } from 'next';
import AuthPage from '@/app/components/authentication/auth-page';
import { siteRoutes } from '@/shared/navigation/routes';

export const metadata: Metadata = {
  title: siteRoutes.signup.title,
  description: siteRoutes.signup.description,
};

const SignUpRoute = () => <AuthPage mode={`signup`} />;

export default SignUpRoute;
