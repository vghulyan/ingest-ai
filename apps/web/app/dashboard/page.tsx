// /apps/web/app/dashboard/page.tsx
'use client';

import type { FormEvent } from 'react';
import { useState, useRef } from 'react';
import DocumentHistory from '../components/DocumentHistory';
import UploadSection from '../components/UploadSection';
import EventStream from '../components/EventStream';
import SearchSection from '../components/SearchSection';
import RagSection from '../components/RagSection';
import { DocEvent } from '@ingest-ai/shared';
import {
  SearchResult,
  searchDocuments,
  askRag,
  uploadDocument,
} from '@/lib/api-client';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:7111/api';

export default function DashboardPage() {
  const [documentId, setDocumentId] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [events, setEvents] = useState<DocEvent[]>([]);
  const [connected, setConnected] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [ragQuery, setRagQuery] = useState('');
  const [ragAnswer, setRagAnswer] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);

  function connect(id: string) {
    eventSourceRef.current?.close();

    const es = new EventSource(`${API_BASE_URL}/events/${id}`);
    eventSourceRef.current = es;

    es.onopen = () => setConnected(true);

    es.onmessage = (e: MessageEvent<string>) => {
      const data = JSON.parse(e.data) as DocEvent;
      setEvents((prev) => [...prev, data]);
    };
  }

  function handleSelectDocument(id: string, fileName: string) {
    setDocumentId(id);
    setUploadedFileName(fileName);
    connect(id);
  }

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);

    try {
      const data = await uploadDocument(selectedFile);

      setDocumentId(data.id);
      setUploadedFileName(data.fileName);
      connect(data.id);
    } finally {
      setUploading(false);
    }
  }

  async function handleSearch() {
    try {
      const data = await searchDocuments({
        query: searchQuery,
        documentId,
      });

      setSearchResults(data.results ?? []);
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function handleAsk() {
    if (!ragQuery) return;

    const data = await askRag({
      query: ragQuery,
      documentId,
    });

    setRagAnswer(data.answer ?? '');
  }

  return (
    <main className="flex gap-6 p-6">
      {/* LEFT SIDEBAR */}
      <div className="w-72 shrink-0">
        <DocumentHistory onSelect={handleSelectDocument} />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col gap-6">
        <UploadSection
          selectedFile={selectedFile}
          uploading={uploading}
          uploadedFileName={uploadedFileName}
          onFileChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          onUpload={handleUpload}
        />

        <EventStream events={events} connected={connected} />

        <SearchSection
          query={searchQuery}
          setQuery={setSearchQuery}
          onSearch={handleSearch}
          results={searchResults}
        />

        <RagSection
          query={ragQuery}
          setQuery={setRagQuery}
          onAsk={handleAsk}
          answer={ragAnswer}
        />
      </div>
    </main>
  );
}
