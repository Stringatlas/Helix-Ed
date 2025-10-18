import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const host = event.request.headers.get('host');
    const url = new URL(event.request.url);

    if (host && host.startsWith('biobrawl.')) {
        url.pathname = `/bio-brawl${url.pathname}`;
        return resolve({ ...event, url });
    }

    const response = await resolve(event);
    
    // Add performance and security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Cache static assets aggressively
    if (url.pathname.startsWith('/static/') || 
        url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|woff2?|ttf)$/)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Cache HTML pages with revalidation
    else if (response.headers.get('content-type')?.includes('text/html')) {
        response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }
    
    return response;
};
