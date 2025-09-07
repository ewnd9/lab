# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Main points

- use yarn
- use typescript
- write tests
- never cast to `any` or `unknown`

## Quality Assurance

- Only run `yarn typecheck`, never `yarn build` (it's slow)

## Preferred libraries

- `axios` for web requests
- `zod` to validate data
- `tsyringe` for dependency injection
  - never use "@inject" decorator as we only use classes

## Conventions

- Always use `kebab-case`, even for React components

## Common Development Commands

### Root workspace commands:
- `yarn dev` - Start the Next.js web application in development mode
- `yarn cli:scrape` - Build and run CLI scraper (creates saved.json)
- `yarn cli:upload` - Build and upload scraped data to web API
- `yarn lint` - Run Biome formatter/linter with auto-fix
- `yarn prepare` - Install husky hooks

### CLI package (`packages/cli/`):
- `yarn workspace @instagram-scraper/cli build` - Compile TypeScript to dist/
- `yarn workspace @instagram-scraper/cli typecheck` - Type checking only
- `yarn workspace @instagram-scraper/cli start` - Run compiled CLI
- `yarn workspace @instagram-scraper/cli dev` - Build and run CLI

### Web package (`packages/web/`):
- `yarn workspace web dev` - Start Next.js dev server with Turbo
- `yarn workspace web build` - Production build
- `yarn workspace web typecheck` - Type checking only
- `yarn workspace web db:push` - Push schema to database
- `yarn workspace web db:generate` - Generate migrations
- `yarn workspace web db:migrate` - Apply migrations
- `yarn workspace web db:studio` - Open Drizzle Studio

## Project Architecture

This is a yarn workspace monorepo with two packages that work together:

### `packages/cli/` - Instagram Scraper CLI
- **Purpose**: Scrapes Instagram saved collections using Playwright
- **Key files**:
  - `src/index.ts` - Main CLI entry point with scrape/upload modes
  - `src/auth.ts` - Instagram authentication via Playwright
  - `src/scraper.ts` - Collection scraping logic
  - `src/uploader.ts` - API upload functionality
  - `src/env.ts` - Environment validation with Zod
- **Dependencies**: Playwright, node-fetch, zod, dotenv
- **Usage**: Requires `.env` with INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD, WEB_API

### `packages/web/` - Next.js Web Application
- **Stack**: T3 Stack (Next.js + tRPC + Drizzle ORM + PostgreSQL)
- **Key architecture**:
  - `src/server/db/schema.ts` - Database schema with collections, posts, profiles tables
  - `src/server/api/` - tRPC routers for type-safe API endpoints
  - `src/server/queue/` - pg-boss job queue for background processing
  - `src/pages/api/collections/import.ts` - REST endpoint for CLI data import
  - `src/components/` - React components using kebab-case naming
- **Database relations**: Collections → Posts → Profiles with proper foreign keys
- **Dependencies**: Next.js, tRPC, Drizzle ORM, pg-boss, Tailwind CSS, axios

## Environment Setup

### CLI Configuration (`packages/cli/.env`):
```env
INSTAGRAM_USERNAME=your_username
INSTAGRAM_PASSWORD=your_password
WEB_API=https://path-to-deployed-web-image
HEADLESS=true  # Set to false for debugging
```

### Web Configuration (`packages/web/.env`):
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database
```

## Data Flow Architecture

1. **CLI scrapes Instagram** → saves to `saved.json` with schema validation
2. **CLI uploads data** → POST to `/api/collections/import` on web app
3. **Web app imports** → stores in PostgreSQL via Drizzle ORM
4. **Background jobs** → parse Instagram post details via pg-boss queue
5. **Web UI displays** → collections and posts via tRPC API

## Development Tools

- **Linting**: Biome (replaces ESLint + Prettier)
- **Type checking**: TypeScript with strict mode
- **Build system**: Turbo for monorepo orchestration
- **Database**: Drizzle Kit for migrations and schema management
- **Queue**: pg-boss for background job processing
- **Git hooks**: Husky with lint-staged for pre-commit validation
