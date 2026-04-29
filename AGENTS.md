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
