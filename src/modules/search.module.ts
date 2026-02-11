import { fetchJson } from "../fetcher";
import { DOCS_BASE_URL } from "../lib/constants";
import { ok, type Result } from "../result";
import { querySchema } from "../schemas/author.schema";
import {
	type SearchInput,
	type SearchOutput,
	searchOutputSchema,
} from "../schemas/search.schema";

export async function search(
	query: string,
	input?: SearchInput,
): Promise<Result<SearchOutput>> {
	const { data: q = "" } = querySchema.safeParse(query);
	const { limit = 100, offset = 0, sort } = input ?? {};

	if (!q) {
		return ok({
			start: offset,
			numFound: 0,
			numFoundExact: false,
			docs: [],
			documentation_url: `${DOCS_BASE_URL}/search`,
			q: "",
			num_found: 0,
			offset,
		});
	}

	return await fetchJson("/search.json", searchOutputSchema, {
		q: query,
		limit,
		offset,
		sort,
	});
}
