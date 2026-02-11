import { describe, expect, test } from "bun:test";
import { err, type OLibError, ok, type Result } from "../src/result";

describe("result", () => {
	describe("ok", () => {
		test("wraps data with null error", () => {
			const result = ok("hello");

			expect(result.data).toBe("hello");
			expect(result.error).toBeNull();
		});

		test("works with objects", () => {
			const result = ok({ title: "Fantastic Mr Fox", key: "/works/OL45804W" });

			expect(result.data).toEqual({
				title: "Fantastic Mr Fox",
				key: "/works/OL45804W",
			});
			expect(result.error).toBeNull();
		});

		test("works with null data", () => {
			const result = ok(null);

			expect(result.data).toBeNull();
			expect(result.error).toBeNull();
		});
	});

	describe("err", () => {
		test("wraps error with null data", () => {
			const error: OLibError = {
				code: "NOT_FOUND",
				message: "Not found",
				status: 404,
			};
			const result = err(error);

			expect(result.data).toBeNull();
			expect(result.error).toEqual(error);
		});

		test("preserves cause", () => {
			const cause = new Error("network timeout");
			const result = err({
				code: "NETWORK_ERROR",
				message: "Failed to reach Open Library",
				cause,
			});

			expect(result.error?.cause).toBe(cause);
		});
	});

	describe("type narrowing", () => {
		test("narrows to success branch", () => {
			const result: Result<string> = ok("test");

			if (result.error === null) {
				// TypeScript should know data is string here
				expect(result.data.toUpperCase()).toBe("TEST");
			}
		});

		test("narrows to error branch", () => {
			const result: Result<string> = err({
				code: "SERVER_ERROR",
				message: "Internal error",
				status: 500,
			});

			if (result.data === null) {
				expect(result.error.code).toBe("SERVER_ERROR");
			}
		});
	});
});
