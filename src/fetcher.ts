import type { z } from "zod";
import { BASE_URL, USER_AGENT } from "./lib/constants";
import { err, type OLibError, ok, type Result } from "./result";

function errorFromStatus(status: number, url: string): OLibError {
	if (status === 404) {
		return { code: "NOT_FOUND", message: `Not found: ${url}`, status };
	}

	if (status === 429) {
		return {
			code: "RATE_LIMITED",
			message: `Rate limited by Open Library`,
			status,
		};
	}

	return {
		code: "SERVER_ERROR",
		message: `Server error occurred`,
		status,
	};
}

export async function fetchJson<T extends z.ZodType>(
	path: string,
	schema: T,
	params?: Record<string, string | number | undefined>,
): Promise<Result<z.output<T>>> {
	const url = new URL(path, BASE_URL);

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) {
				url.searchParams.set(key, String(value));
			}
		}
	}

	let response: Response;

	try {
		response = await fetch(url, {
			headers: { "User-Agent": USER_AGENT },
		});
	} catch (error) {
		return err({
			code: "NETWORK_ERROR",
			message: "Network error occurred",
			cause: error,
		});
	}

	if (!response.ok) {
		return err(errorFromStatus(response.status, url.toString()));
	}

	let json: unknown;

	try {
		json = await response.json();
	} catch (error) {
		return err({
			code: "PARSE_ERROR",
			message: "Failed to parse JSON response",
			cause: error,
		});
	}

	const parsed = schema.safeParse(json);

	if (!parsed.success) {
		return err({
			code: "PARSE_ERROR",
			message: "Response did not match expected schema",
			cause: parsed.error,
		});
	}

	return ok(parsed.data);
}
