// /apps/api/src/queue/queue.service.ts

import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  private queue: Queue;

  constructor() {
    this.queue = new Queue('document-queue', {
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT || 6379),
      },
    });
  }

  async addDocumentJob(documentId: string): Promise<void> {
    await this.queue.add('process-document', {
      documentId,
    });
  }
}
