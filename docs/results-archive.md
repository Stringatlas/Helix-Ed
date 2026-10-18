# Results archive migration (3.10a)

This branch targets the existing `Stringatlas/Helix-Ed` **biobrawl** branch at
`8ca4da0`. It implements the archive slice of BioBrawl scoring's `docs/05` §5–§7
and `docs/09` §10.4. This is a review branch, not a production release or real 2027 publication.

The new snapshot contract, exact parsers and synthetic test fixture are copied
unchanged from `Helix-Ed/biobrawl-scoring` commit `57ba9d0` under
`src/lib/public/`. Update those copies together when the public contract changes;
never add Firebase or scoring-engine imports to the site.

## Data and review

- New reviewed snapshots belong at `static/data/results/<year>.json`. Only
  generated `EventSnapshot` version 1 is accepted there. The filename and event
  year must agree. Unknown fields, unverified scores and malformed records fail
  the build rather than becoming partial public results.
- `entries()` enumerates committed JSON. Adding a valid snapshot also adds its
  year to shared navigation, without editing the event catalog. Canonical
  snapshots supersede a legacy record for the same year. An absent year is a 404;
  there is no fallback to a live API or CMS.
- `static/data/events.json` now owns event metadata and registration facts. It is
  a reviewed copy of the published CMS records, not a second live CMS cache.
  Changes to registration links/open status, prizes and event facts must be
  reviewed here. The 2027 event date is January 16, not its publish date. Precise
  round schedule instants are not supplied by this export and are not invented.
- `static/data/legacy-results/{2024,2025,2026}.json` preserves only published
  placements, dates, names, prize labels and historical bracket links. This is
  explicitly a separate `LegacyArchive` format, **not** a witnessed snapshot.
  Each record contains the CMS document/revision/update time and export time.
  The pages disclose the absence of independently checked participation and
  match-by-match evidence. No counts are inferred from rosters, prose, school
  lists or prizes. The 2026 `TKTK` paragraph and unreconciled 2025 counts are
  deliberately omitted. This does not resolve those historical discrepancies.
- Historical brackets remain optional external links. They are not loaded as
  iframes. Reconstructing native historical brackets requires actual source
  evidence and remains open; no present-day tournament wiring is imposed on
  those years.

The legacy export came from the site's published, unauthenticated Sanity query
on 2026-10-18: project `j0eueaqb`, dataset `production`, API `2024-01-01`,
`*[_type == "event"] | order(date desc)`. Placement/prize projection matches the
previous site's adapter, including its existing Mock prize assignments; no award
ruling is introduced. Source revisions are retained on each legacy record.

## Rendering and independence

The route and parent navigation read bundled JSON; neither calls Sanity or the
scoring app at build, request or hydration time. Vite imports the public assets
as raw text, then validates JSON, so the same files work during development as
well as production. Direct public-directory JSON imports passed a production
build but broke development hydration; browser testing caught that gap.

The native bracket consumes all fifteen slots and their supplied sources. It
never advances a team or reconstructs competition rules. Scores appear only for
verified finals. Desktop uses a horizontally scrollable tree with SVG source
connections (loser paths dashed); mobile uses round accordions, opens the current
or most recently played round, and offers a full-tree toggle. The canonical
snapshot page includes participation distinctions, awards and source provenance.

Only the FAQ route fetches CMS prose, on the server, with a two-second timeout
and explicit unavailable state. Event metadata uses immutable readable stores;
SSR requests cannot mutate shared event state. Static HTML security/cache headers
are declared in `vercel.json`, since runtime hooks cannot protect prerendered
assets. The Vercel adapter uses an explicit Node 22 runtime; preprocessing is now
a declared dependency. Existing analytics remain asynchronous and do not supply
archive content. The automatic FAQ prefetch, obsolete global Sanity preconnect and duplicate static title
were removed from `app.html`.

## Validation

```sh
npm ci
npm run check
npm test
npm run build
npm run test:offline
```

Unit tests validate the scoring snapshot unchanged, legacy sources, privacy and
score refusals, filename/year binding, unknown-year behavior, navigation,
slot/edge counts and actual Svelte SSR output. They run with Vite's public
directory configured as `static`, catching the development-import regression.

`test:offline` copies source into a disposable directory, adds the synthetic C3
snapshot there only (using test year 2099 so a real 2027 PR remains valid), and builds with HTTP/fetch/TCP denied, including prerender
workers and Node children. A probe first proves the guard rejects all four
transport paths. The build must make zero attempts. It checks the three real
historical pages and synthetic page in both SvelteKit's prerender output and
Vercel static output, shared navigation, one correct title, native slots, visible
legacy limitations, no iframes/placeholders/CMS preconnect, and hosting header
configuration. It always removes the disposable directory. No synthetic 2027
snapshot is committed or deployed under `static/`.

GitHub archive CI and the automatic Vercel preview build both reported success
on the implementation commit `ff943c4`. Preview status alone does not verify
production headers, content or publication.

Local Chrome checks on 2026-10-18: 2026 division switching after hydration;
synthetic snapshot desktop tree; 390 × 844 round accordions, automatic round 6,
round 7's unneeded reset without scores, and full-tree toggle. The temporary
preview snapshot was removed and the viewport restored afterward.

## Still open

Founder/site-maintainer review and an actual production Vercel deployment check; real
2027 evidence/App setup/results PR; historical bracket/participation
reconstruction; production verification of the live consumer described below; complete UTC round
schedule and visitor-zone display; home/FAQ prerender and registration ISR. Those
are the remaining parts of 3.5/3.6/3.10. This branch does not complete their literal
done-when lines or confirm the actual GitHub App installation/target.


## Live consumer (3.5 site phase, stacked after PR #2)

`codex/live-results` starts from the still-open archive branch
`codex/results-prerender` at `a06ca4e`. Review and merge archive PR #2 first,
then retarget this phase to `biobrawl`. It does not merge or alter that base PR.
CI also runs for the temporary stacked base. The established site remains
Svelte 4; this phase does not attempt a framework upgrade.

`/live` is a prerendered shell. Its server load reads only the active committed
event and any same-year canonical snapshot. A missing live backend cannot block
SSR or build. Navigation includes Live results. A same-year snapshot takes
precedence, renders placements/native brackets and links to the full permanent
archive; on that page load the browser makes no live request. An already-open
live tab needs a reload/navigation after the archive deploy to consume it.
Historical legacy records are not promoted into canonical publication evidence.

Until an archive exists, `live-client.ts` polls only the fixed scoring origin's
three public v1 HTTP endpoints, without cookies, auth or database libraries.
Each cycle has a two-second deadline, including response-body parsing, and
aborts on disposal. Cycles cannot overlap. All three responses must pass the
copied exact C3 parsers, match the selected event and agree on phase before
replacing the view. Timestamp materialization may differ across cache refreshes;
the oldest timestamp labels the view. Mixed phases, backward timestamps,
far-future timestamps, malformed/failed responses and private-field drift retain
the last complete view and mark updates unavailable. No upstream body or error
is rendered. Browser APIs keep their global receiver: copying native timers
onto the clock object passed Node tests but threw in Chrome; the fixed wrappers
have a regression test and were checked in the browser.

Poll every ten seconds, or every thirty seconds after competition complete.
Completion remains reversible, so polling continues and a reopen restores the
normal interval. It never means results published. The view marks successful
responses older than sixty seconds stale even if the request itself succeeded.
During an outage the age continues increasing; a fresh tab has the specified
static unavailable message. Unmount aborts and excludes late responses/timers.

Standings use the server's ranks/order, pools, ties, ranking points (including
Pending), provisional states and tiebreak resolutions. The site derives no
competition outcome. The existing native bracket still renders scores only on
verified finals. Last-update timestamps display the visitor's zone and Pacific
event time when different. Published event date/time copy remains explicitly
Pacific; full UTC round schedule evidence and its visitor-zone schedule block
are still missing and are not invented here.

Validation on 2026-10-18: 27 tests pass, type checking is clean, Vercel production
build passes, and the extended offline proof builds both an unarchived live
shell (temporary test year 2098) and current-year snapshot view (2099), with zero
HTTP/fetch/TCP attempts. Both test years exist only in disposable build copies.
Legacy-only assertions now skip canonical archives so a later real snapshot PR
can pass the suite. Local Chrome checked the real unavailable shell, synthetic
healthy → outage → recovery, archive precedence, desktop and 390 × 844 layout.
At 390 px the document stays 390 px wide while the full statistics table scrolls
inside its own region. Temporary synthetic QA routes were removed and viewport
restored. Healthy results were injected only in the local QA harness; these
checks do not establish production API data, DNS, CORS or deployed headers.

Still required: merge/review both site phases, verify real production API/cache/
CORS and outage recovery on the exact site origin, verify hosting headers,
provide the full UTC schedule, and finish the other archive/publication gates
above. Neither this phase nor a successful Vercel preview freezes or publishes
an event, adds consent, or confirms GitHub App access.
