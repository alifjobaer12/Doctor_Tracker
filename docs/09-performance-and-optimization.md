# 09 — Performance & Optimization Rules

## Database
- Every filter/sort/search field is covered by an index (file 04). Verify with `.explain('executionStats')` for list queries; target `IXSCAN`, no `COLLSCAN`. Put 1–2 explain results in the README (optional bonus).
- Compound index order: equality fields first, then sort field (ESR rule).
- Use `.lean()`, `.select()`, bounded `limit`; run `find` + `countDocuments` in parallel.
- Denormalized `patientsCount` to avoid `$lookup` on list views.
- Anchored regex search only; escape input.
- Avoid N+1: populate doctor with a single `populate` / `$lookup` and a minimal projection.
- Connection pooling via Mongoose defaults (`maxPoolSize` 10–20); connect once at boot.

## API
- `compression`, ETag on GETs, sensible Cache-Control for `/filters` endpoints.
- Cap `limit`, validate all input, consistent errors.
- Optional in-memory cache for analytics + filter option lists.

## Frontend
- TanStack Query caching, `keepPreviousData`, prefetch next page on hover/idle.
- Debounced search, URL-synced filters, no refetch on window focus for lists (optional).
- Code-split charts and dialogs; `next/image` and `next/font`.
- Memoize heavy lists; avoid prop identity churn; virtualization not required at 50 rows.
- Lighthouse target: Performance ≥ 90 desktop, Accessibility ≥ 90.

## Scalability notes (for README / interview)
- Keyset pagination for very large collections; Atlas Search for fuzzy text; Redis cache for analytics; read replicas; stateless Express behind a load balancer; JWT stateless auth enabling horizontal scale; split `patients` time-series stats into pre-aggregated daily buckets if volume grows.
