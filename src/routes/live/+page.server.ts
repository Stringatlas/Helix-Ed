import { activeEvent, readArchive } from '$lib/server/archives';

/** `09` §11.1: only committed metadata crosses the build boundary. The live
 * API is a browser concern; an outage cannot prevent this shell from building. */
export const prerender = true;
export const load = () => {
	const event = activeEvent();
	const archive = event ? readArchive(event.eventID) : null;
	return { event, snapshot: archive?.kind === 'snapshot' ? archive.snapshot : null };
};
