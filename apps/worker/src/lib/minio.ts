// /apps/worker/src/lib/minio.ts
import { Client as MinioClient } from 'minio';

export const minio = new MinioClient({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
});

export const BUCKET = 'documents';