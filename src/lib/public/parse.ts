import type {
	EventMetadata, EventSnapshot, IndividualAward, ParticipationRecord, PublicBracketDivision,
	PublicBracketMatch, PublicBracketPayload, PublicSlotId, PublicSlotSource, PublicStanding,
	PublicStandingsDivision, PublicStandingsPayload, PublicStatusPayload, PublicTeam
} from './types';

/**
 * C3's runtime half: JSON imports and JSON from disk are not TypeScript objects.
 * Exact objects also reject extra operational fields rather than blessing a
 * fixture containing a roster/token as a valid example of the public contract.
 * The mapped shape requires every declared field to have a parser, including
 * optional fields: changing types.ts without updating validation fails check.
 */
type Parser<T> = (value: unknown, path: string) => T;
function bad(path: string): never { throw new Error('Invalid public payload at ' + path); }
const string: Parser<string> = (v, p) => typeof v === 'string' && v.trim() ? v : bad(p);
const number: Parser<number> = (v, p) => typeof v === 'number' && Number.isFinite(v) ? v : bad(p);
const count: Parser<number> = (v, p) => { const n = number(v, p); return Number.isInteger(n) && n >= 0 ? n : bad(p); };
const positive: Parser<number> = (v, p) => { const n = count(v, p); return n > 0 ? n : bad(p); };
const boolean: Parser<boolean> = (v, p) => typeof v === 'boolean' ? v : bad(p);
const literal = <T extends string | boolean | number>(...values: T[]): Parser<T> => (v, p) => values.includes(v as T) ? v as T : bad(p);
const nullable = <T>(parse: Parser<T>): Parser<T | null> => (v, p) => v === null ? null : parse(v, p);
const optional = <T>(parse: Parser<T>): Parser<T | undefined> => (v, p) => v === undefined ? undefined : parse(v, p);
const array = <T>(parse: Parser<T>): Parser<T[]> => (v, p) => Array.isArray(v) ? v.map((x, i) => parse(x, p + '[' + i + ']')) : bad(p);
const object = <T extends object>(shape: { [K in keyof T]-?: Parser<T[K]> }): Parser<T> => (v, p) => {
	if (!v || typeof v !== 'object' || Array.isArray(v)) return bad(p);
	const input = v as Record<string, unknown>;
	if (Object.keys(input).some(k => !Object.hasOwn(shape, k))) return bad(p);
	const out: Record<string, unknown> = {};
	for (const [key, parser] of Object.entries(shape) as [string, Parser<unknown>][]) {
		const value = parser(input[key], p + '.' + key);
		if (value !== undefined) out[key] = value;
	}
	return out as T;
};
const eventID: Parser<string> = (v, p) => /^\d{4}$/.test(string(v, p)) ? v as string : bad(p);
export const utcInstant: Parser<string> = (v, p) => {
	const s = string(v, p);
	return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(s) && Number.isFinite(Date.parse(s))
		&& new Date(s).toISOString() === s.replace(/Z$/, s.includes('.') ? 'Z' : '.000Z') ? s : bad(p);
};
const date: Parser<string> = (v, p) => {
	const s = string(v, p);
	return /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s ? s : bad(p);
};
const phase = literal('round_robin', 'bracket', 'complete');
const slot = literal('DE1a', 'DE1b', 'DE1c', 'DE1d', 'DE2a', 'DE2b', 'DE2c', 'DE2d', 'DE3a', 'DE3b', 'DE4a', 'DE4b', 'DE5', 'DE6', 'DE7');
const team = object<PublicTeam>({ id: string, name: string });
const source: Parser<PublicSlotSource> = (v, p) => {
	if (v && typeof v === 'object' && 'kind' in v && v.kind === 'SEED') {
		const out = object<{ kind: 'SEED'; n: number }>({ kind: literal('SEED'), n: positive })(v, p);
		return out.n <= 8 ? out : bad(p);
	}
	return object<{ kind: 'WINNER' | 'LOSER'; slot: PublicSlotId }>({ kind: literal('WINNER', 'LOSER'), slot })(v, p);
};
const standing = object<PublicStanding>({
	rank: positive, team, matchesPlayed: count, wins: count, ties: count, losses: count,
	pointsFor: number, pointsAgainst: number, rankingPoints: nullable(number), provisional: boolean,
	decidedBy: nullable(literal('HEAD_TO_HEAD', 'POINTS_FOR', 'POINTS_AGAINST', 'COIN_FLIP', 'TIEBREAKER_MATCH')),
	unresolved: nullable(literal('TIEBREAKER_MATCH_NEEDED', 'COIN_FLIP_NEEDED'))
});
const standingsDivision = object<PublicStandingsDivision>({ name: string,
	pools: array(object({ pool: nullable(string), standings: array(standing) })) });
const base = {
	id: slot, round: positive, side: literal('winners', 'losers', 'final'), label: string, ifNecessary: boolean,
	topSource: source, bottomSource: source, seedTop: nullable(positive), seedBottom: nullable(positive),
	teamTop: nullable(team), teamBottom: nullable(team), topKnown: boolean, bottomKnown: boolean, winner: nullable(team)
};
const match: Parser<PublicBracketMatch> = (v, p) => {
	if (v && typeof v === 'object' && 'verified' in v && v.verified === true) {
		const out = object<Extract<PublicBracketMatch, { verified: true }>>({ ...base,
			status: literal('final'), verified: literal(true), scoreTop: number, scoreBottom: number })(v, p);
		if (!out.teamTop || !out.teamBottom || !out.topKnown || !out.bottomKnown || out.scoreTop === out.scoreBottom) return bad(p);
		const winner = out.scoreTop > out.scoreBottom ? out.teamTop : out.teamBottom;
		return out.winner?.id === winner.id && out.winner.name === winner.name ? out : bad(p);
	}
	return object<Extract<PublicBracketMatch, { verified: false }>>({ ...base,
		status: literal('scheduled', 'in_progress', 'walkover', 'empty', 'not_needed', 'unresolved'), verified: literal(false),
		scoreTop: optional((_, p) => bad(p)), scoreBottom: optional((_, p) => bad(p)) })(v, p);
};
const bracketDivision = object<PublicBracketDivision>({ division: string, provisional: boolean, matches: array(match),
	champion: nullable(team), runnerUp: nullable(team), finalUnresolved: boolean, coFinalists: array(team) });
const participation = object<ParticipationRecord>({ teamsRegistered: count, teamsPlayed: count,
	studentsRostered: count, studentsPlayed: count, schools: array(string), states: array(string), statesRepresented: count,
	divisionBreakdown: array(object({ division: string, teams: count, students: count })) });
const award = object<IndividualAward>({ scope: literal('RR', 'DE', 'ALL'), division: string, category: nullable(string),
	recipient: string, team: string, netTossupPoints: number, tossupsCorrect: count, interruptsPenalised: count,
	questionsHeard: count, tiebreakStep: nullable(positive), coAward: boolean });
const metadata: { [K in keyof EventMetadata]: Parser<EventMetadata[K]> } = {
	eventID, year: positive, name: string, date, location: string
};
const snapshot = object<EventSnapshot>({ ...metadata, snapshotVersion: literal(1),
	results: object({ divisions: array(object({ name: string, places: array(object({ rank: positive, team: string, award: optional(string) })) })),
		bracketData: array(bracketDivision), description: optional(string), eliminationBracket: optional(string) }),
	individualAwards: optional(array(award)), participation,
	provenance: object({ computedAt: utcInstant, computedBy: string, sourceEventLog: string,
		verifiedMatchesOnly: literal(true), notes: optional(string), unverifiedYear: optional(boolean) })
});

export const parsePublicStandings = (v: unknown): PublicStandingsPayload => object<PublicStandingsPayload>({ eventID, phase, generatedAt: utcInstant, divisions: array(standingsDivision) })(v, '$');
export const parsePublicBracket = (v: unknown): PublicBracketPayload => object<PublicBracketPayload>({ eventID, phase, generatedAt: utcInstant, divisions: array(bracketDivision) })(v, '$');
export const parsePublicStatus = (v: unknown): PublicStatusPayload => object<PublicStatusPayload>({ eventID, phase, updatedAt: utcInstant })(v, '$');
export function parseEventSnapshot(v: unknown): EventSnapshot {
	const out = snapshot(v, '$');
	if (out.year !== Number(out.eventID) || !out.date.startsWith(out.eventID + '-')) return bad('$.year');
	const p = out.participation;
	if (p.teamsPlayed > p.teamsRegistered || p.studentsPlayed > p.studentsRostered
		|| p.states.length !== p.statesRepresented || new Set(p.states).size !== p.statesRepresented) return bad('$.participation');
	if (p.divisionBreakdown.reduce((n, d) => n + d.teams, 0) !== p.teamsPlayed || p.divisionBreakdown.reduce((n, d) => n + d.students, 0) !== p.studentsPlayed) return bad('$.participation.divisionBreakdown');
	return out;
}
