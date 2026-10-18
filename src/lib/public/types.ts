/**
 * C3 — the wire contract (`05` §4–§5; bracket D-164/D-165, `11` §52).
 * No imports: the site can copy this file without the app or Firebase.
 * Instants are UTC ISO-8601; eventID is the four-digit year, not a slug.
 * Only a witnessed, verified result can contain score fields. A walkover is
 * a result, but has no invented score. Public payloads never contain rosters.
 */
export type EventPhase = 'round_robin' | 'bracket' | 'complete';
export type PublicSlotId =
	| 'DE1a' | 'DE1b' | 'DE1c' | 'DE1d'
	| 'DE2a' | 'DE2b' | 'DE2c' | 'DE2d'
	| 'DE3a' | 'DE3b' | 'DE4a' | 'DE4b' | 'DE5' | 'DE6' | 'DE7';
export type PublicSlotSource =
	| { kind: 'SEED'; n: number }
	| { kind: 'WINNER' | 'LOSER'; slot: PublicSlotId };
export interface PublicTeam { id: string; name: string }
export interface PublicStanding {
	rank: number;
	team: PublicTeam;
	matchesPlayed: number;
	wins: number;
	ties: number;
	losses: number;
	pointsFor: number;
	pointsAgainst: number;
	/** Null while a forfeit award is pending, never a misleading partial total. */
	rankingPoints: number | null;
	provisional: boolean;
	decidedBy: 'HEAD_TO_HEAD' | 'POINTS_FOR' | 'POINTS_AGAINST' | 'COIN_FLIP' | 'TIEBREAKER_MATCH' | null;
	unresolved: 'TIEBREAKER_MATCH_NEEDED' | 'COIN_FLIP_NEEDED' | null;
}
export interface PublicStandingsDivision {
	name: string;
	pools: { pool: string | null; standings: PublicStanding[] }[];
}
interface PublicBracketBase {
	id: PublicSlotId;
	round: number;
	side: 'winners' | 'losers' | 'final';
	label: string;
	ifNecessary: boolean;
	topSource: PublicSlotSource;
	bottomSource: PublicSlotSource;
	seedTop: number | null;
	seedBottom: number | null;
	teamTop: PublicTeam | null;
	teamBottom: PublicTeam | null;
	/** A known empty source differs from an undecided feeder. */
	topKnown: boolean;
	bottomKnown: boolean;
	winner: PublicTeam | null;
}
export type PublicBracketMatch = PublicBracketBase & (
	| { status: 'final'; verified: true; scoreTop: number; scoreBottom: number }
	| { status: 'scheduled' | 'in_progress' | 'walkover' | 'empty' | 'not_needed' | 'unresolved';
		verified: false; scoreTop?: never; scoreBottom?: never }
);
export interface PublicBracketDivision {
	division: string;
	provisional: boolean;
	matches: PublicBracketMatch[];
	champion: PublicTeam | null;
	runnerUp: PublicTeam | null;
	finalUnresolved: boolean;
	coFinalists: PublicTeam[];
}
export interface PublicStandingsPayload {
	eventID: string;
	phase: EventPhase;
	generatedAt: string;
	divisions: PublicStandingsDivision[];
}
export interface PublicBracketPayload {
	eventID: string;
	phase: EventPhase;
	generatedAt: string;
	divisions: PublicBracketDivision[];
}
export interface PublicStatusPayload { eventID: string; phase: EventPhase; updatedAt: string }
export interface PublicPlace { rank: number; team: string; award?: string }
export interface ParticipationRecord {
	teamsRegistered: number;
	teamsPlayed: number;
	studentsRostered: number;
	studentsPlayed: number;
	schools: string[];
	states: string[];
	statesRepresented: number;
	divisionBreakdown: { division: string; teams: number; students: number }[];
}
export interface IndividualAward {
	scope: 'RR' | 'DE' | 'ALL';
	division: string;
	category: string | null;
	recipient: string;
	team: string;
	netTossupPoints: number;
	tossupsCorrect: number;
	interruptsPenalised: number;
	questionsHeard: number;
	tiebreakStep: number | null;
	coAward: boolean;
}
export interface EventMetadata {
	eventID: string;
	year: number;
	name: string;
	/** Calendar date of the competition (in the event's zone), not an instant. */
	date: string;
	location: string;
}
export interface EventSnapshot extends EventMetadata {
	snapshotVersion: 1;
	results: {
		divisions: { name: string; places: PublicPlace[] }[];
		bracketData: PublicBracketDivision[];
		description?: string;
		/** Deprecated historical iframe, never generated for new events. */
		eliminationBracket?: string;
	};
	individualAwards?: IndividualAward[];
	participation: ParticipationRecord;
	provenance: {
		computedAt: string;
		computedBy: string;
		sourceEventLog: string;
		verifiedMatchesOnly: true;
		notes?: string;
		unverifiedYear?: boolean;
	};
}
