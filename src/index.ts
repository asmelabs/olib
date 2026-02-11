// Client
export { createOpenLibraryClient } from "./client";
// Result
export type { OLibError, OLibErrorCode, Result } from "./result";
export { err, ok } from "./result";
// Authors
export type { Author } from "./schemas/author.schema";
export type {
	AuthorGetInput,
	AuthorGetOutput,
	AuthorSearchInput,
	AuthorSearchOutput,
} from "./schemas/author-services.schema";
// Common
export type { PaginationInput, PaginationOutput } from "./schemas/common";
