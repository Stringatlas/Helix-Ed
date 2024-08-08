import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const host = event.request.headers.get('host');
    const url = new URL(event.request.url);

    if (host && host.startsWith('biobrawl.')) {
        url.pathname = `/bio-brawl${url.pathname}`;
        return resolve({ ...event, url });
    }

    return resolve(event);
};
