# 12 — Testing & Acceptance Checklist

## Functional
- [ ] Unauthenticated access to any portal route redirects to /login; API returns 401.
- [ ] Login works; wrong credentials show generic error; logout clears session.
- [ ] Doctor: create (all 5 fields validated), list, search, filter (specialization, hospital, date range), sort, paginate, edit, delete rule.
- [ ] Duplicate doctor email → 409 with field error shown in form.
- [ ] Doctor detail shows only that doctor's patients; add patient under doctor; delete patient from list; counts update.
- [ ] Patients page: list, search, filter (condition, status, doctor, gender, date range), sort, paginate, edit, delete.
- [ ] Filters/search/page persist in URL and survive refresh; changing filters resets to page 1.
- [ ] Dashboard shows total doctors, total patients, patients per doctor, date-based stats, charts with real data.

## Non-functional
- [ ] No `COLLSCAN` on list/search/filter queries (checked with explain).
- [ ] API validates all input; consistent error format; no stack traces in prod.
- [ ] Rate limit on login works.
- [ ] No unnecessary re-renders on typing in search (Profiler check).
- [ ] Responsive at 360, 768, 1280 widths; dark mode OK; keyboard navigation OK.
- [ ] `npm run build` passes for client and server; lint clean; tests pass.
- [ ] Lighthouse: Perf ≥ 90, A11y ≥ 90 (desktop).

## Deliverables
- [ ] README sections complete (pitch, setup, architecture, 2 decisions, screenshots).
- [ ] `.env.example` in both packages.
- [ ] Deployed + seeded; demo login verified in production.
