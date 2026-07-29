import { client } from '$lib/stores/sanityClient';
import type { Course } from '$lib/types';
import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async () => {
  const query = `*[_type == "course"]{..., "posterUrl": poster.asset->url}`;
  const courses: Course[] = await client.fetch(query);

  const openCourses = courses.filter((c) => c.registrationOpen);
  const closedCourses = courses.filter((c) => !c.registrationOpen);

  return { openCourses, closedCourses };
};
