# Bio Brawl 2026 winners

The code on this branch renders per-division podiums. The winner names themselves
are **content**, not code — they live in Sanity, so this branch alone will not
change what the site shows. `/results/2026` will keep displaying `TBD` until the
mutation below is applied.

## Winners

| Division | Rank | Team | Award |
|---|---|---|---|
| High School | 1st | Thiamine | $300 |
| High School | 2nd | IgM | $200 |
| Middle School | 1st | Dazzling DNA | $300 |
| Middle School | 2nd | BISV 3 | $200 |
| Mock Competition | 1st | Wayzata | $100 |
| Mock Competition | 2nd | Cortisol & BISV 6 | $100 |

Total awarded: **$1,200**.

## Applying it

Requires a Sanity token with write access to project `j0eueaqb`. Note the host is
`api.sanity.io` for writes — `apicdn.sanity.io` is read-only and will reject this.

```bash
curl -X POST \
  'https://j0eueaqb.api.sanity.io/v2024-01-01/data/mutate/production' \
  -H "Authorization: Bearer $SANITY_WRITE_TOKEN" \
  -H 'Content-Type: application/json' \
  -d @winners-2026.json
```

Alternatively, enter the values by hand in Sanity Studio — but see the schema
caveat below, because the fields will not be visible there yet.

## ACTION REQUIRED before this goes live

1. **Fill the `TKTK` placeholders** in `results.description`. It currently reads
   "attracted TKTK teams with TKTK participants from TKTK". The 2026 document had
   been carrying the 2025 summary verbatim (14 teams, 56 participants, a specific
   school list), which is why it needs replacing rather than keeping. I did not
   invent 2026 numbers.

2. **Confirm the "Mock Competition" label.** The source spreadsheet showed this
   block unlabelled — two Middle School teams, ranked 1 and 2, both awarded $100.
   "Mock Competition" is an inference from the event document's `mock` field
   (a practice round on January 3, 2026). The elimination bracket does not
   corroborate it: Cortisol, BISV 6 and Wayzata CMS all appear as ordinary
   round-robin teams. If this block is actually something else — a per-group
   award, or a third-place tie — change the `name` on the `mock` division.

3. **Confirm "Wayzata" vs "Wayzata CMS".** The awards sheet says `Wayzata`; the
   published elimination bracket calls the same team `Wayzata CMS`. The patch uses
   `Wayzata`. Pick whichever should appear publicly.

4. **Add `divisions` to the Sanity Studio schema.** Sanity's API is schemaless, so
   the mutation above will write and the site will render it — but the field will
   not appear in Studio until the schema declares it, meaning nobody can edit next
   year's results through the UI. The Studio schema is not in this repository. The
   shape to add, matching `src/lib/types.ts`:

   ```
   results.divisions[]  ->  { name: string, places[] -> { rank: number, team: string, award: number } }
   ```

   Until that lands, treat this JSON file as the source of truth.

## Backwards compatibility

`results.winners` (the flat `first`/`second`/`third` used by the 2024 and 2025
events) is untouched and still renders. `Podium.svelte` falls back to it whenever
`divisions` is absent, so the older results pages are unaffected.
