// /apps/worker/src/lib/events.ts

import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
});

export async function publishEvent(event: {
  documentId: string;
  stage: string;
  message: string;
}) {
  await redis.publish('doc-events', JSON.stringify(event));
}
