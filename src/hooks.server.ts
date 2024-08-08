/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const host = event.url.hostname;

    if (host.startsWith('biobrawl.')) {
        event.url.pathname = '/biobrawl' + event.url.pathname;
    }

    const response = await resolve(event, {
            transformPageChunk: ({ html }) =>
                html.replace('%svelte.head%', '<meta name="subdomain" content="biobrawl">')
        });
    return response;
}
