# SEO Optimization

Audit of helix-ed.org, 2026-07-28.

Findings were verified against the **live production site** (`curl` against `https://helix-ed.org` and the Sanity API), not just read from source. Evidence is quoted per finding. Line references point at the current `main` (`c2eee9f`).

## Summary

The site has a well-intentioned SEO layer — OG tags, a sitemap, a robots.txt, font preloading, deferred analytics — but four separate mechanisms are each independently preventing search engines from indexing the pages that matter:

1. `robots.txt` blocks the JavaScript bundle the site needs to render.
2. Every page declares the homepage as its canonical URL.
3. Course pages are server-rendered empty and have no crawlable links pointing at them.
4. The sitemap points at a domain that doesn't host the site.

Net effect: the homepage can rank, and little else can. Course pages — the highest commercial-intent pages on the site — are effectively invisible.

The root cause of the content problems is architectural: there are no SvelteKit `load` functions. `src/lib/stores/stores.ts` fetches from Sanity at module scope without awaiting, so server-rendered HTML is generated before the data arrives. Fixing SEO properly means moving CMS reads into `load` functions.

---

# Critical

## C1. `robots.txt` blocks all JS and CSS

**File:** `static/robots.txt`

```
Disallow: /_app/
```

Every bundle SvelteKit emits lives under that prefix. Confirmed from the live homepage HTML:

```
href="./_app/immutable/assets/0.DpEAdnlF.css"
```

Because nearly all content is client-rendered, Googlebot must execute the JS to see anything. This line forbids it from fetching that JS. It is the single most damaging line in the repository — it converts a client-rendered-content problem into a total rendering failure.

`Disallow: /*.xml$` additionally blocks `/sitemap.xml` itself, and `Disallow: /*.json$` blocks SvelteKit's `__data.json` client-navigation payloads.

**Fix.** Replace the file wholesale. The elaborate allow/disallow list provides no benefit — `Allow: /` is the default, and blocking build artifacts hurts rendering rather than helping.

```
# robots.txt for Helix-Ed
User-agent: *
Allow: /

Sitemap: https://helix-ed.org/sitemap.xml
```

**Verify after deploy:** Google Search Console → URL Inspection → *Test Live URL* → screenshot should show the rendered page, and "Page resources" should report no blocked resources.

---

## C2. Sitemap and robots.txt reference a domain that doesn't host the site

**Files:** `static/sitemap.xml` (all 8 `<loc>` entries), `static/robots.txt` (`Sitemap:` line and header comment)

Both point at `helix-ed.com`. That domain resolves, but serves an unrelated 1 KB dark placeholder page with a "HelixED" wordmark — not this application. Every path 404s:

```
helix-ed.com/           200   (placeholder page, not this site)
helix-ed.com/about-us   404
helix-ed.com/enroll     404
helix-ed.com/contact    404
helix-ed.com/robots.txt 404
helix-ed.com/sitemap.xml 404
```

If this sitemap was ever submitted to Search Console, every URL in it was rejected.

The sitemap is also stale in other ways: `lastmod` is hardcoded to `2025-10-17` across all entries, and both the subject-page and class-page sections are commented-out placeholders, so no course URL is ever discoverable.

**Fix.** Generate the sitemap from Sanity at request time instead of maintaining it by hand. Delete `static/sitemap.xml` and add `src/routes/sitemap.xml/+server.ts`:

```ts
import { client } from '$lib/stores/sanityClient';

const ORIGIN = 'https://helix-ed.org';

const STATIC_PAGES = [
	{ path: '/', priority: '1.0' },
	{ path: '/enroll', priority: '0.9' },
	{ path: '/about-us', priority: '0.8' },
	{ path: '/contact', priority: '0.7' },
	{ path: '/recruiting', priority: '0.6' },
	{ path: '/privacy-policy', priority: '0.3' },
	{ path: '/attributions', priority: '0.2' }
];

export async function GET() {
	const courses: { slug: string; date: string }[] = await client.fetch(
		`*[_type == "course" && defined(slug.current)]{ "slug": slug.current, "date": _updatedAt }`
	);

	const urls = [
		...STATIC_PAGES.map((p) => ({ loc: ORIGIN + p.path, priority: p.priority, lastmod: null })),
		...courses.map((c) => ({
			loc: `${ORIGIN}/classes/${encodeURIComponent(c.slug)}`,
			priority: '0.8',
			lastmod: c.date?.slice(0, 10) ?? null
		}))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) =>
			`  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
```

Note this drops `changefreq` and keeps `priority` only for continuity — Google ignores both. `lastmod` is the only hint it acts on, and it must be truthful.

**Also:** decide what `helix-ed.com` is for. If it's yours and not in use, 301 it to `helix-ed.org` so it can't accumulate a competing index entry. If it isn't yours, remove every reference to it from this repo.

---

## C3. Every page declares the homepage as its canonical

**File:** `src/app.html:16`

```html
<link rel="canonical" href="https://helix-ed.org/" />
```

`app.html` is the shared shell for every route and nothing overrides this — there is no `<svelte:head>` anywhere in `src/`. Verified live:

| URL | canonical served |
|---|---|
| `/` | `https://helix-ed.org/` |
| `/enroll` | `https://helix-ed.org/` |
| `/about-us` | `https://helix-ed.org/` |
| `/classes/biology-summer-2026` | `https://helix-ed.org/` |

A canonical tag is a directive telling Google "index that URL instead of this one." Every page on the site is currently instructing Google to drop it in favor of the homepage. This alone would keep `/enroll`, `/about-us`, `/contact`, `/recruiting`, and all course pages out of the index even if every other issue were fixed.

The same applies to `og:url`, `og:title`, `twitter:url` and friends (`app.html:20-34`) — all hardcoded to the homepage, so every shared link previews as the homepage.

**Fix.** Remove `canonical`, `title`, `description`, and the OG/Twitter block from `app.html`, and set them per route. Add `src/lib/components/Seo.svelte`:

```svelte
<script lang="ts">
	import { page } from '$app/stores';

	export let title: string;
	export let description: string;
	export let image: string = 'https://helix-ed.org/og-image.png';
	export let noindex: boolean = false;

	// Always the production origin — never $page.url.origin, which would emit
	// biobrawl.helix-ed.org / preview-deploy URLs as canonicals.
	$: canonical = `https://helix-ed.org${$page.url.pathname}`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#if noindex}<meta name="robots" content="noindex, follow" />{/if}

	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:site_name" content="Helix-Ed" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>
```

Then use it in every `+page.svelte`. Suggested copy:

| Route | Title | Description |
|---|---|---|
| `/` | Helix-Ed \| University-Led STEM Tutoring for Middle & High School | Affordable small-group courses in biology, chemistry, physics, math, and economics, taught by students from top universities. |
| `/enroll` | Courses & Enrollment \| Helix-Ed | Browse open Helix-Ed courses in biology, chemistry, physics, computer science, and economics, and register online. |
| `/about-us` | About Helix-Ed \| Our Instructors & Mission | Meet the university students behind Helix-Ed and learn how we teach deep conceptual understanding in STEM and economics. |
| `/contact` | Contact Helix-Ed | Questions about courses, enrollment, or tuition? Get in touch with the Helix-Ed team. |
| `/recruiting` | Teach with Helix-Ed \| Instructor Recruiting | Join Helix-Ed as an instructor or TA and teach STEM and economics to motivated middle and high school students. |
| `/classes/[slug]` | `{course.title} — {course.season} \| Helix-Ed` | Derive from `course.description`, truncated to ~155 chars. |

Keep titles under ~60 characters and descriptions between 120–158, or Google will rewrite them.

---

## C4. Course pages serve empty HTML

**Files:** `src/routes/classes/[slug]/+page.svelte`, `src/lib/stores/stores.ts:48-50`

`https://helix-ed.org/classes/biology-summer-2026` returns HTTP 200 and 9,863 bytes containing **zero** occurrences of the course title, dates, tuition, or registration status. The `<main>` is empty.

Cause: `stores.ts` calls `fetchInstructors()`, `fetchCourses()`, and `fetchFeaturedSubjects()` at module scope without awaiting them. Svelte's SSR render is synchronous, so it runs against empty arrays, `$courses.find(...)` yields `undefined`, and the page's `{#if course}` guard renders nothing. `/classes/` and `/subjects/` are also excluded from prerendering (`svelte.config.js:27-29`).

Google can sometimes render client-side content — but not here, because C1 blocks the JS needed to do it.

**Fix.** Move the read into a `load` function so the HTML is complete on arrival. Add `src/routes/classes/[slug]/+page.ts`:

```ts
import { error } from '@sveltejs/kit';
import { client } from '$lib/stores/sanityClient';
import type { Course } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const course: Course | null = await client.fetch(
		`*[_type == "course" && slug.current == $slug][0]{ ..., "posterUrl": poster.asset->url }`,
		{ slug: params.slug }
	);

	if (!course) throw error(404, 'Course not found');
	return { course };
};
```

and consume `export let data` in the page instead of reading the `courses` store. Do the same for `/enroll` (open/closed course lists) and `/about-us` (instructors).

Once every page that needs CMS data has a `load` function, delete the module-scope `fetchInstructors()` / `fetchCourses()` / `fetchFeaturedSubjects()` calls at `stores.ts:48-50`. Leaving them in means every page fetches the whole dataset twice.

**Optional follow-up:** to serve these as static files rather than per-request SSR, export `prerender = true` plus an `entries()` function from a `+page.server.ts` so the build enumerates course slugs from Sanity. This is faster but couples publishing a new course to a redeploy. Vercel ISR (via `@sveltejs/adapter-vercel`, already a dependency) is the middle ground. Plain SSR is sufficient for SEO and is the recommended starting point.

---

## C5. Course pages have no crawlable inbound links

**File:** `src/lib/components/CourseCard.svelte:10-19`

```svelte
<div class="card" role="button" tabindex="0"
     on:click={() => courseData.registrationOpen && goto("/classes/" + courseData.slug.current)}>
```

A repo-wide search for `href=` pointing at `/classes/` returns nothing. Course pages are reachable only by JavaScript click handlers, and they're absent from the sitemap. There is no path by which a crawler discovers them — they are fully orphaned.

Secondary consequences: cards are unreachable by middle-click / "open in new tab", and closed-registration cards are silently inert with no explanation.

**Fix.** Make the card a real anchor. This fixes crawlability, keyboard navigation, and the `on:keydown` Enter handler simultaneously:

```svelte
<a class="card" href="/classes/{courseData.slug.current}" class:disabled={!courseData.registrationOpen}>
	<!-- card content unchanged -->
</a>
```

with `text-decoration: none; color: inherit; display: block;` in the style block. Drop the `role="button"`, `tabindex`, `on:click`, and `on:keydown` attributes and the `goto` import.

Also link course pages from the subject pages (C6) so there is more than one crawl path.

---

# High

## H1. Identical `<title>` on every page, then overwritten on the client

**Files:** `src/app.html:10`, `src/routes/+layout.svelte:13-15`

Every route serves `Helix-Ed | University-Led Education for Academic Success` (verified live on `/`, `/enroll`, `/about-us`, `/classes/biology-summer-2026`).

Worse, the layout runs:

```ts
onMount(() => {
	document.title = "Helix-Ed";
});
```

so as soon as the page hydrates, the descriptive title is replaced by the bare word "Helix-Ed" — which is what appears in the browser tab, in bookmarks, and in the title Google sees when it renders the page.

**Fix.** Delete the `onMount` block in `+layout.svelte` entirely, and set titles per route via the `Seo` component from C3.

## H2. Identical meta description on every page

`app.html:12` — same string sitewide. Duplicate descriptions cause Google to discard them and synthesize its own snippet from page text, which for course pages currently means no text at all. Resolved by C3.

## H3. `/subjects/[slug]` is a client-side redirect, not an HTTP redirect

**File:** `src/routes/subjects/[slug]/+page.svelte:11-25`

The page ships a full HTML document, waits for hydration, queries Sanity for the featured course in that subject, then calls `goto()`. There is no 301/302, so no ranking signal passes to the destination, and the page itself has no content and no `<h1>`.

These are the only crawlable links in the navbar dropdown (`Navbar.svelte:43-45`), so every crawl path into your course catalog terminates at a blank page.

**Fix.** Convert to a server-side redirect. Replace the page with `src/routes/subjects/[slug]/+page.server.ts`:

```ts
import { redirect, error } from '@sveltejs/kit';
import { client } from '$lib/stores/sanityClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const course = await client.fetch(
		`*[_type == "course" && featured == true && lower(subject) == lower($subject)][0]{ "slug": slug.current }`,
		{ subject: params.slug }
	);

	if (!course?.slug) throw error(404, `We do not currently offer classes in ${params.slug}`);
	throw redirect(301, `/classes/${course.slug}`);
};
```

Use `301` only if the subject→course mapping is stable. If the featured course rotates each season, use `302` so search engines don't cache the mapping.

**Better long-term:** make `/subjects/biology` a real landing page listing all biology courses. Subject-level pages match how people actually search ("biology tutoring online") far better than season-specific course slugs do, and a redirect throws that opportunity away.

## H4. Server-rendered content is a build-time race condition

`/about-us` *does* contain instructor names in its HTML (`Justin Le`, `Priya Barke`, `Alex Chen` each appear 3×). `/enroll` does **not** — its `courses-container` is served empty:

```html
<section id="courses-section"><div class="courses-container"> </div>
```

Both pages are in the prerender list (`svelte.config.js:14-23`) and both read from module-scope-fetched stores. The difference is purely whether the in-flight Sanity request happened to resolve before that particular page was rendered during the build.

This means prerendered output varies between deploys with no code change. The C4 fix (`load` functions) eliminates it.

---

# Medium

## M1. `og:image` is the wrong size and aspect ratio

**File:** `src/app.html:23-25`

Declares `1200×630`, but `static/logo.png` is actually **895×279** — a wide, short wordmark. Facebook, LinkedIn, Slack, and iMessage will letterbox or crop it, and the mismatched declared dimensions can cause the preview to fail to render on first scrape.

**Fix.** Produce a real 1200×630 `static/og-image.png` (logo on a branded background with a short tagline) and reference it. `sharp` is already a dependency if you want to generate it in a build step. Course pages should use `course.posterUrl` where available.

## M2. Broken heading hierarchy

- `src/lib/components/CourseCard.svelte:31` renders `<h1>` per card, so `/enroll` ships one `<h1>` per course on top of the page's own `<h1>`.
- `src/routes/about-us/+page.svelte` contains 4 `<h1>` elements.
- `src/routes/classes/[slug]/+page.svelte` contains 2.
- `src/routes/attributions/+page.svelte` has no heading at all.
- `src/routes/subjects/[slug]/+page.svelte` opens at `<h2>`.

**Fix.** Exactly one `<h1>` per page, describing that page. Demote card titles to `<h3>` and section headings to `<h2>`. These are style-hooked, so update the SCSS selectors alongside — the existing `.course-title` class already carries the visual weight, so appearance need not change.

## M3. Nested `<main>` elements

`src/routes/+layout.svelte:22` wraps `<slot>` in `<main>`, and most pages open with their own `<main>`. Live output:

```html
<main class="svelte-1rha6co"><main class="svelte-166k8sa">
```

Invalid HTML and an accessibility landmark violation. Change the layout's wrapper to a `<div>`, or drop the per-page `<main>`.

## M4. A course slug contains a space

Sanity currently holds `computer science-summer-2026`, producing `/classes/computer%20science-summer-2026`. Percent-encoded spaces in URLs are ugly in SERPs, break bare-URL autolinking in most chat clients, and split analytics.

**Fix.** Correct the slug in Sanity to `computer-science-summer-2026` and 301 the old path. Add a `slugify` source function to the slug field in the Sanity schema so it can't recur.

## M5. No structured data

No JSON-LD anywhere. A course catalog is one of the best-supported rich result types Google offers.

**Fix.** Add `Organization` (with `logo`, `url`, `sameAs` pointing at the Instagram/Facebook/LinkedIn profiles already in `Footer.svelte`) to the root layout, and `Course` on `/classes/[slug]`:

```svelte
{@html `<script type="application/ld+json">${JSON.stringify({
	'@context': 'https://schema.org',
	'@type': 'Course',
	name: course.title,
	description: course.description,
	provider: { '@type': 'Organization', name: 'Helix-Ed', url: 'https://helix-ed.org' }
})}</script>`}
```

Validate with Google's Rich Results Test before shipping. Only mark up data that is actually visible on the page.

## M6. `biobrawl.helix-ed.org` and `/bio-brawl` are duplicate thin pages

`biobrawl.helix-ed.org` returns 200. `src/hooks.ts:7-10` rewrites it onto `/bio-brawl`, which is a four-line stub reading "Welcome to the Bio Brawl page!" — and it's in the prerender list. Both URLs currently inherit the homepage canonical (C3).

**Fix.** Either build the page out and give it its own canonical at one chosen URL, or mark it `noindex` until it has content. Pick one of the subdomain or the subpath as the real address and 301 the other.

## M7. Thin content on `/privacy-policy` and `/attributions`

`/privacy-policy` is a single sentence — "Our website does not collect any of your data" — which is also **factually wrong**: `app.html:101-114` loads Google Analytics (`G-6ZVCJ5W4EP`), which sets cookies and collects usage data. That's a legal exposure independent of SEO, and it's worth fixing on those grounds first.

`/attributions` is a bare list of outbound links with no heading and no `rel` attributes.

## M8. `static/service-worker.js` is dead code

Never registered anywhere in `src/`. Harmless today, but if it were ever wired up, its hardcoded `STATIC_CACHE` list and `helix-ed-v1` cache name would serve stale assets. Delete it or implement it properly via SvelteKit's `$service-worker` module.

---

# Low / informational

- **`meta name="keywords"`** (`app.html:13`) has been ignored by Google since 2009. Harmless, but it signals nothing and can be removed.
- **Sitemap `priority` and `changefreq`** are ignored by Google. Only `lastmod` matters, and only if accurate.
- **Duplicated header config.** Security and cache headers are set in both `src/hooks.ts:15-27` and `vercel.json:9-52`. Not an SEO problem, but they will drift; consolidate on `vercel.json` since it also covers static assets the hook never sees.
- **`www.helix-ed.org` correctly 308s** to the apex domain. No action needed.
- **No `.gitignore` in the repo**, so `node_modules/` and `.svelte-kit/` appear as untracked after any install. Unrelated to SEO, but worth fixing.

---

# Remediation plan

Ordered by impact per unit of effort. Phase 1 is roughly an hour and unblocks everything else.

### Phase 1 — Unblock indexing (quick wins)

- [ ] Rewrite `static/robots.txt`; remove `Disallow: /_app/`, `/*.xml$`, `/*.json$` **(C1)**
- [ ] Point the `Sitemap:` directive at `helix-ed.org` **(C2)**
- [ ] Delete the `onMount` title override in `+layout.svelte` **(H1)**
- [ ] Strip `canonical` / `title` / `description` / OG / Twitter from `app.html`, add `Seo.svelte`, apply to all 7 static routes **(C3, H2)**
- [ ] Fix the `og:image` dimensions or ship a real 1200×630 asset **(M1)**

### Phase 2 — Make course pages exist

- [ ] Add `+page.ts` load functions for `/classes/[slug]`, `/enroll`, `/about-us` **(C4)**
- [ ] Remove the module-scope fetch calls in `stores.ts:48-50` **(C4, H4)**
- [ ] Convert `CourseCard` to an `<a href>` **(C5)**
- [ ] Convert `/subjects/[slug]` to a server-side redirect **(H3)**
- [ ] Replace `static/sitemap.xml` with a generated `sitemap.xml/+server.ts` including course URLs **(C2)**
- [ ] Apply `Seo.svelte` to `/classes/[slug]` with per-course title and description **(C3)**

### Phase 3 — Structure and polish

- [ ] One `<h1>` per page; demote card and section headings **(M2)**
- [ ] Remove the nested `<main>` **(M3)**
- [ ] Fix the `computer science-summer-2026` slug and add `slugify` to the Sanity schema **(M4)**
- [ ] Add `Organization` and `Course` JSON-LD **(M5)**
- [ ] Resolve the bio-brawl duplicate; `noindex` until it has content **(M6)**
- [ ] Rewrite the privacy policy to reflect that Google Analytics is in use **(M7)**
- [ ] Delete `static/service-worker.js` **(M8)**

### Phase 4 — Domain and monitoring

- [ ] Decide what `helix-ed.com` is; 301 it to `helix-ed.org` if it's yours **(C2)**
- [ ] Verify `helix-ed.org` in Google Search Console and submit the new sitemap
- [ ] Run URL Inspection → Test Live URL on `/`, `/enroll`, and one `/classes/*` page; confirm the rendered screenshot shows real content and no blocked resources
- [ ] Consider real subject landing pages (`/subjects/biology`) targeting the queries people actually search **(H3)**

## How to re-verify

```bash
# Canonical should differ per page, not all point at "/"
for p in "" enroll about-us classes/biology-summer-2026; do
  curl -s "https://helix-ed.org/$p" | grep -o '<link rel="canonical"[^>]*>'
done

# Course content must be present in the raw HTML, before any JS runs
curl -s https://helix-ed.org/classes/biology-summer-2026 | grep -c "Biology"

# Bundles must not be blocked
curl -s https://helix-ed.org/robots.txt | grep "_app"   # expect no match
```
