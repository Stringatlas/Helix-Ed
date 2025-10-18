import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);
    
    // Add security and performance headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Add caching headers for static assets
    if (event.url.pathname.startsWith('/images/') || 
        event.url.pathname.startsWith('/static/') ||
        event.url.pathname.match(/\.(jpg|jpeg|png|webp|svg|gif|ico|pdf|ttf|woff|woff2)$/)) {
        // Cache static assets for 1 year
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (event.url.pathname === '/' || event.url.pathname.startsWith('/faq') || event.url.pathname.startsWith('/register')) {
        // Cache pages for 5 minutes with revalidation
        response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');
    }
    
    return response;
};
