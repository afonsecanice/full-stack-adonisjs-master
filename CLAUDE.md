# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Full-stack starter kit with access-token authentication. Monorepo with two independent apps:

- `backend/` — JSON API in **AdonisJS 7** (TypeScript), port 3333
- `frontend/` — SPA in **React 19 + Vite**, port 5173

## Stack

| Layer | Technology |
|---|---|
| Backend | AdonisJS 7 (api starter kit) |
| ORM / DB | Lucid + SQLite (`better-sqlite3`) |
| Validation | VineJS |
| Auth | `@adonisjs/auth` · `api` guard (opaque access tokens, 30-day TTL, `oat_` prefix) |
| Frontend | React 19 + TypeScript + Vite |
| Routing | React Router |
| Styles | Tailwind CSS v4 + shadcn/ui |
| SDD workflow | OpenSpec (`/opsx:*`) |

## Commands

### Backend (`cd backend`)
```
npm run dev            # HMR dev server → http://localhost:3333
npm run test           # Run all Japa tests
node ace test -- --files="tests/path/to/file.spec.ts"  # Run a single test file
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm run migration:run  # Apply pending migrations
npm run migration:fresh # Drop and recreate DB from scratch
node ace list:routes   # Print route tree
```

### Frontend (`cd frontend`)
```
npm run dev    # Vite dev server → http://localhost:5173
npm run build  # Production build
```

## Backend architecture

**Request lifecycle:** `routes.ts` → controller → VineJS validator → model/service → transformer → response

**Key conventions:**
- Business logic lives in controllers (`app/controllers/`), not in `start/routes.ts` (routes only wire things up).
- All input validated with a VineJS validator in `app/validators/`.
- All responses serialized through a transformer in `app/transformers/` — never return a raw Lucid model (prevents accidental `password` leakage).
- All routes under `/api/v1` prefix. Protected routes use `.use(middleware.auth())`.
- Use subpath imports (`#controllers/*`, `#models/*`, `#validators/*`, `#transformers/*`, etc.), not relative paths.

**Auth flow:** `POST /api/v1/account/login` returns `{ user, token }`. Token is an opaque string to be sent as `Authorization: Bearer <token>`. `POST /api/v1/account/logout` revokes the current token.

**Testing:** Uses [Japa](https://japa.dev) (`@japa/runner`, `@japa/api-client`, `@japa/assert`). Test suites named `functional` or `e2e` auto-start the HTTP server via `testUtils.httpServer()`.

## Frontend architecture

- `src/services/authService.ts` — all API calls; persists `auth_token` and `auth_user` in `localStorage`.
- `src/types/auth.ts` — shared TypeScript types for auth payloads.
- `src/components/ProtectedRoute.tsx` — redirects unauthenticated users to `/login`.
- Path alias `@/` maps to `src/` (configured in `vite.config.ts`).
- `VITE_API_URL` env var overrides the default API base (`http://localhost:3333/api/v1`).

## OpenSpec workflow

Spec-driven development with slash commands: `/opsx:propose` → `/opsx:apply` → `/opsx:archive`. Config in `openspec/config.yaml`.

## Commit style

Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.

## Do not

- Put business logic in `start/routes.ts`.
- Return raw Lucid models in responses — always go through a transformer.
- Commit `.env` or `backend/tmp/db.sqlite3`.
