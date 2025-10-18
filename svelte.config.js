import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

const config = {
    preprocess: preprocess({
        scss: {
            prependData: "@import './src/global.scss';"
        },
    }),
    kit: {
        adapter: adapter(),
        prerender: {
            // Prerender static pages for better performance
            entries: [
                '/',
                '/about-us',
                '/enroll',
                '/contact',
                '/bio-brawl',
                '/recruiting',
                '/privacy-policy',
                '/attributions'
            ],
            // Handle dynamic routes gracefully
            handleHttpError: ({ path, referrer, message }) => {
                // Ignore 404s for dynamic routes during prerendering
                if (path.startsWith('/classes/') || path.startsWith('/subjects/')) {
                    return;
                }
                throw new Error(message);
            }
        },
        // Enable inlining for better performance
        inlineStyleThreshold: 2048
    }
};


export default config;