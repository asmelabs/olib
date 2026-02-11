import { AuthorModule } from "./modules/author.module";
import { CoverModule } from "./modules/cover.module";

/**
 * The main client for interacting with the Open Library API.
 *
 * @example
 * ```ts
 * import { createOpenLibraryClient } from "@asmelabs/olib";
 *
 * const ol = createOpenLibraryClient();
 * const author = await ol.authors.get("OL234664A");
 *
 * if(author.error) {
 *  // do something with the error
 *  return;
 * }
 *
 * console.log(author.data); // type safe author object
 * ```
 */
export class OpenLibrary {
	readonly authors: AuthorModule;
	readonly covers: CoverModule;

	static create(): OpenLibrary {
		return new OpenLibrary();
	}

	private constructor() {
		this.authors = AuthorModule.create();
		this.covers = CoverModule.create();
	}
}

export function createOpenLibraryClient(): OpenLibrary {
	return OpenLibrary.create();
}
