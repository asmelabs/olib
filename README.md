# @asmelabs/olib

A type-safe TypeScript SDK for the [Open Library API](https://openlibrary.org/developers/api).

> **Status:** Work in progress 🚧

## Why?

Open Library is an incredible open-source project — a free, editable catalog aiming to have one web page for every book ever published. But working with its API in TypeScript is painful:

- **No type safety.** Response shapes are undocumented, inconsistent, and polymorphic. A `description` field might be a `string` or `{ type: string; value: string }`. Good luck.
- **No official TypeScript SDK.** There's a Python client, but nothing for the JS/TS ecosystem.
- **Verbose and scattered docs.** You end up reading source code to understand what you'll actually get back.

`@asmelabs/olib` fixes all of that — Zod-validated responses, normalized types, and a clean API surface.

## Install

```bash
# bun
bun add @asmelabs/olib

# npm
npm install @asmelabs/olib

# yarn
yarn add @asmelabs/olib

# pnpm
pnpm add @asmelabs/olib
```

## Quick Start

```ts
import { createOlibClien } from "@asmelabs/olib";

const ol = createOlibClien();

// Search for books
const results = await ol.search("Fantastic Mr Fox");

// Get a work by its Open Library ID
const work = await ol.works.get("OL45804W");

// Get an edition by ISBN
const edition = await ol.editions.getByISBN("9780140328721");

// Get an author
const author = await ol.authors.get("OL34184A");

// Build a cover image URL
const coverUrl = ol.covers.book("9780140328721", "isbn", "M");
// => "https://covers.openlibrary.org/b/isbn/9780140328721-M.jpg"
```

## Features

- 🔒 **Type-safe** — Full TypeScript types for all endpoints, powered by Zod schemas
- ✅ **Runtime validation** — Responses are parsed and validated at runtime, not just at compile time
- 🌐 **Universal** — Works in Node.js, Bun, Deno, and browsers (uses `fetch`)
- 📦 **Tree-shakeable** — ESM-first, import only what you need
- 🧩 **Normalized responses** — Polymorphic fields like `description` are normalized to consistent types
- 📖 **Covers helper** — URL builder for book covers and author photos without extra API calls

## API Coverage

| Module       | Endpoints                                | Status |
| ------------ | ---------------------------------------- | ------ |
| **Search**   | Books, Authors, Subjects                 | ✅     |
| **Works**    | Get, Editions, Ratings, Bookshelves      | ✅     |
| **Editions** | Get, by ISBN                             | ✅     |
| **Authors**  | Get, Works                               | ✅     |
| **Covers**   | Book covers, Author photos (URL builder) | ✅     |
| **Subjects** | Get                                      | ✅     |

## Docs

→ Full documentation coming soon.

## Requirements

- TypeScript ≥ 5.0
- A `fetch`-compatible runtime (Node 18+, Bun, Deno, modern browsers)

## Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) before submitting a PR.

## License

[MIT](./LICENSE)

## Credits

Built and maintained by Asme Labs.

Open Library is a project of the [Internet Archive](https://archive.org), a 501(c)(3) non-profit.
