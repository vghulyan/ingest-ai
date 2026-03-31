// /apps/api/src/main.ts
import * as dotenv from 'dotenv';


import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.enableCors({
    origin: process.env.WEB_URL?.split(',') ?? [],
    credentials: true,
  });
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 7111;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );

  
}

bootstrap();
