# Version 2.0 Decision Log

Use this lightweight log for decisions that affect v2 scope, architecture, content, or delivery. Add a new numbered entry; do not rewrite earlier decisions without noting why they changed.

## D-001 — Preserve v1 while v2 is developed

- Date: 2026-07-23
- Status: accepted
- Decision: Keep `main` as the stable v1 baseline and begin v2 on `codex/v2`.
- Reason: This allows maintenance releases and provides a clear rollback point while v2 evolves.

## D-002 — Mark the repository as a prerelease

- Date: 2026-07-23
- Status: accepted
- Decision: Set the package version to `2.0.0-alpha.0` during planning and development.
- Reason: The repository clearly communicates v2 work without implying that v2 is production-ready.

## Open decisions

| ID | Decision needed | Target phase |
| --- | --- | --- |
| O-001 | Primary audience and main conversion action | Discovery |
| O-002 | Final sitemap and launch-page scope | Discovery |
| O-003 | Visual direction and brand constraints | Discovery |
| O-004 | Projects/work content model | Discovery |
| O-005 | Performance budgets and browser support | Discovery |
| O-006 | Launch analytics and privacy boundaries | Discovery |
