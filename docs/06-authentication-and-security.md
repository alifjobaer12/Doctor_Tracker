# 06 — Authentication & Security

## Flow
1. `POST /auth/login` → validate → find user (`+passwordHash`) → `bcrypt.compare` → sign JWT (`sub`, `role`, 15 min access; optional 7d refresh).
2. Tokens stored in **httpOnly, Secure (prod), SameSite=Lax** cookies. Never in localStorage.
3. `authenticate` middleware: read cookie → verify JWT → attach `req.user`. 401 on failure.
4. `authorize('admin')` middleware on every admin route (authorization, not just authentication).
5. `GET /auth/me` for client session bootstrap; client redirects to `/login` on 401.
6. Logout clears cookies.

## Client route protection
- `client/src/middleware.ts`: if no auth cookie and path is not `/login` (or static) → redirect to `/login?next=...`; if cookie present and path is `/login` → redirect to `/dashboard`.
- Portal layout also verifies via `/auth/me` (TanStack Query) so an expired/invalid token redirects properly.
- Axios response interceptor: on 401 → clear query cache → redirect to `/login` (try refresh once if implemented).

## Hardening checklist
- `helmet()`, `cors({ origin: CLIENT_URL, credentials: true })`, `compression()`.
- `express-rate-limit`: strict on `/auth/login` (e.g. 10/15 min/IP), general limit elsewhere.
- Body size limit (`10kb`), `express.json()` only.
- Escape regex input; use Mongoose query operators safely (strip `$`/`.` keys — e.g. `express-mongo-sanitize` or Zod strict schemas).
- Generic login error ("Invalid credentials") — no user enumeration.
- Password policy for seeded admin; bcrypt cost ≥ 12.
- Secrets only via env; `JWT_SECRET` ≥ 32 chars; validated at boot.
- Don't leak stack traces in production responses.

## Env vars
`server/.env.example`
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/doctor_tracker
JWT_ACCESS_SECRET=change_me_to_a_long_random_string
JWT_REFRESH_SECRET=change_me_too
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:3000
COOKIE_DOMAIN=
```
`client/.env.example`
```
API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Doctor Tracker
```
