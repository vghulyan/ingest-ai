// /apps/web/app/components/DocumentHistory.tsx
'use client';

import { useEffect, useState } from 'react';
import { DocumentListItem } from '@ingest-ai/shared';
import { getDocuments } from '@/lib/api-client';

type Props = {
  onSelect: (docId: string, fileName: string) => void;
};

export default function DocumentHistory({ onSelect }: Props) {
  const [docs, setDocs] = useState<DocumentListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchDocs() {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocs(data ?? []);
    } catch {
      setDocs([]); // safe fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <h3 className="text-sm font-semibold mb-3">Document History</h3>

      {loading && <div className="text-xs text-neutral-500">Loading...</div>}

      {!loading && docs.length === 0 && (
        <div className="text-xs text-neutral-500">No documents yet</div>
      )}

      <div className="flex flex-col gap-2">
        {docs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc.id, doc.fileName)}
            className="text-left rounded-lg border border-neutral-200 px-3 py-2 hover:bg-neutral-50"
          >
            <div className="text-sm font-medium truncate">{doc.fileName}</div>

            <div className="text-xs text-neutral-500 flex justify-between">
              <span>{doc.status}</span>
              <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
