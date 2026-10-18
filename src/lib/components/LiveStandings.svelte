<script lang="ts">
	import type { PublicStandingsPayload } from '$lib/public/types';
	export let standings: PublicStandingsPayload;
	const decisions = { HEAD_TO_HEAD: 'Head-to-head', POINTS_FOR: 'Points for', POINTS_AGAINST: 'Points against', COIN_FLIP: 'Recorded coin flip', TIEBREAKER_MATCH: 'Tiebreaker match' };
</script>

<section aria-label="Round-robin standings">
	<h2>Round-robin standings</h2>
	<p>Only verified results contribute. Provisional rankings may change.</p>
	{#each standings.divisions as division}
		<h3>{division.name}</h3>
		{#each division.pools as pool}
			{#if pool.pool}<h4>{pool.pool}</h4>{/if}
			{#if pool.standings.length}
				<!-- Keyboard scrolling is needed for the full statistics table on phones. -->
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<div class="table-scroll" role="region" aria-label={`${division.name}${pool.pool ? ` · ${pool.pool}` : ''} standings`} tabindex="0">
					<table>
						<caption>{division.name}{pool.pool ? ` · ${pool.pool}` : ''} round-robin standings</caption>
						<thead><tr><th scope="col">Rank</th><th scope="col">Team</th><th scope="col">Played</th><th scope="col">W</th><th scope="col">T</th><th scope="col">L</th><th scope="col">Points for</th><th scope="col">Points against</th><th scope="col">Ranking points</th><th scope="col">Notes</th></tr></thead>
						<tbody>
							{#each pool.standings as row}
								<tr><td>{row.rank}</td><th scope="row">{row.team.name}</th><td>{row.matchesPlayed}</td><td>{row.wins}</td><td>{row.ties}</td><td>{row.losses}</td><td>{row.pointsFor}</td><td>{row.pointsAgainst}</td><td>{row.rankingPoints ?? 'Pending'}</td>
									<td>{#if row.provisional}Provisional. {/if}{#if row.unresolved === 'TIEBREAKER_MATCH_NEEDED'}Tiebreaker match needed.{:else if row.unresolved === 'COIN_FLIP_NEEDED'}Coin flip needed.{/if}{#if row.decidedBy}{decisions[row.decidedBy]}.{/if}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}<p>No verified standings yet.</p>{/if}
		{/each}
	{/each}
	{#if !standings.divisions.length}<p>No verified standings yet.</p>{/if}
</section>

<style>
	.table-scroll { max-width: 100%; overflow-x: auto; border: 1px solid #d8e1dc; border-radius: 10px; }
	table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
	caption { text-align: left; font-weight: 600; padding: 14px; }
	th, td { padding: 12px; text-align: left; border-top: 1px solid #d8e1dc; white-space: nowrap; }
	thead { background: #f2f6f3; }
	td:last-child { white-space: normal; min-width: 150px; }
	h3 { margin-top: 24px; }
</style>
