import z from "zod";
import { authorSchema } from "./author.schema";
import { paginationInputSchema, paginationOutputSchema } from "./common";

/**
 * Search
 */
export const authorSearchInputSchema = paginationInputSchema;
export const authorSearchOutputSchema = paginationOutputSchema(authorSchema);

export type AuthorSearchInput = z.infer<typeof authorSearchInputSchema>;
export type AuthorSearchOutput = z.infer<typeof authorSearchOutputSchema>;

/**
 * Get
 */
export const authorGetInputSchema = z.string().trim();
export const authorGetOutputSchema = authorSchema;

export type AuthorGetInput = z.infer<typeof authorGetInputSchema>;
export type AuthorGetOutput = z.infer<typeof authorGetOutputSchema>;
