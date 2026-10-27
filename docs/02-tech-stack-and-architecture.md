# 02 — Tech Stack & Architecture

## Spec conflict resolution
The PDF says both "full-stack inside Next.js (Express integrated)" and "Next.js separate client + standalone Express server". **Decision: separate client and server in one monorepo** (the later, more specific variant; also demonstrates REST API design and scalability). Document this in the README. The Next.js app talks to Express only over REST.

## Stack
### Client (`/client`)
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS + shadcn/ui (Radix) + lucide-react icons
- TanStack Query v5 (server state, caching, pagination with `placeholderData: keepPreviousData`)
- React Hook Form + Zod (forms/validation)
- Recharts (charts)
- Axios (single configured instance, `withCredentials`)
- Zustand only for tiny UI state (sidebar open, theme) — not for server data
- sonner (toasts), next-themes (dark mode), date-fns, use-debounce

### Server (`/server`)
- Node.js 20+, Express 4/5, TypeScript
- MongoDB + Mongoose
- Zod (request validation), bcryptjs, jsonwebtoken, cookie-parser
- helmet, cors, express-rate-limit, compression, morgan/pino
- tsx / ts-node-dev for dev, `@faker-js/faker` for seeding
- Jest/Vitest + supertest (a few meaningful tests)

### Infra
- MongoDB Atlas (free tier), client on Vercel, server on Render/Railway/Fly.

## Architecture
```mermaid
flowchart LR
  B[Browser] -->|HTTPS| N[Next.js client<br/>middleware + RSC shell]
  N -->|rewrite /api/* (same-origin cookies)| E[Express REST API]
  E --> M[(MongoDB Atlas)]
  E -->|JWT httpOnly cookie| B
```
Request flow: Browser → Next.js (`/api/*` rewritten to Express) → auth middleware (JWT) → validation (Zod) → controller → service → Mongoose → MongoDB → response envelope.

### Why a Next.js rewrite proxy
Cookies are same-origin, so httpOnly cookie auth works with Next.js `middleware.ts` (which can read the cookie to protect routes) without CORS/SameSite headaches. Configure in `next.config.ts`:
```ts
async rewrites() {
  return [{ source: '/api/:path*', destination: `${process.env.API_URL}/api/:path*` }];
}
```
Axios `baseURL` = `/api/v1`.

## Layering (server)
`routes → controllers → services → models`. Cross-cutting: `middlewares` (auth, validate, error), `utils`, `config`.

## Conventions
- REST, plural nouns, versioned `/api/v1`.
- Unified response envelope + error format (file 05).
- ESLint + Prettier on both packages; Husky optional.
- Env validation at startup (Zod) — fail fast.
