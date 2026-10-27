# 05 — Backend REST API Spec

Base path: `/api/v1`. JSON only. All routes except `POST /auth/login` require authentication.

## Response envelope
Success:
```json
{ "success": true, "data": { }, "meta": { "page": 1, "limit": 10, "total": 120, "totalPages": 12 } }
```
(`meta` only on paginated lists.)
Error:
```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "Invalid email" }] }
```
Status codes: 200, 201, 204, 400 (validation), 401, 403, 404, 409 (duplicate/conflict), 429, 500. Central `errorHandler` maps Zod errors, Mongoose validation/duplicate-key (11000)/CastError, and `ApiError`.

## Auth
| Method | Path | Description |
|---|---|---|
| POST | /auth/login | body `{email,password}` → sets httpOnly cookie(s); returns user |
| POST | /auth/logout | clears cookie |
| GET | /auth/me | current user (used for session check) |
| POST | /auth/refresh | optional: rotate access token via refresh cookie |

## Doctors
| Method | Path | Description |
|---|---|---|
| GET | /doctors | list (paginated) |
| POST | /doctors | create |
| GET | /doctors/:id | detail |
| PATCH | /doctors/:id | update |
| DELETE | /doctors/:id | delete (see rules, `?cascade=true`) |
| GET | /doctors/filters | distinct `specializations[]`, `hospitals[]` for filter dropdowns |
| GET | /doctors/:id/patients | doctor's patients (paginated, same query params as patients list minus doctor) |
| POST | /doctors/:id/patients | add patient under doctor |
| DELETE | /doctors/:id/patients/:patientId | remove patient from doctor's list (deletes patient, verifies ownership) |

**GET /doctors query params:** `page=1`, `limit=10` (max 50), `search`, `specialization`, `hospital`, `createdFrom`, `createdTo` (ISO dates), `sortBy` (`createdAt|name|patientsCount`), `order` (`asc|desc`).

**Create/Update body:** `name`, `specialization`, `hospital`, `phone`, `email`.

## Patients
| Method | Path | Description |
|---|---|---|
| GET | /patients | list (paginated) with doctor populated (`name, specialization`) via `.populate` + `.select` or `$lookup` |
| POST | /patients | create (requires `doctor` id) |
| GET | /patients/:id | detail |
| PATCH | /patients/:id | edit |
| DELETE | /patients/:id | delete |
| GET | /patients/filters | distinct `conditions[]`, status list |

**GET /patients query params:** `page`, `limit`, `search`, `condition`, `status`, `doctor`, `gender`, `admittedFrom`, `admittedTo`, `sortBy` (`admittedAt|name|age`), `order`.

**Patient body:** `name`, `age`, `gender`, `phone`, `email?`, `condition`, `status?`, `notes?`, `doctor`, `admittedAt?`.

## Analytics (see file 08)
| Method | Path |
|---|---|
| GET | /analytics/summary |
| GET | /analytics/patients-per-doctor?limit=10 |
| GET | /analytics/timeline?range=30d&groupBy=day |
| GET | /analytics/conditions |
| GET | /analytics/specializations |

## Validation
- Zod schemas per route (`body`, `query`, `params`) through a `validate()` middleware; coerce query numbers/dates; reject unknown keys (`.strict()`) on bodies.
- Validate ObjectIds in params.
- Enforce `limit` cap and sane defaults.

## Pagination helper
Use `skip/limit` with `Promise.all([find, countDocuments])`; use `.lean()` and `.select()` for list queries. Return `meta`. (Mention keyset/cursor pagination as the scalability path.)

## Health
`GET /health` (no auth) → `{status:'ok'}` for hosting probes.
