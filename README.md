# Bengali Blush

![Bengali Blush](./public/assets/versions/BengaliBlush_v0000_0.gif)

A Next.js, TypeScript, Sass, and PWA storefront for Bengali Blush Atelier. Lash & Beauty Studio.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Firebase

Google and email/password sign-in use Firebase project `bengaliblush-9ac28` and return to Home after authentication. Email sign-up collects a name, email, and password with 8–128 characters. Firebase Authentication handles passwords and password reset emails; passwords are never saved in Firestore. A verification email is requested after registration, without delaying access to Home. Account profiles, contact messages, and appointment requests are saved privately in Firestore. Sign-in is required to submit a message or appointment request; public browsing remains available. An appointment request does not reserve a time until the studio confirms it.

Firebase web configuration is saved in the gitignored `.env` file. `.env.example` lists the required variables. Firebase web API keys identify the app; Firebase Authentication and the deployed Firestore rules enforce access. No service-account private key is required for this client SDK integration.

Signed-in accounts save their light/dark theme in the private `users` record as `theme_mode` and restore it on sign-in. Accounts without a saved theme adopt the visitor's current preference. Signed-out preferences stay in browser storage, separately from account preferences.

Profile account actions require Google or current-password verification and typed `DEACTIVATE` or `DELETE` confirmation. Deactivation pauses Bengali Blush access and signs out while retaining saved data; signing in again offers explicit reactivation. It does not disable the Firebase Authentication identity globally. Legacy accounts without `account_status` remain active.

Deletion permanently removes the Firebase identity, profile, and private contact and appointment requests. Cleanup reads the server and deletes submissions in bounded batches before removing the profile and identity. Interrupted deletion can resume after signing in and confirming again. A private UID-to-record deletion marker remains to prevent old sessions from recreating the profile; shared numbering counters are retained. These actions use the existing client SDK and Firestore rules, without service-account credentials or Cloud Functions.

New accounts receive the `subscriber` role. To appoint an Owner, have that person sign in with Google or email/password, find their `users` record in the Firebase console by `email`, then set `role` to `owner` through the trusted console. The live account listener picks up this change. Owners can open `/dashboard` to view private accounts, contact messages, and appointment requests and update submission statuses. Regular users cannot assign their own roles or read other users' private records.

Business documents use numbered app-owned IDs. The `accountAccess` UID-to-record index and collection counters use deterministic infrastructure keys for secure authorization and atomic numbering. Authentication credentials stay with Firebase Authentication and Google, separate from Firestore profiles.

Deploy updated Firestore rules and indexes with `firebase deploy --only firestore:rules,firestore:indexes --project bengaliblush-9ac28`. Firebase configuration is also saved in the existing Vercel project's Production, Preview, and Development environments; future app deployments will receive it. Add any additional preview hostname to Firebase Authentication's Authorized domains before using Google sign-in there.

Shopping bag storage and checkout remain in their existing mode. Payments, file uploads, Firebase Storage, and Cloud Functions are not connected.

## Commands

- `npm run dev` — start the local development server
- `npm run typecheck` — check TypeScript
- `npm run lint` — check code quality
- `npm run build` — create the production PWA build
- `npm start` — serve the production build

## Structure

- `src/app` — App Router layouts, pages, and UI components
- `src/shared` — site configuration and browser storage
- `src/styles` — Sass theme, storefront, effects, and responsive styling
- `public` — images, icons, and the web app manifest

## Progressive Web App

The existing Next.js App Router app includes a web app manifest, home screen icons, Apple web app metadata, and a production service worker. No additional PWA package is required.

PWA registration is enabled in production on HTTPS or localhost. Run `npm run build` followed by `npm start` when you are ready to review installation and offline behavior. Development mode removes this app’s old workers and caches so source changes stay visible.

Install from your browser’s app menu. On iPhone or iPad, use Share → Add to Home Screen. The manifest includes shortcuts to About and Contact.

The worker warms Home, About, Contact, their Next.js assets, and essential brand images. Available public pages are cached separately and refresh from the network; unavailable pages show the themed offline fallback. Next.js server component requests, API responses, and external content are not cached. Optimized shop images and external maps may need a connection.

Worker updates activate after existing app windows close. Increment `CACHE_NAME` in `public/sw.js` when changing the cached shell or assets so the next installation refreshes them. Set `NEXT_PUBLIC_SITE_URL` to the production domain when deploying.
