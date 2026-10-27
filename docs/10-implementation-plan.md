# 10 — Implementation Plan (execute in order)

Commit after each phase. Run `npm run lint && npm run build` (and tests) before committing.

## Phase 0 — Setup
- [x] Init repo, root `.gitignore`, `/server` and `/client` packages, ESLint/Prettier, TS strict.
- [x] `create-next-app` (App Router, TS, Tailwind), init shadcn/ui, install TanStack Query, RHF, Zod, Recharts, axios, sonner, next-themes, date-fns.
- [x] Server deps: express, mongoose, zod, bcryptjs, jsonwebtoken, cookie-parser, helmet, cors, express-rate-limit, compression, morgan, dotenv; dev: typescript, tsx, @types/*, vitest/jest, supertest, faker.
- [x] `.env.example` files, env validation.

## Phase 1 — Backend foundation
- [x] `app.ts`, `index.ts`, DB connection, error handler, notFound, asyncHandler, ApiError, validate middleware, health route.
- [x] Models + indexes (file 04).
- [x] Seed script.

## Phase 2 — Auth (backend + client)
- [ ] Login/logout/me endpoints, auth + authorize middleware, rate limit.
- [ ] Client: axios instance, login page, middleware.ts, portal layout guard, logout.

## Phase 3 — Doctors (API + UI)
- [ ] Doctors CRUD, filters endpoint, list with search/filter/sort/pagination.
- [ ] Doctors page (toolbar, table/cards, pagination, add/edit/delete dialogs).

## Phase 4 — Patients (API + UI)
- [ ] Patients CRUD, filters endpoint, list query builder, counter maintenance.
- [ ] Doctor patients endpoints (`/doctors/:id/patients`).
- [ ] Doctor detail page with patients, add, delete.
- [ ] Patients page with search/filter/pagination/edit/delete.

## Phase 5 — Analytics & Dashboard
- [ ] Analytics endpoints + zero-fill + caching.
- [ ] Dashboard stat cards + 4 charts, range toggle, skeletons/empty states.

## Phase 6 — Polish
- [ ] Responsive pass (360 / 768 / 1280), dark mode, a11y pass, empty/error states, toasts.
- [ ] Re-render audit (React Profiler), bundle check, explain() on queries.
- [ ] Tests: auth, doctors list filters/pagination, patients CRUD, analytics shape.

## Phase 7 — Docs & Deploy
- [ ] README per file 11 (screenshots desktop + mobile).
- [ ] Deploy: Atlas, server (Render/Railway), client (Vercel) with `API_URL`. Verify cookies work over HTTPS.
- [ ] Seed production DB. Verify demo login.
- [ ] Final run of file 12 checklist.
