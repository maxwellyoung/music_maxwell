# Music Maxwell — working guide

Read AGENTS.md first. This repository owns Maxwell Young's public music website; Liner owns artist and release planning. Never copy unreleased material or secrets into this public repository.

## Current architecture

- Next.js 16 App Router, React 19, TypeScript 6, Tailwind CSS 4.
- Node 24 and pnpm 9.1.1, pinned in package.json. Use the existing pnpm lockfile.
- Prisma 6 with PostgreSQL; NextAuth 4 with Google OAuth and JWT sessions.
- `/` is the editorial release archive; `/r/[slug]` is the canonical release sheet.
- `/forum` is the listener town square. Account/classic pages retain the older site chrome.
- Campaign paths including `/1kiss`, `/wintour`, and `/turn-it-up` redirect to canonical release sheets. Do not restore campaign rooms merely because their old components remain in the tree.
- `src/data/releases.ts` is the canonical public catalogue. Server pages project homepage data through `summarizeRelease`; do not import the full catalogue into the homepage client component.
- Account providers and toast UI live in forum/chrome layouts. Keep the public archive and release sheets free of session fetching.
- `src/lib/ledgerPlayer.ts` owns explicit playback and subscribable snapshots. Hover, focus, and navigation never start music. Leaving an excerpt control stops its source. Only a user play action may start or resume it.
- Decoration must stop working when hidden or quiet. Reduced motion uses a still monument and no audio bloom.

## Verification

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm audit:quiz
pnpm typecheck
pnpm lint
pnpm build
# All release checks together:
pnpm release:check
```

Tests use the Node test runner and native TypeScript stripping. Catalogue tests check public identity, metadata helpers and lyric timelines; quiz tests cover selection/scoring; player tests cover snapshots, explicit playback, stop ownership, races and failures. Verify actual rendered behavior in a browser as well, especially media controls, navigation, phone layouts and both color schemes. Test rich notes without posting into the live database.

CI uses Node 24, runs tests/typecheck/lint/build and audits production dependencies. Its build uses dummy local database/auth settings, not production credentials. A successful build does not prove live database/auth behavior.

## Files and conventions

- `src/app/(ledger)/`: archive, releases, forum and exploratory layouts.
- `src/app/(chrome)/`: classic shell and account surfaces.
- `src/components/`: React components; PascalCase filenames.
- `src/lib/`: data boundaries, authentication, database and media utilities.
- `src/styles/globals.css`: shared styles and ledger palette. Use `--ledger-secondary` for quiet but readable text; low-opacity rules are decorative only.
- `prisma/schema.prisma`: database schema.
- `next.config.js`: redirects, security headers, image configuration.
- Use `~/` imports in application code. Relative `.ts` imports are used by Node tests and their pure utility dependencies.
- Read installed Next documentation in `node_modules/next/dist/docs/` before framework changes.

## Authentication and data

Google is the configured sign-in provider. Legacy password/reset APIs remain; do not assume a password login provider is enabled. Protected writes require server-side session and ownership/admin checks, Zod validation, and bounded input. Keep credentials, tokens and full private error objects out of logs.

Public text is rendered as React text, not raw HTML. Media embeds are block elements; never place them inside paragraph tags. Preserve iframe titles, lazy loading, safe URLs, and link `rel` attributes.

## Deployment

Vercel project: music_maxwell. Verify the configured project and domain before relying on production linkage. Deploy from reviewed, committed source after release checks. Production deployment requires Maxwell's explicit instruction in the current run. That instruction does not authorize unrelated messages, payments, or release publication.

Never commit `.env` files, `.vercel` linkage, credentials, or private task reports. Local reports belong under ignored `outputs/`. Never use recovered credentials for production without resolving their provenance and rotation requirement.
