import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

const config = {
    preprocess: preprocess({
        scss: {
            prependData: "@import './src/variables.scss';"
        },
    }),
    kit: {
        adapter: adapter({ runtime: 'nodejs22.x' }),
        prerender: {
            handleMissingId: 'warn'
        },
        alias: {
            $lib: './src/lib',
            $components: './src/lib/components',
            $stores: './src/lib/stores'
        },
        // Enable inlining of small modules for better performance
        inlineStyleThreshold: 1024
    }
};


export default config;