# CLAUDE.md - AI Assistant Guide for Music Maxwell

This document provides comprehensive guidance for AI assistants working on the Music Maxwell codebase.

## Project Overview

Music Maxwell is a full-stack web application for music enthusiasts, built with Next.js 14, TypeScript, and React 18. It features a forum system, user authentication, e-commerce integration, and 3D visual elements.

**Repository:** `music_maxwell`
**Production URL:** `https://www.maxwellyoung.info`

## Technology Stack

### Core Framework
- **Next.js 14.2.1** with App Router
- **React 18.2.0**
- **TypeScript 5.4.2** (strict mode)

### Database & ORM
- **PostgreSQL** via Neon serverless
- **Prisma 5.10.2** (primary ORM)
- **Drizzle ORM** (secondary, for specific use cases)

### Authentication
- **NextAuth.js 4.24.11** with JWT strategy
- Google OAuth provider
- Email/password authentication with bcryptjs
- Optional Clerk integration

### Styling & UI
- **Tailwind CSS 3.4.1**
- **Radix UI** components (dialog, dropdown, select, toast, etc.)
- **shadcn/ui** component library
- **Framer Motion** and **Motion** for animations
- Custom CSS variables for theming (HSL color system)

### 3D Graphics
- **Three.js** + **React Three Fiber** + **Drei**

### External Services
- **Pusher** - Real-time messaging
- **Resend** / **Nodemailer** - Email services
- **Sanity CMS** - Content management
- **Shopify Buy SDK** - E-commerce
- **Uploadthing** - File uploads

### Package Manager
- **pnpm 9.1.1** (required)

## Project Structure

```
/src
├── /app                    # Next.js 14 App Router pages & API routes
│   ├── /api               # Backend API routes
│   │   ├── /auth          # Authentication endpoints
│   │   ├── /forum         # Forum CRUD (topics, replies, reports, search)
│   │   ├── /user          # User management
│   │   ├── /demos         # Demo/project management
│   │   └── /uploadthing   # File upload handler
│   ├── /admin             # Admin dashboard
│   ├── /auth/signin       # Sign-in page
│   ├── /forum             # Forum pages (list, topic view, new topic)
│   ├── /settings          # User settings
│   ├── /user/[username]   # User profiles (dynamic route)
│   └── layout.tsx         # Root layout
├── /components
│   ├── /ui                # shadcn/Radix UI components
│   ├── /auth              # Authentication components
│   ├── /forum             # Forum components
│   └── /providers         # Context providers
├── /lib
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client singleton
│   ├── email.ts           # Email service (nodemailer)
│   ├── rate-limit.ts      # Rate limiting utility
│   ├── pusherServer.ts    # Pusher server-side
│   ├── pusherClient.ts    # Pusher client-side
│   ├── sanity.ts          # Sanity CMS client
│   └── shopify.ts         # Shopify client
├── /emails                # React Email templates
├── /hooks                 # Custom React hooks
├── /types                 # TypeScript type definitions
├── middleware.ts          # Next.js auth middleware
└── env.js                 # Environment validation (Zod)

/prisma
└── schema.prisma          # Database schema
```

## Development Commands

```bash
# Install dependencies (always use pnpm)
pnpm install

# Run development server
pnpm dev

# Build for production (runs prisma generate first)
pnpm build

# Run linting
pnpm lint

# Start production server
pnpm start

# Prisma commands
pnpm prisma migrate dev     # Run migrations in development
pnpm prisma generate        # Generate Prisma client
pnpm prisma studio          # Open Prisma Studio GUI
```

## Environment Variables

### Required Variables
```env
DATABASE_URL="postgresql://..."      # PostgreSQL connection string
NEXTAUTH_URL="http://localhost:3000" # Base URL (use production URL in prod)
NEXTAUTH_SECRET="..."                # Generate with: openssl rand -base64 32
GOOGLE_CLIENT_ID="..."               # Google OAuth client ID
GOOGLE_CLIENT_SECRET="..."           # Google OAuth client secret
```

### Optional Variables (Service-Specific)
```env
# Sanity CMS
SANITY_API_TOKEN="..."
NEXT_PUBLIC_SANITY_PROJECT_ID="..."
NEXT_PUBLIC_SANITY_DATASET="..."
NEXT_PUBLIC_SANITY_API_VERSION="..."

# Email (Resend)
RESEND_API_KEY="..."
RESEND_SENDER="..."

# Email (SMTP fallback)
SMTP_HOST="..."
SMTP_PORT="..."
SMTP_USER="..."
SMTP_PASSWORD="..."
SMTP_FROM="..."

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN="..."
NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN="..."

# App URL
NEXT_PUBLIC_APP_URL="..."
```

Use `SKIP_ENV_VALIDATION=true` to skip validation during Docker builds.

## Database Schema

### Key Models

**User** - Core user model with OAuth and password support
- `id`, `email` (unique), `username` (unique), `name`, `image`, `bio`
- `role` (default: "user", can be "admin")
- `password` (optional, for local auth)
- `needsUserName` (flag for OAuth flow)
- Relations: topics, replies, reports, sessions, accounts, resetTokens

**Topic** - Forum topics
- `id`, `title`, `content`, `authorId`, timestamps
- Relations: author (User), replies

**Reply** - Forum replies
- `id`, `content`, `authorId`, `topicId`, timestamps
- Relations: author (User), topic, reports

**Demo** - Project/demo entries
- `id`, `title`, `description`, `link`, `status`
- Relations: comments

## Authentication Flow

1. **OAuth (Google)**: User signs in → account created → redirected to `/choose-username` if `needsUserName` is true
2. **Password Auth**: Standard email/password with bcrypt hashing
3. **Password Reset**: Token-based with 30-minute expiry, sent via email
4. **Session**: JWT-based, stored in cookies

### Protected Routes (via middleware)
- `/forum/new` - Create topic
- `/forum/:path*/edit` - Edit topic
- `/forum/:path*/delete` - Delete topic
- `/api/forum/*` - All forum API endpoints

Sign-in page: `/auth/signin`

## API Patterns

### Route Handler Structure
```typescript
// src/app/api/example/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... handler logic
}

export async function POST(req: Request) {
  // ... handler logic
}
```

### Common API Headers
```typescript
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
```

### Authorization Patterns
- Check `session.user.role === "admin"` for admin-only actions
- Check `session.user.id === resource.authorId` for author-only actions
- Use `getServerSession(authOptions)` in all protected routes

## Code Conventions

### File Naming
- Components: `PascalCase.tsx` (e.g., `Navbar.tsx`, `ForumTopicsInfinite.tsx`)
- Utilities: `camelCase.ts` (e.g., `useDebounce.ts`, `rate-limit.ts`)
- Page routes: lowercase directories

### Import Aliases
Use `~/` for imports from `src/`:
```typescript
import { prisma } from "~/lib/prisma";
import { Button } from "~/components/ui/button";
```

### Component Patterns
```typescript
// Client component (interactive)
"use client";

import { useState } from "react";

export function MyComponent() {
  // ...
}

// Server component (default in Next.js 14 App Router)
export default async function MyPage() {
  // Can use async/await, fetch data directly
}
```

### TypeScript
- Strict mode enabled
- Use explicit types for function parameters and return values
- Use Zod for runtime validation (especially environment variables)

### Styling
- Tailwind CSS utility classes
- Use `cn()` utility for conditional classes (from `~/lib/utils`)
- CSS Modules for component-specific styles when needed

## Real-Time Features

Forum uses Pusher for real-time updates:
```typescript
// Server-side: broadcast new topic
import { pusherServer } from "~/lib/pusherServer";
await pusherServer.trigger("forum", "new-topic", { topic });

// Client-side: subscribe
import { subscribeToForumTopics } from "~/lib/pusherClient";
subscribeToForumTopics((topic) => {
  // Handle new topic
});
```

## Rate Limiting

The forum has rate limiting on replies:
- 1 reply per 10 seconds per user
- Uses LRU cache for production-grade limiting
- Located in `src/lib/rate-limit.ts`

## Content Moderation

Forum content is filtered for banned words before saving:
- Check happens in API route handlers
- Returns 400 error with message if content contains banned words

## Testing

**Note:** No testing framework is currently configured. When adding tests:
- Consider Jest or Vitest
- Use React Testing Library for components
- Test API routes with supertest or similar

## Common Tasks

### Adding a New API Route
1. Create route file in `src/app/api/[route]/route.ts`
2. Export HTTP method handlers (GET, POST, etc.)
3. Add authentication check with `getServerSession(authOptions)`
4. Use Prisma for database operations

### Adding a New Page
1. Create directory in `src/app/[page-name]/`
2. Add `page.tsx` for the page component
3. Add `layout.tsx` if custom layout needed
4. Use server components by default, add `"use client"` only if needed

### Modifying Database Schema
1. Edit `prisma/schema.prisma`
2. Run `pnpm prisma migrate dev --name migration_name`
3. Run `pnpm prisma generate` to update client

### Adding a New UI Component
1. Use shadcn/ui CLI when possible: `pnpm dlx shadcn-ui@latest add [component]`
2. Components go in `src/components/ui/`
3. Follow existing patterns for variants using `class-variance-authority`

## Deployment

Optimized for **Vercel** deployment:
- Environment variables must be set in Vercel dashboard
- Prisma client generates during build (`prisma generate && next build`)
- Image optimization configured for Vercel Blob, Sanity CDN, YouTube

### Image Remote Patterns
Allowed domains for `next/image`:
- `hebbkx1anhila5yf.public.blob.vercel-storage.com`
- `cdn.sanity.io`
- `img.youtube.com`

## Troubleshooting

### Common Issues

**Prisma client not found:**
```bash
pnpm prisma generate
```

**Port 3000 in use:**
Next.js automatically tries 3001, 3002, etc.

**Environment validation errors:**
- Ensure all required variables are set
- Use `SKIP_ENV_VALIDATION=true` for Docker builds

**Auth redirect issues:**
- Verify `NEXTAUTH_URL` matches your domain
- Check callback URLs in Google Cloud Console

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth configuration |
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/middleware.ts` | Route protection |
| `src/env.js` | Environment validation |
| `prisma/schema.prisma` | Database schema |
| `next.config.js` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
