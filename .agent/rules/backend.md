# Backend rules (apply when working in /server)

- Structure: `routes → controllers → services → models`; utilities in `utils/`, config in `config/`, middleware in `middlewares/`.
- Wrap async handlers with `asyncHandler`; throw `ApiError(status, message)`; never `res.status(500)` ad hoc.
- Validate `body`, `query`, `params` with Zod via `validate()`; use `.strict()` on bodies; coerce numbers/dates in query schemas; cap `limit` at 50.
- Response envelope: `{ success, data, meta? }` and `{ success:false, message, errors? }`. Map Mongoose duplicate key (11000) → 409, CastError → 400, ValidationError → 400.
- Mongoose: define indexes in schema files exactly as in `docs/04`; set `nameLower` in a pre-validate hook; use `.lean()` and `.select()` for reads.
- Maintain `doctor.patientsCount` with atomic `$inc` on patient create/delete/doctor change.
- Analytics: `$match` first on indexed fields, `$dateTrunc` for timelines, zero-fill missing buckets, short TTL cache.
- Auth: JWT in httpOnly cookies, `authenticate` then `authorize('admin')` on all non-login routes.
- Tests (vitest/jest + supertest): auth, doctor list filters/pagination, patient CRUD + counter, analytics response shape.
