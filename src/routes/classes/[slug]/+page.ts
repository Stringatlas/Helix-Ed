import { error } from '@sveltejs/kit';
import { client } from '$lib/stores/sanityClient';
import type { Course, Instructor } from '$lib/types';
import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ params }) => {
  const courseQuery = `*[_type == "course" && slug.current == $slug][0]{..., "posterUrl": poster.asset->url}`;
  const instructorsQuery = `*[_type == "instructor"]{..., "imageUrl": image.asset->url}`;

  const [course, instructors]: [Course | null, Instructor[]] = await Promise.all([
    client.fetch(courseQuery, { slug: params.slug }),
    client.fetch(instructorsQuery)
  ]);

  if (!course) {
    throw error(404, `Sorry, we couldn't find a course with the identifier: ${params.slug}`);
  }

  const teachers = instructors
    .filter((i) => i.role === 'Teacher')
    .sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
  const tas = instructors
    .filter((i) => i.role === 'TA')
    .sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));

  const subject = course.subject ?? '';
  const subjectTeachers: Instructor[] = [];
  const subjectTAs: Instructor[] = [];

  if (course.instructors) {
    course.instructors.forEach((name) => {
      const teacher = teachers.find(
        (instructor) =>
          instructor.name === name &&
          instructor.subjects &&
          instructor.subjects.some((s) => s.toLowerCase() === subject.toLowerCase())
      );
      if (teacher) subjectTeachers.push(teacher);

      const ta = tas.find(
        (instructor) =>
          instructor.name === name &&
          instructor.subjects &&
          instructor.subjects.some((s) => s.toLowerCase() === subject.toLowerCase())
      );
      if (ta) subjectTAs.push(ta);
    });
  }

  return { course, subjectTeachers, subjectTAs };
};
