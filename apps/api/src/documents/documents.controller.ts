// /apps/api/src/documents/documents.controller.ts

import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { MinioService } from '../storage/minio.service';
import { badRequest } from '../common/errors/throwCode';

type UploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly minioService: MinioService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: UploadedFile) {
    if (!file) {
      badRequest('FIELD_REQUIRED');
    }

    if (!file.mimetype.includes('pdf')) {
      badRequest('INVALID_FORMAT');
    }

    const fileUrl = await this.minioService.uploadFile(file);

    return this.documentsService.create({
      fileName: file.originalname,
      fileUrl,
      mimeType: file.mimetype,
      size: file.size,
    });
  }

  @Get()
  async findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.documentsService.findById(id);
  }
}
