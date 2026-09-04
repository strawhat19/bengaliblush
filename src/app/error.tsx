'use client';

import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(`Storefront Error`, error);
  }, [error]);

  return (
    <main className="bb-not-found">
      <span className="bb-eyebrow">A quick touch-up</span>
      <h1>Something needs<br /><em>a little fixing.</em></h1>
      <p>The storefront hit a temporary snag.</p>
      <button className="bb-button bb-button-primary" type="button" onClick={reset}>Try again</button>
    </main>
  );
}
