/**
 * The main client for interacting with the Open Library API.
 *
 * @example
 * ```ts
 * import { OpenLibrary } from "@asmelabs/olib";
 *
 * const ol = new OpenLibrary();
 * const result = await ol.works.get("OL45804W");
 *
 * if (result.data) {
 *   console.log(result.data.title);
 * }
 * ```
 */
export class OpenLibrary {}
