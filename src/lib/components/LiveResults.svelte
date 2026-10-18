<script lang="ts">
	import Bracket from './Bracket.svelte';
	import LiveStandings from './LiveStandings.svelte';
	import { ageLabel, isStale, timeLabels, type LiveState } from '$lib/public/live-client';
	import type { EventSnapshot } from '$lib/public/types';
	import type { EventData } from '$lib/types';
	export let event: EventData | null;
	export let snapshot: EventSnapshot | null = null;
	export let state: LiveState = { bundle: null, unavailable: false, pending: false };
	export let now = 0;
	export let visitorZone = 'America/Los_Angeles';
	$: stale = isStale(state, now);
	$: labels = state.bundle ? timeLabels(state.bundle.updatedAt, visitorZone) : null;
	const phases = { round_robin: 'Round robin', bracket: 'Elimination bracket', complete: 'Competition complete' };
</script>

<header>
	<p class="eyebrow">BioBrawl · Results</p>
	<h1>{event ? `${event.name} results` : 'BioBrawl results'}</h1>
	{#if event}<p>{event.date}{event.time ? ` · ${event.time}` : ''}{event.location ? ` · ${event.location}` : ''}</p>{/if}
</header>

{#if snapshot}
	<div class="notice archive" role="status">
		<h2>Results archive available</h2>
		<p>The committed archive is available independently of live updates.</p>
		<a href={`/results/${snapshot.eventID}`}>View permanent results, participation and provenance</a>
	</div>
	{#if snapshot.provenance.unverifiedYear}<p>These historical results have not been independently verified.</p>{/if}
	{#each snapshot.results.divisions as division}
		<section><h2>{division.name} placements</h2><ol>{#each division.places as place}<li value={place.rank}>{place.team}{place.award ? ` · ${place.award}` : ''}</li>{/each}</ol></section>
	{/each}
	{#each snapshot.results.bracketData as division}<Bracket {division} />{/each}
{:else if !event}
	<p class="notice">No current competition is scheduled. Past results are available in the navigation.</p>
{:else}
	<div class="notice" class:stale role="status" aria-live="polite">
		{#if state.bundle}
			<strong>{stale ? 'Live updates unavailable' : phases[state.bundle.status.phase]}</strong>
			<p>Last updated {ageLabel(state.bundle.updatedAt, now)}.</p>
			{#if labels}<p><time datetime={state.bundle.updatedAt}>{labels.visitor}</time>{labels.event ? ` · Event time: ${labels.event}` : ''}</p>{/if}
			{#if stale}<p>Showing the last successful update. Results may have changed.</p>{/if}
			{#if state.bundle.status.phase === 'complete'}<p>Competition complete. Final results are awaiting publication; live updates will continue.</p>{/if}
		{:else}
			<strong>Live results are temporarily unavailable.</strong>
			<p>Final results will be posted here after the event.</p>
			{#if state.pending}<p>Checking for live updates…</p>{/if}
		{/if}
	</div>
	<noscript><p>Live updates require JavaScript. Committed archives remain available through Past competitions.</p></noscript>
	{#if state.bundle}
		<LiveStandings standings={state.bundle.standings} />
		<section aria-label="Elimination brackets"><h2>Elimination brackets</h2>
			{#each state.bundle.bracket.divisions as division (division.division)}<Bracket {division} />{/each}
			{#if !state.bundle.bracket.divisions.length}<p>The elimination bracket is not available yet.</p>{/if}
		</section>
	{/if}
{/if}

<style>
	header { padding: 24px 0 12px; }
	h1 { font-size: clamp(2rem, 5vw, 3rem); line-height: 1.15; }
	.eyebrow { color: #316b45; font-weight: 600; letter-spacing: 0.04em; }
	.notice { background: #f1f6f2; border: 1px solid #c6d9cb; border-left: 4px solid #316b45; border-radius: 10px; padding: 20px; margin: 16px 0 32px; }
	.notice.stale { background: #fff8e9; border-color: #c79b43; }
	.notice p { margin: 8px 0 0; }
	.notice h2 { margin-top: 0; }
	section { margin: 32px 0; min-width: 0; }
	li { padding: 6px; }
</style>
