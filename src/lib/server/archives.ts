import catalogJson from '../../../static/data/events.json?raw';
import { parseArchiveFile, type Archive } from '$lib/public/archive';
import type { EventData } from '$lib/types';
const catalog = JSON.parse(catalogJson);

/** `05` §5–§6 and `09` §10.4: Vite embeds committed JSON at build time.
 * Neither prerender nor a dynamic parent layout needs the app, Sanity or a
 * deployment filesystem. A results PR needs only add its JSON file. */
const snapshots = import.meta.glob('/static/data/results/*.json', { eager: true, query: '?raw', import: 'default' });
const legacy = import.meta.glob('/static/data/legacy-results/*.json', { eager: true, query: '?raw', import: 'default' });
const files = new Map<string, Archive>();
for (const group of [legacy, snapshots]) {
	for (const [path, value] of Object.entries(group)) {
		const [year, archive] = parseArchiveFile(path, String(value), group === snapshots ? 'snapshot' : 'legacy');
		// Reviewed generated snapshots supersede historical migration records.
		files.set(year, archive);
	}
}
export const archiveYears = () => [...files.keys()].sort();
export function readArchive(year: string) {
	return files.get(year) ?? null;
}
export function navigationEvents(): (EventData & { hasResults: boolean })[] {
	const events = new Map<string, EventData>((catalog as EventData[]).map(event => [event.eventID, event]));
	for (const year of archiveYears()) {
		const archive = readArchive(year)!;
		const metadata = archive.kind === 'snapshot' ? archive.snapshot : archive.legacy;
		events.set(year, { ...events.get(year), eventID: year, year: metadata.year, name: metadata.name,
			date: metadata.date, location: metadata.location });
	}
	return [...events.values()].map(event => ({ ...event, hasResults: files.has(event.eventID) }))
		.sort((a, b) => b.year - a.year);
}
