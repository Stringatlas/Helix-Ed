import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

const config = {
    preprocess: preprocess({
        scss: {
            prependData: "@import './src/variables.scss';"
        },
    }),
    kit: {
        adapter: adapter(),
        prerender: {
            handleHttpError: 'warn',
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