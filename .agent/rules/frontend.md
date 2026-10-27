# Frontend rules (apply when working in /client)

- Next.js App Router. Server components for static shells; client components only where interactivity is needed. Route group `(portal)` for authenticated pages; `middleware.ts` redirects unauthenticated users to `/login`.
- All HTTP through one Axios instance (`baseURL: '/api/v1'`, `withCredentials`) with a 401 interceptor. API functions in `services/`, hooks in `hooks/` (`useDoctors`, `usePatients`, `useAnalytics`...).
- TanStack Query: stable key factories, `placeholderData: keepPreviousData`, `staleTime` 30–60s (analytics 2–5 min), invalidate on mutations, optimistic update for patient delete with rollback.
- Filters/search/page/sort are URL search params (`useUrlFilters`); changing any filter resets page to 1; search input is debounced 400ms.
- Forms: React Hook Form + Zod resolver; map server field errors into the form; disable submit while pending.
- Reusable components only (see `docs/03`, `docs/07`); no copy-pasted tables/toolbars.
- Re-render hygiene: `React.memo` rows/cards/charts, `useMemo` columns, `useCallback` handlers, no inline object props to memoized children, `next/dynamic` for charts and heavy dialogs.
- Design: teal/emerald primary, slate neutrals, rounded-xl cards, Inter via `next/font`, light + dark, consistent 8px spacing, clear hierarchy. Desktop sidebar, mobile drawer, tables → cards on mobile.
- Every data view has skeleton, empty state, and error-with-retry states. Toast every mutation. ConfirmDialog for deletes. Keyboard accessible, labelled inputs, aria attributes.
