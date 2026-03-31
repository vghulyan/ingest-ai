// /apps/api/src/app/app.module.ts

import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';
import { SearchModule } from '../search/search.module';
import { RagModule } from '../rag/rag.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    PrismaModule,
    DocumentsModule,
    StorageModule,
    SearchModule,
    RagModule,
    EventsModule,
  ],
  controllers: [],
})
export class AppModule {}
