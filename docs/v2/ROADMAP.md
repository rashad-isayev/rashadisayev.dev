# Version 2.0 Roadmap

This roadmap is outcome-based. Dates will be added after discovery establishes the final scope.

## Phase 0 — Baseline and project setup

Status: complete

- Preserve v1 on `main` and isolate work on `v2`.
- Record the current application surface and data model.
- Verify the existing lint, test, and production-build gates.
- Add continuous integration for pull requests and branch updates.
- Establish the project brief, roadmap, and decision log.

Exit criteria: the branch, scope documents, baseline checks, and delivery gates exist.

## Phase 1 — Discovery and direction

Status: next

- Confirm audiences, goals, tone, and primary calls to action.
- Inventory and prioritize existing and new content.
- Agree on the sitemap and page-level responsibilities.
- Select a visual direction using references or a moodboard.
- Define explicit accessibility and performance budgets.
- Turn the approved scope into small implementation milestones.

Exit criteria: content priorities, sitemap, visual direction, and acceptance criteria are approved.

## Phase 2 — Experience foundation

- Introduce design tokens and the core typography, color, spacing, and motion system.
- Build shared layout, navigation, footer, section, and content primitives.
- Add representative responsive and accessibility tests.
- Decide and implement any required content-model migrations.

Exit criteria: shared foundations support the agreed pages without page-specific duplication.

## Phase 3 — Public experience

- Build the homepage in reviewable sections.
- Build projects/work listing and detail experiences if approved in discovery.
- Improve blog discovery and the article reading experience.
- Rework contact and availability flows.
- Complete metadata, structured data, social previews, RSS, and sitemap updates.

Exit criteria: all committed public flows meet their acceptance criteria across supported widths.

## Phase 4 — Content and administration

- Migrate or rewrite launch content.
- Extend admin workflows only where the public v2 experience requires it.
- Validate drafts, publication, archived content, reactions, and analytics behavior.
- Rehearse database migration and rollback using non-production data.

Exit criteria: launch content is complete and existing editorial workflows have no critical regressions.

## Phase 5 — Hardening and launch

- Complete accessibility, browser, performance, SEO, security, and privacy reviews.
- Run the full automated suite and focused manual checks.
- Prepare deployment, monitoring, rollback, and post-launch checklists.
- Merge through a reviewed pull request and tag `v2.0.0` only after production validation.

Exit criteria: launch checklist is signed off, production is verified, and rollback remains available.

## Working conventions

- Keep `main` releasable.
- Use short-lived branches from `v2` for substantial milestones.
- Require the quality workflow to pass before merging.
- Record scope or architecture changes in `DECISIONS.md`.
- Include acceptance criteria and screenshots for visible changes.
- Keep database and public API changes backward-compatible during rollout when practical.
