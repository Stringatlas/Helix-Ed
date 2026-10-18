import { parseEventSnapshot } from './parse';
import type { EventSnapshot, PublicPlace } from './types';

/** `05` §6–§8: CMS records have no witnessed logs or defensible participation
 * totals. Migration must not manufacture evidence to fill EventSnapshot v1. */
export interface LegacyArchive {
	archiveVersion: 1;
	eventID: string;
	year: number;
	name: string;
	date: string;
	location: string;
	divisions: { name: string; places: PublicPlace[] }[];
	bracketUrl: string;
	provenance: {
		source: string;
		revision: string;
		sourceUpdatedAt: string;
		retrievedAt: string;
		unverifiedYear: true;
		notes: string;
	};
}
export type Archive =
	| { kind: 'snapshot'; snapshot: EventSnapshot }
	| { kind: 'legacy'; legacy: LegacyArchive };

function record(value: unknown, keys: string[]): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)
		|| Object.keys(value).some(key => !keys.includes(key))
		|| keys.some(key => !(key in value))) throw new Error('Invalid legacy archive');
	return value as Record<string, unknown>;
}
function text(value: unknown): string {
	if (typeof value !== 'string' || !value.trim()) throw new Error('Invalid legacy archive');
	return value;
}
export function parseArchive(value: unknown, expectedID: string): Archive {
	if (!/^\d{4}$/.test(expectedID)) throw new Error('Invalid archive year');
	if (value && typeof value === 'object' && 'snapshotVersion' in value) {
		const snapshot = parseEventSnapshot(value);
		if (snapshot.eventID !== expectedID) throw new Error('Archive year mismatch');
		return { kind: 'snapshot', snapshot };
	}
	const v = record(value, ['archiveVersion', 'eventID', 'year', 'name', 'date', 'location', 'divisions', 'bracketUrl', 'provenance']);
	if (v.archiveVersion !== 1 || v.eventID !== expectedID || v.year !== Number(expectedID)
		|| !Array.isArray(v.divisions)) throw new Error('Invalid legacy archive');
	const divisions = v.divisions.map(value => {
		const d = record(value, ['name', 'places']);
		if (!Array.isArray(d.places)) throw new Error('Invalid legacy archive');
		return { name: text(d.name), places: d.places.map(value => {
			const p = record(value, value && typeof value === 'object' && 'award' in value
				? ['rank', 'team', 'award'] : ['rank', 'team']);
			if (!Number.isInteger(p.rank) || Number(p.rank) < 1) throw new Error('Invalid legacy archive');
			return { rank: Number(p.rank), team: text(p.team), ...('award' in p ? { award: text(p.award) } : {}) };
		}) };
	});
	const p = record(v.provenance, ['source', 'revision', 'sourceUpdatedAt', 'retrievedAt', 'unverifiedYear', 'notes']);
	if (p.unverifiedYear !== true) throw new Error('Invalid legacy archive');
	const url = new URL(text(v.bracketUrl));
	if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com' || !url.pathname.startsWith('/spreadsheets/')) {
		throw new Error('Invalid legacy bracket URL');
	}
	return { kind: 'legacy', legacy: {
		archiveVersion: 1, eventID: expectedID, year: Number(expectedID), name: text(v.name),
		date: text(v.date), location: text(v.location), divisions, bracketUrl: url.href,
		provenance: { source: text(p.source), revision: text(p.revision), sourceUpdatedAt: text(p.sourceUpdatedAt),
			retrievedAt: text(p.retrievedAt), unverifiedYear: true, notes: text(p.notes) }
	} };
}


/** The directory is also a contract: legacy evidence must never masquerade as
 * a generated snapshot merely by being copied into results/ (`05` §5–§8). */
export function parseArchiveFile(path: string, json: string, expectedKind: Archive['kind']): [string, Archive] {
	const year = path.match(/\/(\d{4})\.json$/)?.[1];
	if (!year) throw new Error('Archive filenames must be four-digit years');
	const archive = parseArchive(JSON.parse(json), year);
	if (archive.kind !== expectedKind) throw new Error('Archive format does not match its directory');
	return [year, archive];
}
