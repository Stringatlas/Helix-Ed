<script lang="ts">
	import type { PublicBracketDivision } from '$lib/public/types';
	import { bracketView } from '$lib/public/bracket-view';
	import BracketMatch from './BracketMatch.svelte';

	export let division: PublicBracketDivision;
	let fullTree = false;
	$: view = bracketView(division);
</script>

<section class="bracket" aria-label={`${division.division} elimination bracket`}>
	<h3>{division.division}</h3>
	{#if division.provisional}<p>Provisional bracket</p>{/if}
	{#if division.finalUnresolved}<p>The final is awaiting resolution.</p>{/if}
	{#if division.champion}<p><strong>Champion:</strong> {division.champion.name}</p>{/if}
	{#if division.runnerUp}<p><strong>Runner-up:</strong> {division.runnerUp.name}</p>{/if}
	<button class="view-toggle" type="button" aria-pressed={fullTree} on:click={() => fullTree = !fullTree}>
		{fullTree ? 'View by round' : 'View full bracket'}
	</button>
	<div class="rounds" class:full-tree={fullTree}>
		{#each view.groups as group (group.round)}
			<details open={group.round === view.currentRound}>
				<summary>Round {group.round} · {[...new Set(group.matches.map(match => match.label))].join(' / ')}</summary>
				<div class="round-matches">
					{#each group.matches as match (match.id)}<BracketMatch {match} />{/each}
				</div>
			</details>
		{/each}
	</div>
	<!-- Keyboard focus lets readers scroll a wide bracket with arrow keys. -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div class="tree-scroll" class:full-tree={fullTree} tabindex="0" role="region" aria-label="Full bracket, scroll horizontally">
		<div class="tree" style:width={`${view.width}px`} style:height={`${view.height}px`}>
			<svg width={view.width} height={view.height} aria-hidden="true">
				{#each view.edges as edge}<path d={edge.path} class:loser={edge.kind === 'LOSER'} />{/each}
			</svg>
			<span class="lane" style:top="0px">Winners bracket</span>
			<span class="lane" style:top="780px">Losers bracket · dashed lines show losing teams</span>
			{#each view.nodes as node (node.match.id)}
				<div class="node" data-slot={node.match.id} style:left={`${node.x}px`} style:top={`${node.y + 20}px`}>
					<BracketMatch match={node.match} />
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.bracket { margin: $spacing-xl 0; }
	.view-toggle { display: none; padding: 10px 16px; border: 1px solid $primary; border-radius: $radius-md; background: white; color: $primary-dark; font: inherit; margin-bottom: 16px; cursor: pointer; }
	.rounds { display: none; }
	.tree-scroll { overflow-x: auto; border: 1px solid $border-color; border-radius: $radius-lg; background: $background-light; }
	.tree { position: relative; }
	svg { position: absolute; inset: 20px 0 0; overflow: visible; }
	path { fill: none; stroke: #748079; stroke-width: 1.5; }
	path.loser { stroke-dasharray: 5 5; }
	.node { position: absolute; width: 240px; }
	.lane { position: absolute; left: 24px; font-size: 12px; font-weight: 600; }
	.round-matches { display: grid; gap: 12px; padding: 12px 0; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
	summary { cursor: pointer; font-weight: 600; padding: 14px 0; }
	details { border-bottom: 1px solid $border-color; }
	@media (max-width: $mobile-width) {
		.view-toggle, .rounds { display: block; }
		.tree-scroll { display: none; }
		.tree-scroll.full-tree { display: block; }
		.rounds.full-tree { display: none; }
	}
</style>
