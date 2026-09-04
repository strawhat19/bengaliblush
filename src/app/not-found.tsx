import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="bb-not-found">
      <span className="bb-eyebrow">A little beauty detour</span>
      <h1>That page<br /><em>slipped away.</em></h1>
      <p>The glow is still waiting back at the atelier.</p>
      <Link className="bb-button bb-button-primary" href="/"><ArrowLeft size={16} />Return home</Link>
    </main>
  );
}
