---
description: Verify the app against the acceptance checklist
---
1. Start MongoDB connection (from `server/.env`), run `npm run seed` in `/server` if data is missing.
2. Start server and client dev servers.
3. In the browser, check: login/logout, route protection, doctors CRUD + search/filter/sort/pagination, doctor detail patients add/delete, patients page CRUD + filters, dashboard cards and charts.
4. Check responsive layouts at 1280px and 390px, and dark mode.
5. In Mongo shell or a script, run `.explain('executionStats')` on the doctor and patient list queries; confirm IXSCAN (no COLLSCAN).
6. Walk through `docs/12-testing-and-acceptance-checklist.md`; tick passing items and list failures with fixes.
