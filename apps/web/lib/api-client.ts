// /apps/web/lib/api-client.ts

import { API_BASE_URL } from './api';
import { DocumentListItem } from '@ingest-ai/shared';

// ---------- GENERIC FETCH WRAPPER ----------

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();

    let message = 'Something went wrong';

    try {
      const parsed = JSON.parse(text);
      message = parsed.message ?? message;
    } catch {
      message = text;
    }

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ---------- DOCUMENTS ----------

export async function getDocuments(): Promise<DocumentListItem[]> {
  return request<DocumentListItem[]>('/documents');
}

export async function getDocumentById(id: string): Promise<DocumentListItem> {
  return request<DocumentListItem>(`/documents/${id}`);
}

// ---------- SEARCH ----------

export type SearchResult = {
  chunkId: string;
  documentId: string;
  content: string;
  score: number;
};

export type SearchResponse = {
  query: string;
  count: number;
  results: SearchResult[];
};

export async function searchDocuments(input: {
  query: string;
  documentId: string;
  topK?: number;
}): Promise<SearchResponse> {
  return request<SearchResponse>('/search', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// ---------- RAG ----------

export type RagResponse = {
  query: string;
  answer: string;
  sources: SearchResult[];
};

export async function askRag(input: {
  query: string;
  documentId: string;
  topK?: number;
}): Promise<RagResponse> {
  return request<RagResponse>('/rag', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// ---------- UPLOAD ----------

export type UploadResponse = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  status: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status})`);
  }

  return res.json() as Promise<UploadResponse>;
}
