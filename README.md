# Biobrawl

BioBrawl is a competitive biology program by Helix-Ed that engages students through challenging problem sets and guided instruction, helping them develop critical thinking skills and prepare for advanced coursework and competitions.

[www.biobrawl.helix-ed.org](https://biobrawl.helix-ed.org/)

## Tech stack

- **SvelteKit** — application framework, routing, and server hooks
- **TypeScript** — typed application code and content models
- **SCSS** — global styles, shared variables, and component styling
- **Sanity** — published event, result, and FAQ content
- **Vite** — local development and production builds

Pages live in `src/routes`, reusable UI in `src/lib/components`, and Sanity queries in `src/lib/stores`.


## Results archive

Results now prerender from committed JSON, including shared navigation; Sanity is
used only for FAQ prose. Event and registration facts live in
`static/data/events.json`. See [the archive handoff](docs/results-archive.md) for
source limitations, the canonical snapshot format, validation and remaining work.

Run `npm run check`, `npm test`, `npm run build` and `npm run test:offline` before
opening a PR against **biobrawl**. The offline check proves archive pages build
without HTTP/TCP access and never publishes its synthetic fixture.
