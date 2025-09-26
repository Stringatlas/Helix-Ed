import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

const config = {
    preprocess: preprocess({
        scss: {
            prependData: "@import './src/variables.scss';"
        },
    }),
    kit: {
        adapter: adapter()
    }
};


export default config;