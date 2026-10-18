import { error } from '@sveltejs/kit';
import { archiveYears, readArchive } from '$lib/server/archives';
import type { PageServerLoad } from './$types';

export const prerender = true;
export const entries = () => archiveYears().map(eventID => ({ eventID }));
export const load: PageServerLoad = ({ params }) => {
	const archive = readArchive(params.eventID);
	if (!archive) error(404, 'Results are not available for this year.');
	return { archive };
};
