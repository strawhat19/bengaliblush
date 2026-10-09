import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app';

export const getFirebaseClient = () => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  };
  if (Object.values(config).some((value) => !value)) throw new Error(`Firebase Connection Is Not Configured`);
  const app = getApps()?.[0] ?? initializeApp(config);
  return { auth: getAuth(app), database: getFirestore(app) };
};
