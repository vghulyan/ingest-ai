// /apps/api/src/rag/rag.module.ts

import { Module } from '@nestjs/common';
import { RagController } from './rag.controller';
import { RagService } from './rag.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [SearchModule],
  controllers: [RagController],
  providers: [RagService],
})
export class RagModule {}
