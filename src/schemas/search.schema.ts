import z from "zod";
import { languageCodes } from "../lib/language-codes";
import { keySchema, paginationInputSchema } from "./common";

export const languageCodeSchema = z.enum(languageCodes);
export type LanguageCode = z.infer<typeof languageCodeSchema>;

export const searchSortSchema = z.enum([
	"editions",
	"old",
	"new",
	"rating",
	"rating asc",
	"rating desc",
	"readinglog",
	"want_to_read",
	"currently_reading",
	"already_read",
	"title",
	"scans",
	"lcc_sort",
	"lcc_sort asc",
	"lcc_sort desc",
	"ddc_sort",
	"ddc_sort asc",
	"ddc_sort desc",
	"ebook_access",
	"ebook_access asc",
	"ebook_access desc",
	"key",
	"key asc",
	"key desc",
	"random",
	"random asc",
	"random desc",
	"random.hourly",
	"random.daily",
]);

export type SearchSort = z.infer<typeof searchSortSchema>;

const optionalSearchDocFields = z
	.object({
		author_key: keySchema.array(),
		author_name: z.string().array(),
		cover_edition_key: z.string(),
		cover_i: z.number(),
		ebook_access: z.string(),
		edition_count: z.int(),
		first_publish_year: z.int(),
		has_fulltext: z.boolean(),
		ia: z.string().array(),
		ia_collection: z.string().array(),
		language: z.string().array(),
		lending_edition_s: z.string(),
		lending_identifier_s: z.string(),
		public_scan_b: z.boolean(),
	})
	.partial();

export const searchDocSchema = z
	.object({
		key: keySchema,
		title: z.string(),
	})
	.extend(optionalSearchDocFields.shape);

export const searchInputSchema = z
	.object({
		sort: searchSortSchema.optional(),
	})
	.extend(paginationInputSchema.shape);

export type SearchInput = z.input<typeof searchInputSchema>;

export const searchOutputSchema = z.object({
	docs: searchDocSchema.array(),
	start: z.int(),
	numFound: z.int(),
	numFoundExact: z.boolean(),
	num_found: z.int(),
	documentation_url: z.string(),
	q: z.string(),
	offset: z.int().nullable(),
});

export type SearchOutput = z.infer<typeof searchOutputSchema>;
