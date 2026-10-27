# 00 — START HERE: Agent Instructions

You are an AI coding agent (VS Code) building **Doctor Tracker**, a full-stack assessment project for a Full Stack Developer job application. Read ALL files in this folder in numeric order before writing code. Then build phase by phase following `10-implementation-plan.md`.

## Document Index
| File | Purpose |
|---|---|
| 01-project-overview-and-requirements.md | Original spec, extracted and structured |
| 02-tech-stack-and-architecture.md | Chosen stack, architecture, decisions on spec conflicts |
| 03-folder-structure.md | Monorepo layout (client + server) |
| 04-database-schema-and-indexing.md | Mongoose models, indexes, seed data |
| 05-backend-api-spec.md | REST endpoints, validation, errors |
| 06-authentication-and-security.md | Auth flow, route protection, hardening |
| 07-frontend-pages-and-ux.md | Pages, components, UX rules, state/data fetching |
| 08-dashboard-and-analytics.md | Aggregation pipelines + charts |
| 09-performance-and-optimization.md | Query/render optimization rules |
| 10-implementation-plan.md | Ordered phases with checklists |
| 11-readme-and-deliverables.md | README template, screenshots, submission |
| 12-testing-and-acceptance-checklist.md | Final verification |

## Rules of Engagement
1. **TypeScript everywhere** (strict mode). No `any` unless justified in a comment.
2. **Do not skip features.** Every bullet in file 01 must be implemented.
3. **Quality bar:** this is evaluated for code structure, query optimization, UX/UI, data visualization, performance, auth, best practices, scalability. Optimize for those.
4. Keep controllers thin, logic in services, validation in schemas (Zod), reusable UI components.
5. Never commit secrets. Provide `.env.example` for both `client/` and `server/`.
6. After each phase: run lint + type-check + build, fix errors, then commit with a conventional commit message (`feat:`, `fix:`, `chore:`, `docs:`).
7. If something in the docs is ambiguous, choose the simplest option that satisfies the spec, and record it in the README under "Technical Decisions" or "Assumptions".
8. Ask the human only for things you cannot decide: MongoDB Atlas URI, deployment accounts, screenshots.

## Definition of Done
All checkboxes in `12-testing-and-acceptance-checklist.md` pass, README complete, app deployed, seed credentials documented.
