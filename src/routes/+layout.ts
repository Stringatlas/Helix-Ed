import { client } from '$lib/stores/sanityClient';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  const featuredSubjects: string[] = await client.fetch(`*[_type == "uiCopy"][0].featuredSubjects`);
  return { featuredSubjects: featuredSubjects ?? [] };
};
