<script lang="ts">
	import type { PublicBracketMatch } from '$lib/public/types';
	import { sourceLabel, statusLabel } from '$lib/public/bracket-view';
	export let match: PublicBracketMatch;
</script>

<article class="match" aria-label={`${match.id}: ${match.label}`}>
	<header><strong>{match.id}</strong><span>{statusLabel[match.status]}</span></header>
	{#each ['top', 'bottom'] as side}
		{@const top = side === 'top'}
		{@const team = top ? match.teamTop : match.teamBottom}
		{@const seed = top ? match.seedTop : match.seedBottom}
		{@const known = top ? match.topKnown : match.bottomKnown}
		{@const source = top ? match.topSource : match.bottomSource}
		<div class="team-row" class:winner={team && match.winner?.id === team.id}>
			<span class="seed" aria-label={seed ? `Seed ${seed}` : undefined}>{seed ?? '·'}</span>
			<span class="team-name" title={team?.name}>{team?.name ?? (known ? 'No team' : sourceLabel(source))}</span>
			{#if match.verified && match.status === 'final'}
				<strong class="score">{top ? match.scoreTop : match.scoreBottom}</strong>
			{/if}
			<small>{sourceLabel(source)}</small>
		</div>
	{/each}
	{#if match.status === 'walkover' && match.winner}<small class="outcome">{match.winner.name} advances</small>{/if}
</article>

<style lang="scss">
	.match { height: 180px; padding: 10px 12px; border: 1px solid $border-color; border-radius: $radius-lg; background: white; box-shadow: $shadow-sm; }
	header { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; margin-bottom: 6px; }
	header span { color: #555; }
	.team-row { display: grid; grid-template-columns: 22px 1fr auto; gap: 2px 6px; padding: 5px 0; min-height: 60px; }
	.team-row + .team-row { border-top: 1px solid $border-color; }
	.team-name { font-size: 14px; line-height: 1.25; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere; }
	.winner .team-name { font-weight: 700; color: $primary-dark; }
	.seed { font-size: 12px; color: #555; }
	.score { font-size: 14px; }
	small { grid-column: 2 / 4; font-size: 11px; line-height: 1.2; color: #555; }
	.outcome { display: block; }
</style>
