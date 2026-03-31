// /apps/worker/src/lib/chunk.ts

export function chunkText(text: string, size = 1000): string[] {
  const chunks: string[] = [];

  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size;
  }

  return chunks;
}
