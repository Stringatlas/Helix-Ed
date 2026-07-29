# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Helix-Ed (www.helix-ed.org) is the marketing/enrollment site for an online STEM & economics education program. SvelteKit 2 + Svelte 4, TypeScript, SCSS, deployed on Vercel. Content is authored in Sanity CMS.

## Commands

```bash
npm install
npm run dev          # vite dev server
npm run build        # production build
npm run preview      # serve the production build locally
npm run check        # svelte-kit sync + svelte-check (type checking)
npm run check:watch
```

There is no test suite, linter, or formatter configured — `npm run check` is the only verification step.

## Architecture

### Content flows from Sanity, not from the repo

Everything editable (courses, instructors, featured subjects, refund policy, class format, copy) lives in Sanity project `snhw886v`, dataset `production`, read through the public read-only client in `src/lib/stores/stores.ts` → `src/lib/stores/sanityClient.ts`. Recent commit history is largely a migration of hardcoded strings into CMS fields — when you find a hardcoded label that an admin would plausibly want to change, the repo convention is to pull it from Sanity instead.

There are **no SvelteKit `load` functions anywhere**. `stores.ts` calls `fetchInstructors()`, `fetchCourses()`, and `fetchFeaturedSubjects()` at module scope, so importing any store triggers the fetch, and pages consume them reactively (`$courses`, `$teachers`, …). Consequences to keep in mind:

- Prerendered/SSR HTML renders with empty stores; content populates on the client. Guard with `{#if course}` style checks, as `src/routes/classes/[slug]/+page.svelte` does.
- The "derived" stores (`teachers`, `tas`, `officers`, `openCourses`, `closedCourses`) are plain writables filled by filtering inside the fetch functions — not `derived()`. Never sort/filter them in place in a component; copy first.
- `src/lib/types.ts` mirrors the Sanity schema. Types marked `@deprecated` there are leftovers from the pre-CMS era; don't use them in new code.

### SCSS globals are auto-injected

`svelte.config.js` uses `svelte-preprocess` with `prependData: "@import './src/global.scss';"`, so every `<style lang="scss">` block already has the variables and mixins from `src/global.scss` in scope — `$primary`, `$secondary`, `$accent`, `$background-color`, `$text-color`, `$nav-height`, `$mobile-width`, `@include button-primary`, `@include button-secondary`, `@include invisible-button`. Do **not** add an `@import` for it; that causes duplicate output. Use `$mobile-width` for responsive breakpoints and `$nav-height` when offsetting for the fixed navbar.

### Routing quirks

- `/subjects/[slug]` is not a real page — it queries Sanity for the `featured == true` course in that subject and `goto`s `/classes/<slug>`, showing a "we don't offer classes for X" message otherwise. Subject matching is case-insensitive on both sides.
- The navbar "Our classes" dropdown is generated from the `uiCopy` document's `featuredSubjects` array, lowercased into `/subjects/<subject>` links.
- `src/hooks.ts` (note: `hooks.ts`, not `hooks.server.ts`) rewrites the `biobrawl.*` subdomain onto `/bio-brawl`. `Navbar.svelte` links to `/bio-brawl` on localhost and `https://biobrawl.helix-ed.org` in production.

### Prerendering and SEO

`svelte.config.js` lists prerender `entries` explicitly, and `handleHttpError` swallows 404s under `/classes/` and `/subjects/` (they're client-rendered). **Adding a new static route requires adding it to that `entries` array**, and typically also to `static/sitemap.xml`.

SEO metadata (title, OG, Twitter, canonical, preloads, deferred Google Analytics) lives in `src/app.html`, not in per-page `<svelte:head>`. Security and cache headers are set in two places that must stay consistent: `src/hooks.ts` and `vercel.json`.

`SEO-OPTIMIZATION.md` documents a full audit of this area, including several unresolved critical issues (robots.txt blocking `/_app/`, a sitewide homepage canonical, empty server-rendered course pages). Read it before touching `app.html`, `static/robots.txt`, `static/sitemap.xml`, or the prerender config.

### Images

Static assets served from `/` come from `static/`. Bundled images are imported from `$lib/images/*` and processed by `vite-imagetools`, which defaults every import to WebP at quality 80 (`vite.config.ts`). Sanity images arrive as plain URLs via the `"imageUrl": image.asset->url` projection in the GROQ queries. `OptimizedImage.svelte` exists but is currently unused.

## Gotchas

- `@sanity/client` and `@sanity/image-url` are in `optimizeDeps.exclude`; re-including them reintroduces chunk-loading errors.
- `svelte.config.js` imports `svelte-preprocess`, which is not a direct dependency in `package.json` — it resolves only because `svelte-check` pulls it in. Don't remove `svelte-check` without adding `svelte-preprocess` explicitly.
- `@sveltejs/adapter-vercel` is installed but `svelte.config.js` uses `adapter-auto` (which picks Vercel automatically in CI).
- `stores.ts` has `console.log` subscriptions on `instructors` and `courses` that fire on every update.
