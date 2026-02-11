import { z } from "zod";
import {
	DEFAULT_LIMIT,
	DEFAULT_OFFSET,
	MAX_LIMIT,
	MIN_LIMIT,
	MIN_OFFSET,
} from "../lib/constants";
import { parseKey } from "../lib/utils";

/**
 * Open Library uses `{ type: "/type/datetime", value: "..." }` for dates.
 * We parse this and normalize to just the ISO string.
 */
export const datetimeValueSchema = z
	.object({
		type: z.string(),
		value: z.string(),
	})
	.transform((v) => v.value);

/**
 * Many fields (description, bio, notes, first_sentence) can be either
 * a plain string OR `{ type: "/type/text", value: "..." }`.
 * We normalize to always return a string.
 */
export const textValueSchema = z
	.union([z.string(), z.object({ type: z.string(), value: z.string() })])
	.transform((v) => (typeof v === "string" ? v : v.value));

/**
 * Typed key reference used throughout OL: `{ key: "/type/work" }`, `{ key: "/authors/OL123A" }`, etc.
 */
export const keySchema = z.string().transform(parseKey);
export const typedKeySchema = z.object({ key: keySchema });

/**
 * Link object used in author records and elsewhere.
 */
export const linkSchema = z.object({
	title: z.string(),
	url: z.string(),
	type: typedKeySchema.optional(),
});

/**
 * Pagination input parameters schema.
 */
export const paginationInputSchema = z.object({
	limit: z.int().min(MIN_LIMIT).max(MAX_LIMIT).default(DEFAULT_LIMIT),
	offset: z.int().min(MIN_OFFSET).default(DEFAULT_OFFSET),
});

export type PaginationInput = z.infer<typeof paginationInputSchema>;

/**
 * Pagination output parameters schema.
 */
export const paginationOutputSchema = <T extends z.ZodType>(doc: T) =>
	z.object({
		docs: doc.array(),
		start: z.int(),
		numFound: z.int(),
		numFoundExact: z.boolean(),
	});

export type PaginationOutput<T> = z.infer<
	ReturnType<typeof paginationOutputSchema<z.ZodType<T>>>
>;
