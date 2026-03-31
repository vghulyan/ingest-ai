// /apps/api/src/search/search.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';

type SearchResult = {
  chunkId: string;
  documentId: string;
  content: string;
  score: number;
};

@Injectable()
export class SearchService {
  private openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // ✅ Embed query
  async embedQuery(query: string): Promise<number[]> {
    try {
      const res = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
      });

      return res.data[0].embedding; // ✅ THIS is the vector
    } catch (err: any) {
      if (err?.status === 429) {
        throw new HttpException(
          'AI quota exceeded. Please check billing.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      if (err?.status === 401) {
        throw new HttpException(
          'Invalid OpenAI API key.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        'AI service unavailable.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // ✅ Cosine similarity
  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // ✅ Main search
  async search(
    query: string,
    documentId?: string,
    topK = 5,
  ): Promise<SearchResult[]> {
    const queryEmbedding = await this.embedQuery(query);

    const chunks = await this.prisma.documentChunk.findMany({
      where: documentId ? { documentId } : {},
    });

    if (!chunks.length) return [];

    const scored: SearchResult[] = chunks.map((chunk) => {
      const embedding = chunk.embedding as unknown as number[];

      const score = this.cosineSimilarity(queryEmbedding, embedding);

      return {
        chunkId: chunk.id,
        documentId: chunk.documentId,
        content: chunk.content,
        score,
      };
    });

    // sort descending
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  }
}
