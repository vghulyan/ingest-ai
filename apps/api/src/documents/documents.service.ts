// /apps/api/src/documents/documents.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from '@ingest-ai/shared';
import { QueueService } from '../queue/queue.service';
import { Document, DocumentStatus } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) {}

  async create(dto: CreateDocumentDto): Promise<Document> {
    const doc = await this.prisma.document.create({
      data: {
        fileName: dto.fileName,
        fileUrl: dto.fileUrl,
        mimeType: dto.mimeType,
        size: dto.size,
        status: DocumentStatus.UPLOADED,
      },
    });

    await this.queueService.addDocumentJob(doc.id);

    return doc;
  }

  async findAll(): Promise<Document[]> {
    return this.prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Document | null> {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }
}
