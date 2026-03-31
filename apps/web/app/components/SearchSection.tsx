// /apps/web/app/components/SearchSection.tsx
'use client';

import type { SearchResult } from '@/lib/api-client';

type Props = {
  query: string;
  setQuery: (value: string) => void;
  onSearch: () => void;
  results: SearchResult[];
};

export default function SearchSection({
  query,
  setQuery,
  onSearch,
  results,
}: Props) {
  return (
    <section className="rounded-2xl border p-6">
      <h2 className="text-lg font-medium">Search</h2>

      <div className="mt-4 flex flex-col gap-3">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a search-style question about the document..."
          className="min-h-[110px] rounded-xl border border-neutral-300 px-3 py-2 text-sm"
        />

        <button
          type="button"
          onClick={onSearch}
          className="w-fit rounded-xl border border-neutral-900 px-4 py-2 text-sm font-medium"
        >
          Search
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {results.length === 0 ? (
          <div className="text-sm text-neutral-500">No search results yet.</div>
        ) : (
          results.map((r) => (
            <div
              key={r.chunkId}
              className="rounded-xl border border-neutral-200 p-4"
            >
              <div className="text-xs text-neutral-500">
                Score:{' '}
                <span className="font-medium text-neutral-900">
                  {r.score.toFixed(4)}
                </span>
              </div>
              <div className="mt-2 text-sm leading-6 text-neutral-800">
                {r.content}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
