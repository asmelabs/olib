import { z } from "zod";
import {
	datetimeValueSchema,
	linkSchema,
	textValueSchema,
	typedKeySchema,
} from "./common";

const optionalAuthorFields = z
	.object({
		bio: textValueSchema,
		alternate_names: z.string().array(),
		birth_date: z.string(),
		death_date: z.string(),
		date: z.string(),
		top_subjects: z.string().array(),
		top_work: z.string(),
		work_count: z.int(),
		ratings_average: z.number(),
		ratings_sortable: z.number(),
		ratings_count: z.int(),
		ratings_count_1: z.int(),
		ratings_count_2: z.int(),
		ratings_count_3: z.int(),
		ratings_count_4: z.int(),
		ratings_count_5: z.int(),
		want_to_read_count: z.int(),
		already_read_count: z.int(),
		currently_reading_count: z.int(),
		readinglog_count: z.int(),
		_version_: z.number(),

		links: linkSchema.array(),
		remote_ids: z.record(z.string(), z.string()),
		photos: z.number().array(),

		title: z.string(),
		fuller_name: z.string(),
		personal_name: z.string(),

		created: datetimeValueSchema,
		last_modified: datetimeValueSchema,
		revision: z.int(),
		latest_revision: z.int(),
	})
	.partial();

export const authorSchema = z
	.object({
		key: z.string(),
		name: z.string(),
		type: typedKeySchema.or(z.literal("author")),
	})
	.extend(optionalAuthorFields.shape);

export const querySchema = z.string().trim().optional();

export type Author = z.infer<typeof authorSchema>;
