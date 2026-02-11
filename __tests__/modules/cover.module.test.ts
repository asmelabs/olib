import { describe, expect, test } from "bun:test";
import { CoverModule, UrlBuilder } from "../../src/modules/cover.module";

describe("CoverModule", () => {
	describe("create", () => {
		test("returns CoverModule instance", () => {
			const module = CoverModule.create();
			expect(module).toBeInstanceOf(CoverModule);
		});
	});

	describe("author", () => {
		test("returns UrlBuilder for author key", () => {
			const module = CoverModule.create();
			const builder = module.author("OL34184A");
			expect(builder).toBeInstanceOf(UrlBuilder);
		});

		test("builds default author cover URL", () => {
			const module = CoverModule.create();
			const url = module.author("OL34184A").build();
			expect(url).toBe("https://covers.openlibrary.org/a/id/OL34184A-M.jpg");
		});
	});

	describe("book", () => {
		test("returns UrlBuilder for book key", () => {
			const module = CoverModule.create();
			const builder = module.book("OL45804W");
			expect(builder).toBeInstanceOf(UrlBuilder);
		});

		test("builds default book cover URL", () => {
			const module = CoverModule.create();
			const url = module.book("OL45804W").build();
			expect(url).toBe("https://covers.openlibrary.org/b/id/OL45804W-M.jpg");
		});
	});
});

describe("UrlBuilder", () => {
	describe("create", () => {
		test("creates builder with resource and key", () => {
			const builder = UrlBuilder.create("b", "OL45804W");
			expect(builder.build()).toBe(
				"https://covers.openlibrary.org/b/id/OL45804W-M.jpg",
			);
		});
	});

	describe("type", () => {
		test("changes key type to isbn", () => {
			const url = UrlBuilder.create("b", "0451526538").type("isbn").build();
			expect(url).toBe(
				"https://covers.openlibrary.org/b/isbn/0451526538-M.jpg",
			);
		});

		test("changes key type to oclc", () => {
			const url = UrlBuilder.create("b", "12345678").type("oclc").build();
			expect(url).toBe("https://covers.openlibrary.org/b/oclc/12345678-M.jpg");
		});

		test("changes key type to lccn", () => {
			const url = UrlBuilder.create("b", "12345678").type("lccn").build();
			expect(url).toBe("https://covers.openlibrary.org/b/lccn/12345678-M.jpg");
		});

		test("changes key type to olid", () => {
			const url = UrlBuilder.create("b", "OL45804W").type("olid").build();
			expect(url).toBe("https://covers.openlibrary.org/b/olid/OL45804W-M.jpg");
		});
	});

	describe("size", () => {
		test("changes size to S", () => {
			const url = UrlBuilder.create("b", "OL45804W").size("S").build();
			expect(url).toBe("https://covers.openlibrary.org/b/id/OL45804W-S.jpg");
		});

		test("changes size to L", () => {
			const url = UrlBuilder.create("b", "OL45804W").size("L").build();
			expect(url).toBe("https://covers.openlibrary.org/b/id/OL45804W-L.jpg");
		});

		test("keeps default size M when not specified", () => {
			const url = UrlBuilder.create("b", "OL45804W").build();
			expect(url).toContain("-M.jpg");
		});
	});

	describe("build", () => {
		test("returns null when key is empty string", () => {
			const url = UrlBuilder.create("b", "").build();
			expect(url).toBeNull();
		});

		test("accepts numeric key", () => {
			const url = UrlBuilder.create("b", 12345).build();
			expect(url).toBe("https://covers.openlibrary.org/b/id/12345-M.jpg");
		});

		test("chains type and size", () => {
			const url = UrlBuilder.create("b", "0451526538")
				.type("isbn")
				.size("L")
				.build();
			expect(url).toBe(
				"https://covers.openlibrary.org/b/isbn/0451526538-L.jpg",
			);
		});
	});
});
