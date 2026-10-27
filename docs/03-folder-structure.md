# 03 — Folder Structure (monorepo)

```
doctor-tracker/
├─ README.md
├─ .gitignore
├─ package.json                # optional root scripts (concurrently)
├─ docs/screenshots/           # desktop + mobile images
├─ server/
│  ├─ .env.example
│  ├─ package.json, tsconfig.json
│  └─ src/
│     ├─ index.ts              # bootstrap: connect DB, listen
│     ├─ app.ts                # express app, middleware, routes
│     ├─ config/               # env.ts (zod), db.ts
│     ├─ models/               # user.model.ts, doctor.model.ts, patient.model.ts
│     ├─ schemas/              # zod: auth, doctor, patient, query schemas
│     ├─ routes/               # index.ts, auth.routes.ts, doctor.routes.ts, patient.routes.ts, analytics.routes.ts
│     ├─ controllers/
│     ├─ services/             # business logic + query builders
│     ├─ middlewares/          # auth.ts, validate.ts, errorHandler.ts, rateLimit.ts, notFound.ts
│     ├─ utils/                # ApiError.ts, asyncHandler.ts, pagination.ts, escapeRegex.ts
│     ├─ scripts/seed.ts       # admin user + doctors + patients
│     └─ tests/
└─ client/
   ├─ .env.example
   ├─ next.config.ts, tailwind config, components.json
   └─ src/
      ├─ middleware.ts         # route protection
      ├─ app/
      │  ├─ layout.tsx, providers.tsx, globals.css
      │  ├─ login/page.tsx
      │  └─ (portal)/
      │     ├─ layout.tsx      # sidebar + topbar shell
      │     ├─ dashboard/page.tsx
      │     ├─ doctors/page.tsx
      │     ├─ doctors/[id]/page.tsx
      │     └─ patients/page.tsx
      ├─ components/
      │  ├─ ui/                # shadcn primitives
      │  ├─ layout/            # Sidebar, Topbar, MobileNav, PageHeader
      │  ├─ shared/            # DataTable, Pagination, SearchInput, FilterBar, DateRangePicker, ConfirmDialog, EmptyState, StatCard, Skeletons
      │  ├─ doctors/           # DoctorForm, DoctorsTable, DoctorCard, DoctorFilters
      │  ├─ patients/          # PatientForm, PatientsTable, PatientFilters
      │  └─ dashboard/         # charts (PatientsPerDoctorChart, TimelineChart, ConditionChart...)
      ├─ hooks/                # useDoctors, usePatients, useAnalytics, useDebounce, useUrlFilters
      ├─ lib/                  # axios.ts, queryClient.ts, utils.ts, constants.ts
      ├─ services/             # api functions: auth, doctors, patients, analytics
      ├─ types/                # shared TS types
      └─ schemas/              # zod form schemas
```
Keep files small; one component per file; colocate tests if added.
