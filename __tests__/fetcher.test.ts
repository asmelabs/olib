/** biome-ignore-all lint/suspicious/noExplicitAny: Mocking globalThis.fetch requires `any` casts because Bun's Mock type doesn't satisfy the full fetch signature (missing `preconnect`). This is a test-only concern — we're deliberately replacing a global. */
import { afterEach, describe, expect, mock, test } from "bun:test";
import { z } from "zod";
import { fetchJson } from "../src/fetcher";

const testSchema = z.object({
	title: z.string(),
	key: z.string(),
});

const originalFetch = globalThis.fetch;

afterEach(() => {
	globalThis.fetch = originalFetch;
});

function mockFetch(response: Partial<Response>) {
	globalThis.fetch = mock(() =>
		Promise.resolve({
			ok: true,
			status: 200,
			json: () => Promise.resolve({}),
			...response,
		} as Response),
	) as any;
}

describe("fetchJson", () => {
	test("returns parsed data on success", async () => {
		mockFetch({
			ok: true,
			status: 200,
			json: () =>
				Promise.resolve({
					title: "Fantastic Mr Fox",
					key: "/works/OL45804W",
				}),
		});

		const result = await fetchJson("/works/OL45804W.json", testSchema);

		expect(result.data).toEqual({
			title: "Fantastic Mr Fox",
			key: "/works/OL45804W",
		});
		expect(result.error).toBeNull();
	});

	test("appends query params to URL", async () => {
		let capturedUrl = "";
		globalThis.fetch = mock((input: URL | string) => {
			capturedUrl = input.toString();
			return Promise.resolve({
				ok: true,
				status: 200,
				json: () => Promise.resolve({ title: "Test", key: "/works/OL1W" }),
			} as Response);
		}) as any;

		await fetchJson("/search.json", testSchema, {
			q: "test",
			limit: 10,
			missing: undefined,
		});

		expect(capturedUrl).toContain("q=test");
		expect(capturedUrl).toContain("limit=10");
		expect(capturedUrl).not.toContain("missing");
	});

	test("returns NOT_FOUND error on 404", async () => {
		mockFetch({ ok: false, status: 404 });

		const result = await fetchJson("/works/OL99999999W.json", testSchema);

		expect(result.data).toBeNull();
		expect(result.error?.code).toBe("NOT_FOUND");
		expect(result.error?.status).toBe(404);
	});

	test("returns RATE_LIMITED error on 429", async () => {
		mockFetch({ ok: false, status: 429 });

		const result = await fetchJson("/works/OL1W.json", testSchema);

		expect(result.data).toBeNull();
		expect(result.error?.code).toBe("RATE_LIMITED");
		expect(result.error?.status).toBe(429);
	});

	test("returns SERVER_ERROR on 500", async () => {
		mockFetch({ ok: false, status: 500 });

		const result = await fetchJson("/works/OL1W.json", testSchema);

		expect(result.data).toBeNull();
		expect(result.error?.code).toBe("SERVER_ERROR");
		expect(result.error?.status).toBe(500);
	});

	test("returns NETWORK_ERROR when fetch throws", async () => {
		globalThis.fetch = mock(() =>
			Promise.reject(new TypeError("Failed to fetch")),
		) as any;

		const result = await fetchJson("/works/OL1W.json", testSchema);

		expect(result.data).toBeNull();
		expect(result.error?.code).toBe("NETWORK_ERROR");
		expect(result.error?.cause).toBeInstanceOf(TypeError);
	});

	test("returns PARSE_ERROR when JSON parsing fails", async () => {
		mockFetch({
			ok: true,
			status: 200,
			json: () => Promise.reject(new SyntaxError("Unexpected token")),
		});

		const result = await fetchJson("/works/OL1W.json", testSchema);

		expect(result.data).toBeNull();
		expect(result.error?.code).toBe("PARSE_ERROR");
		expect(result.error?.message).toBe("Failed to parse JSON response");
	});

	test("returns PARSE_ERROR when schema validation fails", async () => {
		mockFetch({
			ok: true,
			status: 200,
			json: () => Promise.resolve({ wrong: "shape" }),
		});

		const result = await fetchJson("/works/OL1W.json", testSchema);

		expect(result.data).toBeNull();
		expect(result.error?.code).toBe("PARSE_ERROR");
		expect(result.error?.message).toBe(
			"Response did not match expected schema",
		);
	});
});
