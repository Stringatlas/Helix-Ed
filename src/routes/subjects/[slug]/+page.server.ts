import { redirect, error } from '@sveltejs/kit';
import { client } from '$lib/stores/sanityClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const course = await client.fetch(
    `*[_type == "course" && featured == true && lower(subject) == lower($subject)][0]{ "slug": slug.current }`,
    { subject: params.slug }
  );
  if (!course?.slug) throw error(404, `We do not currently offer classes in ${params.slug}`);
  throw redirect(302, `/classes/${course.slug}`);
};
