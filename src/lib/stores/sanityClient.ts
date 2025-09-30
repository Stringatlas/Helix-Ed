import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: "j0eueaqb",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
  requestTagPrefix: 'helix-ed'
});
