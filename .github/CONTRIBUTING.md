# Contributing to @asmelabs/olib

Thanks for your interest in contributing! This guide will help you get set up and familiar with our workflow.

## Prerequisites

Before you begin, make sure you have the following installed:

- **[Bun](https://bun.sh)** (v1.1+) — We use Bun as our runtime, package manager, test runner, and bundler.
- **[Git](https://git-scm.com)** (v2.30+)
- **[Node.js](https://nodejs.org)** (v18+) — Not strictly required if you only use Bun, but useful for testing cross-runtime compatibility.
- A **GitHub account** for forking, issues, and pull requests.

## Getting Started

### 1. Fork and clone

```bash
git clone https://github.com/<your-username>/olib.git
cd olib
```

### 2. Install dependencies

```bash
bun install
```

### 3. Verify everything works

```bash
bun test
bun run lint
bun run build
```

If all three pass, you're good to go.

## Project Structure

```
olib/
├── src/
│   ├── client.ts          # Main OpenLibrary client
│   ├── schemas/           # Zod schemas for API responses
│   ├── endpoints/         # Endpoint modules (works, editions, authors, etc.)
│   ├── types/             # Exported TypeScript types (inferred from Zod)
│   └── utils/             # Shared helpers (URL builders, normalizers)
├── tests/                 # Test files
├── .github/               # CI, issue templates, PR template
├── package.json
├── tsconfig.json
└── README.md
```

## Development Workflow

### Branching

Create a branch from `main` for your work:

```bash
git checkout -b feat/search-pagination
```

Use prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`.

### Making Changes

1. Write or update code in `src/`.
2. Add or update Zod schemas in `src/schemas/` if the change involves API response types.
3. Add tests in `tests/` for any new or changed behavior.
4. Run the checks:

```bash
bun test           # Run tests
bun run lint       # Lint with Biome
bun run format     # Format with Biome
bun run typecheck  # Type check with tsc
```

### Commits

Write clear, concise commit messages. We follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add pagination support to search endpoint
fix: normalize polymorphic description field
docs: add examples for covers API
chore: update dev dependencies
```

### Submitting a PR

1. Push your branch and open a Pull Request against `main`.
2. Fill in the PR template.
3. Make sure CI passes.
4. A maintainer will review your PR. Be open to feedback — we keep reviews constructive and respectful.

## Reporting Issues

Found a bug or have a feature idea? [Open an issue](https://github.com/asmelabs/olib/issues/new/choose) and pick the appropriate template.

When reporting a bug, please include:

- What you expected to happen
- What actually happened
- A minimal code snippet to reproduce
- Your runtime and version (e.g. Bun 1.1.38, Node 22.1.0)

## Adding a New Endpoint

If you're adding support for a new Open Library API endpoint:

1. **Research the endpoint.** Hit it with real requests. Document the actual response shape — don't trust the docs blindly.
2. **Create the Zod schema** in `src/schemas/`. Handle optional fields and polymorphic types (e.g. `description` can be a string or `{ type, value }`).
3. **Create the endpoint module** in `src/endpoints/`.
4. **Wire it into the client** in `src/client.ts`.
5. **Write tests** that validate against realistic response fixtures.
6. **Update the README** API coverage table.

## Code Style

- We use **[Biome](https://biomejs.dev)** for linting and formatting. No ESLint/Prettier.
- Run `bun run format` before committing. CI will catch unformatted code.
- Use explicit types for public API surfaces. Prefer Zod inference (`z.infer<typeof schema>`) for internal types.
- Keep files focused. One endpoint module per file, one schema file per API resource.

## Code of Conduct

We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Be kind, be respectful, be constructive.

## Questions?

If something is unclear, feel free to open a [discussion](https://github.com/asmelabs/olib/discussions) or reach out by opening an issue. We're happy to help.
