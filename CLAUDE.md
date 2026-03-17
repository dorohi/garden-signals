# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dacha Care is a garden/plant care management app for dacha (country house) gardening. It tracks plants, care schedules, diseases, pests, fertilizers, and treatments. Content is in Russian; code is in English.

## Monorepo Structure

pnpm workspace with 4 packages under `packages/`:

- **shared** — TypeScript types and enums shared between client and server. No build step; consumed directly via `src/index.ts`. Enums live in `src/constants/index.ts`, types in `src/types/`.
- **db** — Prisma schema (`prisma/schema.prisma`) and seed data (`prisma/seed-data/`). SQLite database. No runtime exports — just Prisma tooling.
- **server** — Express REST API (`tsx watch` for dev). Routes in `src/api/routes/`. JWT auth via Bearer token. Public routes: auth, catalog, diseases, pests, fertilizers, treatments, regions. Protected routes: profile, gardens, plants, schedules, calendar, notifications.
- **client** — React 19 + Vite SPA. MUI for UI, MobX for state management. Vite proxies `/api` to the server at port 3001.

## Common Commands

```bash
pnpm install                # install all dependencies
pnpm dev                    # start both server (3001) and client (5173) concurrently
pnpm dev:server             # start server only
pnpm dev:client             # start client only
pnpm build                  # build shared first, then server + client in parallel
pnpm db:generate            # regenerate Prisma client after schema changes
pnpm db:push                # push schema to SQLite database
pnpm db:seed                # run seed script
pnpm db:reset               # force-reset DB and re-seed
pnpm db:studio              # open Prisma Studio GUI
```

After changing `packages/db/prisma/schema.prisma`, run `pnpm db:generate` then `pnpm db:push`.

## Architecture Notes

- **State management**: Client uses MobX with a `RootStore` pattern. Each domain has its own store (AuthStore, GardenStore, CalendarStore, CatalogStore, DiseaseStore, PestStore, NotificationStore, ThemeStore, UIStore, SnackbarStore). Access stores via `useStore()` hook from `src/stores/index.ts`.
- **API layer**: Client's `src/services/api.ts` sets up an axios instance with automatic Bearer token injection from `localStorage` and 401 redirect handling. All API calls go through this single instance.
- **Auth flow**: JWT-based. Server middleware (`src/lib/middleware.ts`) attaches `req.userId` from the token. Tokens expire in 7 days.
- **Care scheduling**: Uses `rrule` library for recurring care schedules (watering, fertilizing, pruning, spraying, etc.). `CareTemplate` defines species-level defaults; `CareSchedule` is per user-plant.
- **Routing**: Server uses `.js` extensions in imports (required for ESM with `tsx`). Client uses `react-router-dom` v7.

## Environment

Copy `.env.example` to `.env`. Required: `DATABASE_URL`, `JWT_SECRET`. Optional: `PORT`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `TELEGRAM_BOT_TOKEN`.

## TypeScript

Base config in `tsconfig.base.json` (ES2022, strict, bundler resolution). Each package extends it.