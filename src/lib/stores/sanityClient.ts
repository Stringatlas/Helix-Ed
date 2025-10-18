import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: "j0eueaqb",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, // Use CDN for better performance
  perspective: 'published', // Only fetch published content
  resultSourceMap: false, // Disable source maps for better performance
  stega: false // Disable stega encoding
});
