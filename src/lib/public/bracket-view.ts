import type { PublicBracketDivision, PublicBracketMatch, PublicSlotSource } from './types';

// `05` §7: positions are presentation only; sources and advancement come from
// the public payload. Neither this module nor the component folds match rules.
export function sourceLabel(source: PublicSlotSource): string {
	return source.kind === 'SEED' ? `Seed ${source.n}`
		: `${source.kind === 'WINNER' ? 'Winner' : 'Loser'} of ${source.slot}`;
}
export const statusLabel: Record<PublicBracketMatch['status'], string> = {
	final: 'Verified final', scheduled: 'Scheduled', in_progress: 'In progress',
	walkover: 'Walkover', empty: 'No match', not_needed: 'Reset not needed', unresolved: 'Awaiting resolution'
};
export function bracketView(division: PublicBracketDivision) {
	const rounds = [...new Set(division.matches.map(match => match.round))].sort((a, b) => a - b);
	const groups = rounds.map(round => ({ round, matches: division.matches.filter(match => match.round === round) }));
	const currentRound = division.matches.find(match => match.status === 'in_progress')?.round
		?? Math.max(1, ...division.matches.filter(match => match.status === 'final' || match.status === 'walkover').map(match => match.round));
	const nodes = division.matches.map(match => {
		const lane = division.matches.filter(other => other.round === match.round && other.side === match.side);
		const index = lane.findIndex(other => other.id === match.id);
		const band = match.side === 'winners' ? 0 : match.side === 'losers' ? 760 : 380;
		const span = match.side === 'winners' ? 760 : match.side === 'losers' ? 440 : 200;
		return { match, x: 24 + (match.round - 1) * 272, y: band + (index + 0.5) * span / lane.length - 90 };
	});
	const edges = nodes.flatMap(node => [node.match.topSource, node.match.bottomSource].flatMap((source, side) => {
		if (source.kind === 'SEED') return [];
		const from = nodes.find(other => other.match.id === source.slot);
		if (!from) return [];
		const x1 = from.x + 240, y1 = from.y + 90, x2 = node.x, y2 = node.y + (side ? 133 : 72);
		const mid = x1 + (x2 - x1) / 2;
		return [{ kind: source.kind, path: `M ${x1} ${y1} H ${mid} V ${y2} H ${x2}` }];
	}));
	return { groups, currentRound, nodes, edges, width: 48 + Math.max(1, ...rounds) * 272, height: 1220 };
}
