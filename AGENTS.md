# AGENTS.md

This repo is the public Maxwell Young music website and release surface.

## Privacy

Tier: `sensitive`

Rules:

- Do not commit `.env`, OAuth secrets, database URLs, NextAuth secrets, Vercel files with private project IDs, or recovered environment material.
- Do not publish unreleased songs, private campaign material, or release assets unless Maxwell explicitly asks in the current run.
- Treat Liner as the artist/release source of truth; this repo owns the public web surface.

## Source Of Truth

- `README.md`
- `src/`
- `prisma/`
- `public/`

## Commands

```bash
pnpm lint
pnpm build
pnpm dev
```

## Operating Notes

- Verify env/deploy linkage before relying on production URLs.
- If recovered env files are involved, treat them as sensitive and rotate before production use.
- Keep public release pages aligned with Liner but avoid copying unreleased planning state into this repo.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
