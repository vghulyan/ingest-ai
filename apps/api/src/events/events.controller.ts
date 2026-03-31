// /apps/api/src/events/events.controller.ts

import { DocEvent } from '@ingest-ai/shared';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import Redis from 'ioredis';



@Controller('events')
export class EventsController {
  @Get(':documentId')
  async stream(@Param('documentId') documentId: string, @Res() res: Response) {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    res.flushHeaders();

    const sub = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT || 6379),
    });

    await sub.subscribe('doc-events');

    sub.on('message', (_channel: string, message: string) => {
      const data = JSON.parse(message) as DocEvent;

      if (data.documentId === documentId) {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    });

    res.on('close', async () => {
      await sub.quit();
      res.end();
    });
  }
}
