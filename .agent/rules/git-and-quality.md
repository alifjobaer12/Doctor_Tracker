# Git & quality rules

- Conventional Commits; one commit per phase minimum, small logical commits preferred.
- `.gitignore` must cover `node_modules`, `.env*` (except `.env.example`), `.next`, `dist`, coverage.
- Before each commit: `npm run lint` and `npm run build` in changed packages, plus tests where they exist.
- No dead code, no commented-out blocks, no stray `console.log`, no TODOs left without an issue note in the README "Known limitations".
- Keep README assumptions list updated as decisions are made.
