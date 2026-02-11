/** biome-ignore-all lint/suspicious/noExplicitAny: Mocking globalThis.fetch requires `any` casts because Bun's Mock type doesn't satisfy the full fetch signature. */
import { afterEach, describe, expect, mock, test } from "bun:test";
import { AuthorModule } from "../../src/modules/author.module";

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

describe("AuthorModule", () => {
	describe("create", () => {
		test("returns AuthorModule instance", () => {
			const module = AuthorModule.create();
			expect(module).toBeInstanceOf(AuthorModule);
		});
	});

	describe("search", () => {
		test("returns empty result when query is empty string", async () => {
			const module = AuthorModule.create();
			const result = await module.search("");

			expect(result.data).toEqual({
				start: 0,
				numFound: 0,
				numFoundExact: false,
				docs: [],
			});
			expect(result.error).toBeNull();
		});

		test("returns empty result when query is only whitespace", async () => {
			const module = AuthorModule.create();
			const result = await module.search("   ");

			expect(result.data).toEqual({
				start: 0,
				numFound: 0,
				numFoundExact: false,
				docs: [],
			});
			expect(result.error).toBeNull();
		});

		test("calls fetchJson with correct path and params", async () => {
			let capturedUrl = "";
			globalThis.fetch = mock((input: URL | string) => {
				capturedUrl = input.toString();
				return Promise.resolve({
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
				} as Response);
			}) as any;

			const module = AuthorModule.create();
			const result = await module.search("Roald Dahl");

			expect(capturedUrl).toContain("/search/authors.json");
			expect(capturedUrl).toContain("q=Roald+Dahl");
			expect(result.data?.docs).toHaveLength(1);
			expect(result.data?.docs[0]?.name).toBe("Roald Dahl");
			expect(result.error).toBeNull();
		});

		test("passes limit and offset to search", async () => {
			let capturedUrl = "";
			globalThis.fetch = mock((input: URL | string) => {
				capturedUrl = input.toString();
				return Promise.resolve({
					ok: true,
					status: 200,
					json: () =>
						Promise.resolve({
							start: 10,
							numFound: 0,
							numFoundExact: false,
							docs: [],
						}),
				} as Response);
			}) as any;

			const module = AuthorModule.create();
			await module.search("test", { limit: 25, offset: 10 });

			expect(capturedUrl).toContain("limit=25");
			expect(capturedUrl).toContain("offset=10");
		});

		test("uses default limit and offset when input is empty", async () => {
			let capturedUrl = "";
			globalThis.fetch = mock((input: URL | string) => {
				capturedUrl = input.toString();
				return Promise.resolve({
					ok: true,
					status: 200,
					json: () =>
						Promise.resolve({
							start: 0,
							numFound: 0,
							numFoundExact: false,
							docs: [],
						}),
				} as Response);
			}) as any;

			const module = AuthorModule.create();
			await module.search("test");

			expect(capturedUrl).toContain("limit=100");
			expect(capturedUrl).toContain("offset=0");
		});

		test("propagates fetch errors", async () => {
			mockFetch({ ok: false, status: 404 });

			const module = AuthorModule.create();
			const result = await module.search("Roald Dahl");

			expect(result.data).toBeNull();
			expect(result.error?.code).toBe("NOT_FOUND");
		});
	});

	describe("get", () => {
		test("returns author when key is valid", async () => {
			mockFetch({
				ok: true,
				status: 200,
				json: () =>
					Promise.resolve({
						key: "/authors/OL34184A",
						name: "Roald Dahl",
						type: { key: "/type/author" },
					}),
			});

			const module = AuthorModule.create();
			const result = await module.get("OL34184A");

			expect(result.data?.key).toBe("/authors/OL34184A");
			expect(result.data?.name).toBe("Roald Dahl");
			expect(result.error).toBeNull();
		});

		test("accepts full key path", async () => {
			let capturedUrl = "";
			globalThis.fetch = mock((input: URL | string) => {
				capturedUrl = input.toString();
				return Promise.resolve({
					ok: true,
					status: 200,
					json: () =>
						Promise.resolve({
							key: "/authors/OL34184A",
							name: "Roald Dahl",
							type: { key: "/type/author" },
						}),
				} as Response);
			}) as any;

			const module = AuthorModule.create();
			await module.get("/authors/OL34184A");

			expect(capturedUrl).toContain("/authors/OL34184A.json");
		});

		test("propagates 404 error", async () => {
			mockFetch({ ok: false, status: 404 });

			const module = AuthorModule.create();
			const result = await module.get("OL99999999A");

			expect(result.data).toBeNull();
			expect(result.error?.code).toBe("NOT_FOUND");
		});
	});
});
