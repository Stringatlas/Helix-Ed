import { navigationEvents } from '$lib/server/archives';

// `09` §2.1: shared navigation must be independent of Sanity too.
export const load = () => ({ events: navigationEvents() });
