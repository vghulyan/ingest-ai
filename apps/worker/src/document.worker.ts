// /apps/worker/src/document.worker.ts

import 'dotenv/config';

import { ERROR_CODES } from '@ingest-ai/shared';
import { Worker } from 'bullmq';

import { BUCKET, minio } from './lib/minio';
import { openai } from './lib/openai';
import { prisma } from './lib/prisma';
import { publishEvent } from './lib/events';

// ✅ simple chunker
function chunkText(text: string, size = 1000): string[] {
  const chunks: string[] = [];
  let i = 0;

  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size;
  }

  return chunks;
}

// ✅ embedding function
async function embedText(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return res.data[0].embedding;
}

const worker = new Worker(
  'document-queue',
  async (job) => {
    const { documentId } = job.data;

    console.log('Processing document:', documentId);

    // 🔥 START
    await publishEvent({
      documentId,
      stage: 'START',
      message: 'Processing started',
    });

    const doc = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc) throw new Error(ERROR_CODES.NOT_FOUND);

    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'PROCESSING' },
    });

    const objectName = doc.fileUrl.split('/').pop();

    if (!objectName) {
      throw new Error('Invalid fileUrl');
    }

    // 🔥 DOWNLOADING
    await publishEvent({
      documentId,
      stage: 'DOWNLOADING',
      message: 'Downloading from MinIO',
    });

    const stream = await minio.getObject(BUCKET, objectName);

    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }

    const buffer = Buffer.concat(chunks);

    if (!buffer.length) {
      throw new Error('Empty file buffer');
    }

    // 🔥 PARSING
    await publishEvent({
      documentId,
      stage: 'PARSING',
      message: 'Parsing PDF',
    });

    const { PDFParse } = require('pdf-parse');

    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    if (!result?.text) {
      throw new Error('PDF parsing failed');
    }

    // 🔥 CHUNKING
    const textChunks = chunkText(result.text);

    await publishEvent({
      documentId,
      stage: 'CHUNKING',
      message: `Split into ${textChunks.length} chunks`,
    });

    // 🔥 EMBEDDING LOOP
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];

      await publishEvent({
        documentId,
        stage: 'EMBEDDING',
        message: `Embedding ${i + 1}/${textChunks.length}`,
      });

      const embedding = await embedText(chunk);

      await prisma.documentChunk.create({
        data: {
          documentId,
          content: chunk,
          embedding,
        },
      });
    }

    // 🔥 DONE
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'DONE',
        content: result.text,
      },
    });

    await publishEvent({
      documentId,
      stage: 'DONE',
      message: 'Processing completed',
    });

    console.log('Finished document:', documentId);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT || 6379),
    },
  },
);

worker.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

worker.on('failed', async (job, err) => {
  console.error(`Job failed: ${job?.id}`, err);

  if (job?.data?.documentId) {
    await publishEvent({
      documentId: job.data.documentId,
      stage: 'ERROR',
      message: err.message,
    });
  }
});
