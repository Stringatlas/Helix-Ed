/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const host = event.url.hostname; // Get the hostname from the request URL

    if (host.startsWith('cool.')) {
        // Rewrite the URL path to the 'cool' page if accessed via 'cool.example.com'
        event.url.pathname = '/cool' + event.url.pathname;
    }

    const response = await resolve(event, {
            transformPageChunk: ({ html }) =>
                html.replace('%svelte.head%', '<meta name="subdomain" content="biobrawl">')
        });
    return response;
}
