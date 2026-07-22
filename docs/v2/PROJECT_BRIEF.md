# rashadisayev.dev v2 — Project Brief

## Status

Planning. The `main` branch is the stable v1 baseline; all v2 work begins on `codex/v2`.

## Product intent

Version 2 should evolve the site from a concise personal homepage into a clearer, more complete professional presence while preserving the speed, simplicity, accessibility, and maintainability of v1.

The site should quickly answer four visitor questions:

1. Who is Rashad?
2. What does he do well?
3. What has he built or contributed to?
4. How can I follow or contact him?

## Current baseline

The existing application provides:

- public home, blog, article, and contact pages;
- an authenticated admin area for content and availability;
- database-backed posts, reactions, views, and site settings;
- RSS, sitemap, robots, metadata, and generated Open Graph images;
- responsive styling, security headers, linting, tests, and production builds.

## Proposed v2 outcomes

- A more distinctive visual system and stronger first impression.
- Clear positioning, capabilities, and calls to action on the homepage.
- A dedicated projects or work area with evidence and outcomes.
- Improved content discovery and article reading experience.
- Reusable page sections and design tokens that are easy to extend.
- Preserved admin workflows and a safe migration path for existing content.
- Measurable accessibility, performance, SEO, and quality standards.

## Initial scope

### In scope

- Information architecture and navigation.
- Visual identity, typography, color, spacing, and motion rules.
- Homepage, projects/work, blog, article, and contact experiences.
- Required content-model and admin changes for the public experience.
- Accessibility, responsive behavior, metadata, analytics boundaries, and performance.
- Migration, rollout, and rollback planning.

### Not committed yet

- Accounts for public visitors.
- Comments, community features, or a newsletter platform.
- A full CMS replacement.
- Localization.
- Native mobile applications.

These remain outside the committed scope until the discovery phase shows a clear need.

## Success criteria

- A visitor can understand the site owner and primary value proposition within the first screen.
- Featured work includes a clear role, context, contribution, and outcome.
- All primary flows work at mobile, tablet, and desktop widths.
- Core pages meet WCAG 2.2 AA expectations.
- No critical regression in existing blog or admin workflows.
- Lint, tests, type checking, and production build pass in continuous integration.
- Performance targets are agreed before implementation and verified before launch.

## Constraints and principles

- Prefer focused, useful content over decorative complexity.
- Use progressive enhancement and respect reduced-motion preferences.
- Keep server-rendered content and metadata discoverable.
- Avoid collecting personal data without a defined purpose and retention policy.
- Introduce schema changes through reviewed Prisma migrations.
- Deliver in small, reviewable increments rather than one large replacement.

## Discovery inputs needed

Development should begin after these decisions are made:

- Primary audience and desired visitor action.
- Visual direction and reference sites.
- Project/work content to feature at launch.
- Pages that must ship in the first v2 release.
- Whether the current public copy is retained, rewritten, or expanded.
- Hosting, analytics, and launch-date constraints.
