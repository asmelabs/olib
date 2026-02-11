import { describe, expect, test } from "bun:test";
import {
	authorGetInputSchema,
	authorGetOutputSchema,
	authorSearchInputSchema,
	authorSearchOutputSchema,
} from "../../src/schemas/author-services.schema";

describe("schemas/author-services.schema", () => {
	describe("authorSearchInputSchema", () => {
		test("parses with default limit and offset", () => {
			const result = authorSearchInputSchema.parse({});

			expect(result.limit).toBe(100);
			expect(result.offset).toBe(0);
		});

		test("parses custom limit and offset", () => {
			const result = authorSearchInputSchema.parse({
				limit: 50,
				offset: 10,
			});

			expect(result.limit).toBe(50);
			expect(result.offset).toBe(10);
		});

		test("rejects limit below 1", () => {
			expect(() => authorSearchInputSchema.parse({ limit: 0 })).toThrow();
		});

		test("rejects limit above 1000", () => {
			expect(() => authorSearchInputSchema.parse({ limit: 1001 })).toThrow();
		});

		test("rejects negative offset", () => {
			expect(() => authorSearchInputSchema.parse({ offset: -1 })).toThrow();
		});
	});

	describe("authorSearchOutputSchema", () => {
		test("parses search response with docs array", () => {
			const result = authorSearchOutputSchema.parse({
				start: 0,
				numFound: 2,
				numFoundExact: true,
				docs: [
					{
						key: "/authors/OL34184A",
						name: "Roald Dahl",
						type: { key: "/type/author" },
					},
					{
						key: "/authors/OL123A",
						name: "Jane Doe",
						type: "author",
					},
				],
			});

			expect(result.start).toBe(0);
			expect(result.numFound).toBe(2);
			expect(result.numFoundExact).toBe(true);
			expect(result.docs).toHaveLength(2);
			expect(result.docs[0]?.key).toBe("/authors/OL34184A");
			expect(result.docs[0]?.name).toBe("Roald Dahl");
		});

		test("parses empty docs array", () => {
			const result = authorSearchOutputSchema.parse({
				start: 0,
				numFound: 0,
				numFoundExact: false,
				docs: [],
			});

			expect(result.docs).toEqual([]);
			expect(result.numFound).toBe(0);
		});

		test("rejects invalid docs structure", () => {
			expect(() =>
				authorSearchOutputSchema.parse({
					start: 0,
					numFound: 0,
					numFoundExact: false,
					docs: [{ invalid: "author" }],
				}),
			).toThrow();
		});

		test("rejects missing required fields", () => {
			expect(() =>
				authorSearchOutputSchema.parse({
					start: 0,
					numFound: 0,
				}),
			).toThrow();
		});
	});

	describe("authorGetInputSchema", () => {
		test("parses author key with OL prefix", () => {
			const result = authorGetInputSchema.parse("OL34184A");
			expect(result).toBe("OL34184A");
		});

		test("parses full key path", () => {
			const result = authorGetInputSchema.parse("/authors/OL34184A");
			expect(result).toBe("/authors/OL34184A");
		});

		test("trims whitespace", () => {
			const result = authorGetInputSchema.parse("  OL34184A  ");
			expect(result).toBe("OL34184A");
		});

		test("rejects non-string", () => {
			expect(() => authorGetInputSchema.parse(123)).toThrow();
			expect(() => authorGetInputSchema.parse(null)).toThrow();
		});
	});

	describe("authorGetOutputSchema", () => {
		test("parses author object same as authorSchema", () => {
			const result = authorGetOutputSchema.parse({
				key: "/authors/OL34184A",
				name: "Roald Dahl",
				type: { key: "/type/author" },
			});

			expect(result.key).toBe("/authors/OL34184A");
			expect(result.name).toBe("Roald Dahl");
			expect(result.type).toEqual({ key: "/type/author" });
		});
	});
});
