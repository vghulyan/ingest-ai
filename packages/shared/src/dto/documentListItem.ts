// /pacakges/shared/src/dto/documentListItem.ts
import { DocumentStatus } from '../enums';

export type DocumentListItem = {
  id: string;
  fileName: string;
  status: DocumentStatus;
  createdAt: string;
};

export type DocEvent = {
  documentId: string;
  stage: string;
  message: string;
};