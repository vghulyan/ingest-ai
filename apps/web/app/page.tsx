// /apps/web/app/page.tsx
import Link from 'next/link';
import WhatThisDoes from './components/WhatThisDoes';

export default function HomePage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold">Welcome to Ingest AI</h1>

      <Link
        href="/dashboard"
        className="rounded-xl border border-black px-5 py-2 text-sm font-medium"
      >
        Go to Dashboard
      </Link>

      <WhatThisDoes />
    </main>
  );
}
