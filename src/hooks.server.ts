import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const host = event.request.headers.get('host');
    const url = new URL(event.request.url);

    if (host && host.startsWith('biobrawl.') && url.pathname === '/') {
        url.pathname = '/bio-brawl';
        return Response.redirect(url.toString(), 301);
    }

    return resolve(event);
};
