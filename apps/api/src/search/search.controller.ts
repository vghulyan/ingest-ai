// /apps/api/src/search/search.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';

type SearchRequest = {
  query: string;
  documentId?: string;
  topK?: number;
};

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  async search(@Body() body: SearchRequest) {    

    if (!body || !body.query) {
      throw new Error('Missing query');
    }

    const { query, documentId, topK } = body;

    const results = await this.searchService.search(
      query,
      documentId,
      topK ?? 5,
    );

    return {
      query,
      count: results.length,
      results,
    };
  }
}
