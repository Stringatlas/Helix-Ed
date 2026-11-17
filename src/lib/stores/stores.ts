import { readable } from 'svelte/store';
import catalogJson from '../../../static/data/events.json?raw';
import type { EventData } from '$lib/types';
const catalog = JSON.parse(catalogJson);

/** `09` §2.1/§10.4: event facts are reviewed in git, never fetched at import
 * time or written into global stores by concurrent SSR requests. */
export const currentEvent = readable<EventData | null>(
	(catalog as EventData[]).find(event => event.active) ?? null
);
