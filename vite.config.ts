import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// `05` §5: committed JSON is both a downloadable asset and build input.
	server: { fs: { allow: ['static'] } },
	build: {
		// Enable minification with esbuild (faster and built-in)
		minify: 'esbuild',
		// Optimize CSS
		cssMinify: true,
		// Set target for modern browsers
		target: 'es2015',
		// Optimize chunk splitting
		rollupOptions: {
			output: {
				manualChunks(id) {
					// Let SvelteKit handle the chunking strategy
					if (id.includes('node_modules')) {
						if (id.includes('@sanity')) {
							return 'vendor-sanity';
						}
						if (id.includes('svelte')) {
							return 'vendor-svelte';
						}
					}
				}
			}
		}
	},
	optimizeDeps: {
		include: ['@sanity/client']
	},
	// Drop console logs and debugger in production
	esbuild: {
		drop: ['console', 'debugger'],
	}
});
