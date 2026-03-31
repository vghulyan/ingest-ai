// /apps/api/src/rag/rag.service.ts

import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { SearchService } from '../search/search.service';
import { badRequest, internal } from '../common/errors/throwCode';
import { ERROR_CODES } from '@ingest-ai/shared';

type RagResult = {
  answer: string;
  sources: Array<{
    chunkId: string;
    documentId: string;
    content: string;
    score: number;
  }>;
};

@Injectable()
export class RagService {
  private readonly openai: OpenAI;

  constructor(private readonly searchService: SearchService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async ask(query: string, documentId?: string, topK = 5): Promise<RagResult> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      badRequest(ERROR_CODES.INVALID_INPUT);
    }

    const matches = await this.searchService.search(
      trimmedQuery,
      documentId,
      topK,
    );

    if (!matches.length) {
      return {
        answer: 'No relevant context was found for this question.',
        sources: [],
      };
    }

    const context = matches
      .map((match, index) => `Source ${index + 1}:\n${match.content}`)
      .join('\n\n---\n\n');

    const prompt = [
      'Answer the user question using only the provided context.',
      'If the context is insufficient, say so clearly.',
      'Be concise and accurate.',
      '',
      `Question: ${trimmedQuery}`,
      '',
      'Context:',
      context,
    ].join('\n');

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content:
            'You answer questions strictly from supplied document context. Do not invent facts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const answer = completion.choices[0]?.message?.content?.trim();

    if (!answer) {
      internal(ERROR_CODES.INTERNAL_ERROR);
    }

    return {
      answer,
      sources: matches,
    };
  }
}
