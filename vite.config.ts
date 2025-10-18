import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
	plugins: [
		sveltekit(),
		imagetools({
			defaultDirectives: (url) => {
				// Convert to WebP by default
				return new URLSearchParams({
					format: 'webp',
					quality: '80'
				});
			}
		})
	],
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
