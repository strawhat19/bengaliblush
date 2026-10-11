import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, type AppCheck } from 'firebase/app-check';

let appCheck: AppCheck | undefined;

export const getFirebaseClient = () => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  };
  if (Object.values(config).some((value) => !value)) throw new Error(`Firebase Connection Is Not Configured`);
  const app = getApps()?.[0] ?? initializeApp(config);
  const appCheckSiteKey = process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY?.trim();
  if (typeof window !== `undefined` && appCheckSiteKey && !appCheck) {
    appCheck = initializeAppCheck(app, { isTokenAutoRefreshEnabled: true, provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey) });
  }
  return { auth: getAuth(app), appCheck, database: getFirestore(app) };
};
