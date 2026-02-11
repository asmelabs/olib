import { fetchJson } from "../fetcher";
import { ok, type Result } from "../result";
import { querySchema } from "../schemas/author.schema";
import {
	type AuthorGetInput,
	type AuthorGetOutput,
	type AuthorSearchInput,
	type AuthorSearchOutput,
	authorGetInputSchema,
	authorGetOutputSchema,
	authorSearchOutputSchema,
} from "../schemas/author-services.schema";

export class AuthorModule {
	static create(): AuthorModule {
		return new AuthorModule();
	}

	private constructor() {}

	async search(
		query: string,
		input?: AuthorSearchInput,
	): Promise<Result<AuthorSearchOutput>> {
		const { data: q = "" } = querySchema.safeParse(query);
		const { limit = 100, offset = 0 } = input ?? {};

		if (!q) {
			return ok({
				start: offset,
				numFound: 0,
				numFoundExact: false,
				docs: [],
			});
		}

		return await fetchJson("/search/authors.json", authorSearchOutputSchema, {
			q,
			limit,
			offset,
		});
	}

	async get(key: AuthorGetInput): Promise<Result<AuthorGetOutput>> {
		const { data: k = "" } = authorGetInputSchema.safeParse(key);
		return await fetchJson(`/authors/${k}.json`, authorGetOutputSchema);
	}
}
