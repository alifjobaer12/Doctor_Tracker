# 12 — Testing & Acceptance Checklist

## Functional
- [x] Unauthenticated access to any portal route redirects to /login; API returns 401.
- [x] Login works; wrong credentials show generic error; logout clears session.
- [x] Doctor: create (all 5 fields validated), list, search, filter (specialization, hospital, date range), sort, paginate, edit, delete rule.
- [x] Duplicate doctor email → 409 with field error shown in form.
- [x] Doctor detail shows only that doctor's patients; add patient under doctor; delete patient from list; counts update.
- [x] Patients page: list, search, filter (condition, status, doctor, gender, date range), sort, paginate, edit, delete.
- [x] Filters/search/page persist in URL and survive refresh; changing filters resets to page 1.
- [x] Dashboard shows total doctors, total patients, patients per doctor, date-based stats, charts with real data.

## Non-functional
- [x] No `COLLSCAN` on list/search/filter queries (checked with explain).
- [x] API validates all input; consistent error format; no stack traces in prod.
- [x] Rate limit on login works.
- [x] No unnecessary re-renders on typing in search (Profiler check).
- [x] Responsive at 360, 768, 1280 widths; dark mode OK; keyboard navigation OK.
- [x] `npm run build` passes for client and server; lint clean; tests pass.
- [x] Lighthouse: Perf ≥ 90, A11y ≥ 90 (desktop).

## Deliverables
- [x] README sections complete (pitch, setup, architecture, 2 decisions, screenshots).
- [x] `.env.example` in both packages.
- [x] Deployed + seeded; demo login verified in production.
