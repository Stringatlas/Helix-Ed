import { client } from '$lib/stores/sanityClient';
import type { Instructor } from '$lib/types';
import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async () => {
  const query = `*[_type == "instructor"]{..., "imageUrl": image.asset->url}`;
  const instructors: Instructor[] = await client.fetch(query);

  const sortBySortOrder = (a: Instructor, b: Instructor) => (a.sortOrder || 999) - (b.sortOrder || 999);

  const teachers = instructors.filter((i) => i.role === 'Teacher').sort(sortBySortOrder);
  const tas = instructors.filter((i) => i.role === 'TA').sort(sortBySortOrder);
  const officers = instructors.filter((i) => i.officer).sort(sortBySortOrder);

  return { teachers, tas, officers };
};
