// apps/api/src/common/errors/throwCode.ts
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

export type ErrorCode = string;

export function badRequest(code: ErrorCode): never {
  throw new BadRequestException({ code });
}
export function unauthorized(code: ErrorCode): never {
  throw new UnauthorizedException({ code });
}
export function forbidden(code: ErrorCode): never {
  throw new ForbiddenException({ code });
}
export function notFound(code: ErrorCode): never {
  throw new NotFoundException({ code });
}
export function internal(code: ErrorCode): never {
  throw new InternalServerErrorException({ code });
}
