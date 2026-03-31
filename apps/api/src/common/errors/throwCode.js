"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequest = badRequest;
exports.unauthorized = unauthorized;
exports.forbidden = forbidden;
exports.notFound = notFound;
exports.internal = internal;
// apps/api/src/common/errors/throwCode.ts
const common_1 = require("@nestjs/common");
function badRequest(code) {
    throw new common_1.BadRequestException({ code });
}
function unauthorized(code) {
    throw new common_1.UnauthorizedException({ code });
}
function forbidden(code) {
    throw new common_1.ForbiddenException({ code });
}
function notFound(code) {
    throw new common_1.NotFoundException({ code });
}
function internal(code) {
    throw new common_1.InternalServerErrorException({ code });
}
