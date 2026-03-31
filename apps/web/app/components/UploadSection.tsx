// /apps/web/app/components/UploadSection.tsx
'use client';

import { ChangeEvent, FormEvent } from 'react';

type Props = {
  selectedFile: File | null;
  uploading: boolean;
  uploadedFileName: string;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onUpload: (e: FormEvent<HTMLFormElement>) => void;
};

export default function UploadSection({
  selectedFile,
  uploading,
  uploadedFileName,
  onFileChange,
  onUpload,
}: Props) {
  return (
    <section className="rounded-2xl border p-6">
      <h2 className="text-lg font-medium">Upload</h2>

      <form onSubmit={onUpload} className="mt-4 flex flex-col gap-3">
        <input type="file" accept="application/pdf" onChange={onFileChange} />

        <button disabled={!selectedFile || uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {uploadedFileName && (
          <div className="text-sm text-neutral-500">{uploadedFileName}</div>
        )}
      </form>
    </section>
  );
}
