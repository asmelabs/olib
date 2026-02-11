/** biome-ignore-all lint/suspicious/noExplicitAny: Mocking globalThis.fetch requires `any` casts for tests. */
import { afterEach, describe, expect, mock, test } from "bun:test";
import { createOpenLibraryClient, OpenLibrary } from "../src/client";

const originalFetch = globalThis.fetch;

afterEach(() => {
	globalThis.fetch = originalFetch;
});

describe("OpenLibrary client", () => {
	describe("createOpenLibraryClient", () => {
		test("returns OpenLibrary instance", () => {
			const client = createOpenLibraryClient();
			expect(client).toBeInstanceOf(OpenLibrary);
		});

		test("returns client with authors module", () => {
			const client = createOpenLibraryClient();
			expect(client.authors).toBeDefined();
			expect(typeof client.authors.search).toBe("function");
			expect(typeof client.authors.get).toBe("function");
		});
	});

	describe("OpenLibrary.create", () => {
		test("returns OpenLibrary instance", () => {
			const client = OpenLibrary.create();
			expect(client).toBeInstanceOf(OpenLibrary);
		});
	});

	describe("authors.get", () => {
		test("fetches author by key", async () => {
			globalThis.fetch = mock(() =>
				Promise.resolve({
					ok: true,
					status: 200,
					json: () =>
						Promise.resolve({
							key: "/authors/OL34184A",
							name: "Roald Dahl",
							type: { key: "/type/author" },
						}),
				} as Response),
			) as any;

			const client = createOpenLibraryClient();
			const result = await client.authors.get("OL34184A");

			expect(result.data?.name).toBe("Roald Dahl");
			expect(result.error).toBeNull();
		});
	});

	describe("authors.search", () => {
		test("returns empty result for empty query", async () => {
			const client = createOpenLibraryClient();
			const result = await client.authors.search("");

			expect(result.data?.docs).toEqual([]);
			expect(result.data?.numFound).toBe(0);
			expect(result.error).toBeNull();
		});

		test("searches authors when query is provided", async () => {
			globalThis.fetch = mock(() =>
				Promise.resolve({
					ok: true,
					status: 200,
					json: () =>
						Promise.resolve({
							start: 0,
							numFound: 1,
							numFoundExact: true,
							docs: [
								{
									key: "/authors/OL34184A",
									name: "Roald Dahl",
									type: { key: "/type/author" },
								},
							],
						}),
				} as Response),
			) as any;

			const client = createOpenLibraryClient();
			const result = await client.authors.search("Roald Dahl");

			expect(result.data?.docs[0]?.name).toBe("Roald Dahl");
			expect(result.error).toBeNull();
		});
	});
});
