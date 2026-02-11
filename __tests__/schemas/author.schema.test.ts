import { describe, expect, test } from "bun:test";
import { authorSchema, querySchema } from "../../src/schemas/author.schema";

describe("schemas/author.schema", () => {
	describe("authorSchema", () => {
		test("parses minimal author with required fields only", () => {
			const result = authorSchema.parse({
				key: "/authors/OL34184A",
				name: "Roald Dahl",
				type: { key: "/type/author" },
			});

			expect(result).toEqual({
				key: "/authors/OL34184A",
				name: "Roald Dahl",
				type: { key: "/type/author" },
			});
		});

		test("parses author with type literal 'author'", () => {
			const result = authorSchema.parse({
				key: "/authors/OL123A",
				name: "Jane Doe",
				type: "author",
			});

			expect(result.type).toBe("author");
		});

		test("parses author with typed key object", () => {
			const result = authorSchema.parse({
				key: "/authors/OL34184A",
				name: "Roald Dahl",
				type: { key: "/type/author" },
			});

			expect(result.type).toEqual({ key: "/type/author" });
		});

		test("parses author with optional bio", () => {
			const result = authorSchema.parse({
				key: "/authors/OL34184A",
				name: "Roald Dahl",
				type: { key: "/type/author" },
				bio: "British novelist and poet.",
			});

			expect(result.bio).toBe("British novelist and poet.");
		});

		test("parses author with text-value bio object", () => {
			const result = authorSchema.parse({
				key: "/authors/OL34184A",
				name: "Roald Dahl",
				type: { key: "/type/author" },
				bio: { type: "/type/text", value: "British novelist." },
			});

			expect(result.bio).toBe("British novelist.");
		});

		test("parses author with alternate_names array", () => {
			const result = authorSchema.parse({
				key: "/authors/OL34184A",
				name: "Roald Dahl",
				type: { key: "/type/author" },
				alternate_names: ["R. Dahl", "Ronald Dahl"],
			});

			expect(result.alternate_names).toEqual(["R. Dahl", "Ronald Dahl"]);
		});

		test("parses author with links", () => {
			const result = authorSchema.parse({
				key: "/authors/OL34184A",
				name: "Roald Dahl",
				type: { key: "/type/author" },
				links: [
					{
						title: "Wikipedia",
						url: "https://en.wikipedia.org/wiki/Roald_Dahl",
					},
				],
			});

			expect(result.links).toBeDefined();
			expect(result.links).toHaveLength(1);
			expect(result.links?.[0]?.title).toBe("Wikipedia");
			expect(result.links?.[0]?.url).toContain("wikipedia");
		});

		test("rejects missing key", () => {
			expect(() =>
				authorSchema.parse({ name: "Roald Dahl", type: "/type/author" }),
			).toThrow();
		});

		test("rejects missing name", () => {
			expect(() =>
				authorSchema.parse({
					key: "/authors/OL34184A",
					type: "/type/author",
				}),
			).toThrow();
		});

		test("rejects missing type", () => {
			expect(() =>
				authorSchema.parse({
					key: "/authors/OL34184A",
					name: "Roald Dahl",
				}),
			).toThrow();
		});
	});

	describe("querySchema", () => {
		test("passes through string", () => {
			const result = querySchema.parse("Roald Dahl");
			expect(result).toBe("Roald Dahl");
		});

		test("trims whitespace", () => {
			const result = querySchema.parse("  Roald Dahl  ");
			expect(result).toBe("Roald Dahl");
		});

		test("accepts undefined for optional", () => {
			const result = querySchema.parse(undefined);
			expect(result).toBeUndefined();
		});

		test("rejects non-string", () => {
			expect(() => querySchema.parse(123)).toThrow();
			expect(() => querySchema.parse(null)).toThrow();
		});
	});
});
