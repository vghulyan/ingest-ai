export type ErrorCode = string;
export declare function badRequest(code: ErrorCode): never;
export declare function unauthorized(code: ErrorCode): never;
export declare function forbidden(code: ErrorCode): never;
export declare function notFound(code: ErrorCode): never;
export declare function internal(code: ErrorCode): never;
