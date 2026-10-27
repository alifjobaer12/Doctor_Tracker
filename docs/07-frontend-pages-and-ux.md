# 07 — Frontend Pages, Components & UX

## Design direction
Modern medical-admin SaaS look: clean, airy, trustworthy. Teal/emerald primary (e.g. `#0d9488`), slate neutrals, soft shadows, rounded-xl cards, subtle borders, Inter font. Light + dark mode. 8px spacing scale, clear type hierarchy (page title → section title → body → muted). Consistent iconography (lucide). Micro-interactions (hover, focus rings, 150–200ms transitions); no heavy animation.

## Layout shell (portal)
- **Desktop:** fixed left sidebar (logo, nav: Dashboard, Doctors, Patients; active state), topbar (page title/breadcrumb, theme toggle, user menu with logout).
- **Mobile/tablet:** sidebar collapses into a sheet/drawer via hamburger; tables become stacked cards; filters open in a bottom sheet/collapsible panel.

## Pages
### /login
Centered card, split-screen on desktop with brand panel. Email/password with show/hide, inline errors, loading button, toast on failure. Shows demo credentials hint only if `NEXT_PUBLIC_SHOW_DEMO=true`.

### /dashboard
See file 08. Stat cards, charts, recent doctors/patients optional. Skeletons while loading.

### /doctors
- Header: title, count, **Add Doctor** button (opens dialog/sheet with `DoctorForm`).
- Toolbar: debounced SearchInput (400ms), filters (specialization select, hospital select, date range created from/to), sort select, **Clear filters**.
- Table (desktop) / cards (mobile): name + avatar initials, specialization badge, hospital, phone, email, patients count, created date, row actions (View, Edit, Delete).
- Pagination: page numbers, prev/next, rows-per-page (10/20/50), "Showing x–y of z".
- Empty state + error state with retry.

### /doctors/[id]
- Doctor profile header card (details, edit button, stats: patients count).
- **Patients of this doctor** table with search/pagination, **Add Patient** (dialog with `PatientForm`, doctor preselected & locked), **Delete** patient (ConfirmDialog, optimistic removal with rollback on error).
- Back link to Doctors.

### /patients
- Toolbar: search, filters (condition, status, doctor, gender, admitted date range), sort, clear.
- Table/cards: name, age/gender, condition badge, status badge (color-coded), doctor (link), admitted date, actions (Edit, Delete).
- **Edit** opens `PatientForm` dialog prefilled; **Delete** with ConfirmDialog.
- Pagination as above. Optional "Add patient" button (select doctor).

## State & data fetching
- **TanStack Query** for all server data. Query keys: `['doctors', filters]`, `['doctor', id]`, `['doctor-patients', id, filters]`, `['patients', filters]`, `['analytics', ...]`, `['me']`.
- `placeholderData: keepPreviousData` for pagination to prevent flicker; `staleTime` 30–60s; analytics `staleTime` 2–5 min.
- Mutations invalidate relevant keys (doctors, patients, analytics); use optimistic updates for patient delete.
- **Filter state lives in the URL** (`useSearchParams`) → shareable, back-button friendly; a `useUrlFilters` hook handles reset-to-page-1 on filter change.
- Forms: React Hook Form + Zod resolver; server validation errors mapped to fields.
- Zustand only for UI (sidebar). No server data in global stores.

## Reusable components (must be generic)
`DataTable` (column defs, loading/empty/error), `Pagination`, `SearchInput`, `FilterBar`, `DateRangePicker`, `ConfirmDialog`, `StatCard`, `StatusBadge`, `EmptyState`, `PageHeader`, `FormField`, skeleton variants, `ErrorBoundary`.

## Avoiding unnecessary re-renders
- `React.memo` on table rows/cards and chart components; stable callbacks via `useCallback`; memoized columns via `useMemo`.
- Debounce search; do not store derived data in state.
- Split client components; keep server components for static shells; dynamic-import charts (`next/dynamic`, `ssr:false`) to reduce bundle.
- Don't create inline objects/functions as props for memoized children.

## UX checklist
- Loading skeletons, empty states, error states with retry.
- Toast feedback for every mutation.
- Confirm destructive actions.
- Keyboard accessible (focus trap in dialogs, labels, aria attributes), sufficient contrast.
- Disable submit while pending; prevent double submit.
- Responsive at 360px, 768px, 1280px+.
