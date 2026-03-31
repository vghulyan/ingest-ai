// /apps/api/src/rag/rag.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { RagService } from './rag.service';

type RagRequest = {
  query: string;
  documentId?: string;
  topK?: number;
};

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post()
  async ask(@Body() body: RagRequest) {
    const { query, documentId, topK } = body;

    const result = await this.ragService.ask(query, documentId, topK ?? 5);

    return {
      query,
      ...result,
    };
  }
}
