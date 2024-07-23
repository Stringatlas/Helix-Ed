import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

const config = {
    preprocess: preprocess({
        scss: {
            prependData: "@import './src/global.scss';"
        },
    }),
    kit: {
        adapter: adapter()
    }
};


export default config;