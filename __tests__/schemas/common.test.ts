import { describe, expect, test } from "bun:test";
import {
	datetimeValueSchema,
	linkSchema,
	textValueSchema,
	typedKeySchema,
} from "../../src/schemas/common";

describe("schemas/common", () => {
	describe("textValueSchema", () => {
		test("passes through plain string", () => {
			const result = textValueSchema.parse("A simple description");

			expect(result).toBe("A simple description");
		});

		test("extracts value from { type, value } object", () => {
			const result = textValueSchema.parse({
				type: "/type/text",
				value:
					"The main character of Fantastic Mr. Fox is an extremely clever fox.",
			});

			expect(result).toBe(
				"The main character of Fantastic Mr. Fox is an extremely clever fox.",
			);
		});

		test("handles empty string", () => {
			const result = textValueSchema.parse("");

			expect(result).toBe("");
		});

		test("handles empty value in object", () => {
			const result = textValueSchema.parse({ type: "/type/text", value: "" });

			expect(result).toBe("");
		});

		test("rejects invalid types", () => {
			expect(() => textValueSchema.parse(42)).toThrow();
			expect(() => textValueSchema.parse(null)).toThrow();
			expect(() => textValueSchema.parse({ value: "missing type" })).toThrow();
		});
	});

	describe("datetimeValueSchema", () => {
		test("extracts value from datetime object", () => {
			const result = datetimeValueSchema.parse({
				type: "/type/datetime",
				value: "2009-10-15T11:34:21.437031",
			});

			expect(result).toBe("2009-10-15T11:34:21.437031");
		});

		test("rejects plain string", () => {
			expect(() =>
				datetimeValueSchema.parse("2009-10-15T11:34:21.437031"),
			).toThrow();
		});

		test("rejects missing value", () => {
			expect(() =>
				datetimeValueSchema.parse({ type: "/type/datetime" }),
			).toThrow();
		});
	});

	describe("typedKeySchema", () => {
		test("parses a key reference", () => {
			const result = typedKeySchema.parse({ key: "/authors/OL34184A" });

			expect(result).toEqual({ key: "/authors/OL34184A" });
		});

		test("rejects missing key", () => {
			expect(() => typedKeySchema.parse({})).toThrow();
		});

		test("rejects non-object", () => {
			expect(() => typedKeySchema.parse("/authors/OL34184A")).toThrow();
		});
	});

	describe("linkSchema", () => {
		test("parses link with type", () => {
			const result = linkSchema.parse({
				title: "Official Site",
				url: "http://www.jkrowling.com/",
				type: { key: "/type/link" },
			});

			expect(result).toEqual({
				title: "Official Site",
				url: "http://www.jkrowling.com/",
				type: { key: "/type/link" },
			});
		});

		test("parses link without type", () => {
			const result = linkSchema.parse({
				title: "Wikipedia",
				url: "https://en.wikipedia.org/wiki/J._K._Rowling",
			});

			expect(result).toEqual({
				title: "Wikipedia",
				url: "https://en.wikipedia.org/wiki/J._K._Rowling",
			});
		});

		test("rejects missing title", () => {
			expect(() => linkSchema.parse({ url: "http://example.com" })).toThrow();
		});

		test("rejects missing url", () => {
			expect(() => linkSchema.parse({ title: "Example" })).toThrow();
		});
	});
});
