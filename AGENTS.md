## Project Context
- Purpose: Personal CV/portfolio and blog site for Melanie Kuhles.
- Goals: Clear structure, maintainable code, pragmatic solutions, SEO-friendly i18n URLs.
- Stack: Astro, MDX, Tailwind CSS, SCSS, PostCSS, TypeScript.

## Coding Preferences
- Keep changes small, explicit, and easy to review.
- Prefer shared types in `src/types` instead of inline types in pages.
- Avoid duplicate pages; prefer route logic with i18n data.
- Favor semantic HTML and accessibility.
- Keep CSS tidy and avoid conflicting rules.

## i18n & SEO Rules
- Use `src/i18n/routes.json` for localized URLs.
- Use `src/i18n/strings.json` keys for titles/descriptions (`seo.*` schema).
- Use `hreflang` alternates and canonical URLs.

## Content & Images
- Blog content is in `src/content/blog`.
- Sections content is in `src/content/sections`.
- Use `astro:assets` where possible for optimized images.
- Prefer modern image formats and reasonable `widths`.

## Workflow Expectations
- Make separate commits for distinct changes.
- Confirm before commit.
- Keep documentation updated for humans and future agents.
