# 04 — Database Schema & Indexing (MongoDB / Mongoose)

## Collections

### users
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique, lowercase |
| passwordHash | String | `select: false`, bcrypt (cost 12) |
| role | `'admin'` | enum (extensible: `'staff'`) |
| createdAt/updatedAt | Date | timestamps |

### doctors
| Field | Type | Notes |
|---|---|---|
| name | String | required, trimmed |
| nameLower | String | auto-set in pre-save/validate hook; used for prefix search |
| specialization | String | required |
| hospital | String | required |
| phone | String | required, validated |
| email | String | required, unique, lowercase |
| patientsCount | Number | default 0; denormalized, maintained with `$inc` |
| createdAt/updatedAt | Date | timestamps |

### patients
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| nameLower | String | prefix search |
| age | Number | 0–120 |
| gender | enum | `male \| female \| other` |
| phone | String | required |
| email | String | optional |
| condition | String | required (e.g. Diabetes, Hypertension, Asthma, Fracture, Migraine...) |
| status | enum | `active \| recovered \| critical` (default `active`) — extra filter |
| notes | String | optional |
| doctor | ObjectId → Doctor | required, indexed |
| admittedAt | Date | date used for date-wise filtering/stats (default now) |
| createdAt/updatedAt | Date | timestamps |

## Indexes (define in schema files; call `Model.syncIndexes()` in seed)
```ts
// Doctor
doctorSchema.index({ email: 1 }, { unique: true });
doctorSchema.index({ nameLower: 1 });
doctorSchema.index({ specialization: 1, createdAt: -1 });
doctorSchema.index({ hospital: 1, createdAt: -1 });
doctorSchema.index({ createdAt: -1 });

// Patient
patientSchema.index({ doctor: 1, admittedAt: -1 });        // doctor's patients list + patients-per-doctor
patientSchema.index({ condition: 1, admittedAt: -1 });     // condition filter + chart
patientSchema.index({ status: 1, admittedAt: -1 });
patientSchema.index({ admittedAt: -1 });                   // date range + timeline
patientSchema.index({ nameLower: 1 });                     // search
```
## Search strategy
- Normalize search term (trim, lowercase, **escape regex**).
- Use **anchored prefix** regex `^term` on `nameLower` (index-friendly) with `$or` on email/phone prefix. Avoid unanchored `/term/i` on large collections. Mention `$text`/Atlas Search as a scalability upgrade in the README if desired.

## Referential integrity rules
- Creating patient under doctor: verify doctor exists, create patient, `$inc` doctor.patientsCount (+1).
- Deleting patient: delete, `$inc` -1.
- Moving patient to another doctor on edit: adjust both counts.
- Deleting a doctor: **blocked with 409 if they have patients** unless `?cascade=true` (deletes their patients). UI shows ConfirmDialog.
- Provide `scripts/recount.ts` (optional) to reconcile `patientsCount`.

## Seed script (`npm run seed`)
- Admin: `admin@doctortracker.com` / `Admin@12345` (document in README; hashed in DB).
- ~25 doctors across 8 specializations and 6 hospitals; ~400 patients spread over the last 12 months with varied conditions/statuses (use faker, weighted distribution so charts look meaningful).
- Idempotent: clear collections first or upsert.
