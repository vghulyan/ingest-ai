// /apps/web/app/components/NavBar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  function isActive(path: string) {
    return pathname === path;
  }

  return (
    <nav className="w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="text-sm font-semibold">Ingest AI</div>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className={`px-3 py-1 rounded-lg ${
              isActive('/')
                ? 'bg-black text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className={`px-3 py-1 rounded-lg ${
              isActive('/dashboard')
                ? 'bg-black text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
