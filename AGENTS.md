# AGENTS.md — Doctor Tracker

Cross-tool instructions (Antigravity, Claude Code, Cursor, Codex). Read this file fully before every task.

## Project
**Doctor Tracker**: secure admin web app to manage doctors and their patients, with search/filter/pagination, and an analytics dashboard. This is a hiring assessment for a Full Stack Developer role. It is judged on: code structure, query optimization, UX/UI, data visualization, performance, authentication, Next.js + MongoDB best practices, scalability. **Quality and polish matter more than speed.**

## Source of truth
Full specs live in `docs/` (numbered files). Read them in order before coding:
`00` intro · `01` requirements · `02` stack/architecture · `03` folders · `04` DB schema/indexes · `05` API · `06` auth/security · `07` frontend/UX · `08` dashboard · `09` performance · `10` implementation plan · `11` README/deliverables · `12` acceptance checklist.
If code and docs disagree, docs win. If docs are ambiguous, pick the simplest option satisfying `docs/01`, and record it as an assumption for the README.

## Architecture (decided — do not change)
- Monorepo: `/client` (Next.js 15 App Router, TypeScript, Tailwind, shadcn/ui, TanStack Query, React Hook Form + Zod, Recharts, Axios) and `/server` (Node 20, Express, TypeScript, Mongoose, Zod).
- Client talks to Express ONLY over REST (`/api/v1`) through a Next.js rewrite proxy (`/api/*` → `API_URL`), so cookies are same-origin.
- Auth: JWT in httpOnly cookies, `authenticate` + `authorize('admin')` middleware, Next `middleware.ts` guards routes.
- Server layering: `routes → controllers → services → models`. Controllers are thin; business logic and query building live in services; validation in Zod schemas.
- Filters/search/page state lives in the URL; server state lives in TanStack Query (no Redux for server data).

## Commands (create these scripts)
- Server: `npm run dev | build | start | seed | lint | test`
- Client: `npm run dev | build | start | lint`
- Seed admin: `admin@doctortracker.com` / `Admin@12345`

## Workflow rules
1. Work in the phases of `docs/10-implementation-plan.md`, in order. Finish and verify a phase before the next.
2. Before finishing any phase: lint + type-check + build must pass. Fix errors, do not suppress them.
3. Commit after each phase with Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
4. Tick off items in `docs/10` and `docs/12` as you complete them.
5. Plan first for multi-file work: list files to create/change, then implement.
6. Do not install heavy/unnecessary dependencies; justify any addition not listed in `docs/02`.

## Code standards
- TypeScript strict; no `any` without a justifying comment; no unused code or `console.log` left behind.
- Small single-purpose files and components; reusable generic components (`DataTable`, `Pagination`, `SearchInput`, `FilterBar`, `ConfirmDialog`, `StatCard`, ...).
- Consistent naming: files `kebab-case` or `PascalCase` for components; API fields `camelCase`.
- Every API input validated with Zod; every error through the central error handler; unified response envelope (`docs/05`).
- Never hardcode secrets or URLs; use env vars validated at boot; keep `.env.example` files current.
- Accessible, responsive UI (360 / 768 / 1280+), dark mode, loading/empty/error states, toast on every mutation, confirm destructive actions.

## Performance guardrails (non-negotiable)
- Every search/filter/sort field is indexed (`docs/04`); list queries use `.lean()`, `.select()`, capped `limit`, parallel `find` + `countDocuments`.
- Search = anchored, regex-escaped prefix on normalized fields. No unanchored regex.
- Verify list queries with `.explain('executionStats')`: no `COLLSCAN`.
- Debounce search (400ms), `keepPreviousData` for pagination, memoize rows/charts, dynamic-import charts.

## Security guardrails
- Never store tokens in localStorage. Rate-limit login. helmet + CORS allowlist + body size limit. Generic login errors. No stack traces in production responses.

## Do NOT
- Do not switch to a Next.js-only full-stack design or add Redux/GraphQL/ORMs other than Mongoose.
- Do not skip any requirement in `docs/01`, even "small" ones (e.g. delete patient from doctor's list, date-wise filters).
- Do not commit `.env`, node_modules, or secrets.
- Do not leave placeholder/mock data in the UI; everything must come from the API.

## When stuck
State the blocker and the options you considered, pick the simplest, and continue. Ask the human only for: MongoDB Atlas URI, deployment accounts/credentials, and real screenshots.

## Definition of Done
All of `docs/12-testing-and-acceptance-checklist.md` passes; README complete per `docs/11`; app deployed and seeded.
