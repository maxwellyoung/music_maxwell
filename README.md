# Music Maxwell

Public music archive and release surface for Maxwell Young.

The public hierarchy is deliberately simple: a calm release archive, factual artefact sheets, and a small number of release worlds with song-specific interactions.

## What it demonstrates

- Next.js app structure for a real personal/music product.
- A typed release catalogue for archive, sheet, room, metadata, and sitemap identity.
- Public artwork, lyrics, credits, films, audio excerpts, and verified listening links.
- Bespoke worlds for 1kiss, Turn It Up, and Wintour.
- Optional account and listener-note foundations kept outside the primary archive path.

## Tech stack

- Next.js
- TypeScript
- Prisma
- NextAuth
- Tailwind CSS
- Radix UI
- Vercel Analytics

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/maxwellyoung/music_maxwell.git
cd music_maxwell
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the project root with the following variables:

```env
# NextAuth
NEXTAUTH_URL="https://www.maxwellyoung.info" # or your local URL for development
NEXTAUTH_SECRET="your_generated_secret_here"

# Database
DATABASE_URL="your_database_url_here"

# Google OAuth (required if using Google login)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

- To generate a secret, run: `openssl rand -base64 32`
- For local development, set `NEXTAUTH_URL="http://localhost:3000"`
- If you are not using Google login, set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to dummy values (e.g., `dummy`)

### 4. Set up the database

If using Prisma:

```bash
pnpm prisma migrate dev
```

### 5. Run the development server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) (or another port if 3000 is in use).

### 6. Run the release gate

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## Deployment

- Set all required environment variables in your deployment platform (e.g., Vercel).
- Make sure `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` are set for production.
- Redeploy after making changes to environment variables.
- Deploy only from a committed, clean branch that reproduces the public build.

## Troubleshooting

- **Port in use:** If port 3000 is busy, Next.js will try 3001, 3002, etc.
- **Invalid environment variables:** Make sure all required variables are set and not empty.
- **Static file 404s:** Ensure your `public` directory contains all referenced assets.
- **Prisma errors:** Run `pnpm prisma generate` if you see missing Prisma client errors.

## License

MIT
