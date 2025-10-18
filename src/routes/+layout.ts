// Enable prerendering for static pages and proper preloading
export const prerender = false; // Set to true if all pages can be prerendered
export const ssr = true; // Server-side rendering enabled
export const csr = true; // Client-side rendering enabled

// Load data for all routes
export const load = async () => {
    return {};
};
