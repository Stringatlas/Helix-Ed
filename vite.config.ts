import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: [
			// Exclude problematic dependencies that cause chunk errors
			'@sanity/client',
			'@sanity/image-url'
		]
	},
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..']
		}
	},
	build: {
		// Performance optimizations
		target: 'es2015',
		cssCodeSplit: true,
		minify: 'esbuild',
		// Reduce chunk size warnings threshold
		chunkSizeWarningLimit: 1000
	}
});
