# Google Avatar Sync

Google accounts synchronize their provider photo into the existing `users.photo_url` field during shared account hydration, including browser refresh. Successful Google sign-in also synchronizes the raw Google profile picture from that sign-in response, with Google provider data and Firebase's profile photo as fallbacks. Existing realtime user subscriptions deliver the saved photo to avatar consumers.

Only valid HTTPS photo URLs are accepted. Missing provider photos preserve the last saved avatar. Unchanged photos do not write, and changed photos update only `photo_url` and `updated_at` in a transaction that rechecks the current session, account UID and active status. Optional photo-sync failures retain the loaded account, log `Google Profile Photo Sync Failed`, and retry on the next hydration or Google sign-in.

The refresh check uses Firebase's latest stored provider profile. The Firebase web SDK reloads persisted user data during startup, but its account lookup does not fetch a live Google profile. A new Google picture therefore becomes available reliably after Google supplies it during Google sign-in; propagation within Google can take time. This implementation adds no Google token storage, extra authorization scopes or automatic login prompts.

Source references: [Firebase startup hydration](https://github.com/firebase/firebase-js-sdk/blob/main/packages/auth/src/core/auth/auth_impl.ts), [Firebase profile reload](https://github.com/firebase/firebase-js-sdk/blob/main/packages/auth/src/core/user/reload.ts), [Google sign-in profile response](https://docs.cloud.google.com/identity-platform/docs/reference/rest/v1/accounts/signInWithIdp#response-body), [optional Google picture claim](https://developers.google.com/identity/openid-connect/openid-connect#an-id-tokens-payload), and [Google photo propagation](https://support.google.com/accounts/answer/27442?hl=en).

Implementation is source-reviewed only. No build, typecheck, tests, UI checks or deployment were run for this change.
