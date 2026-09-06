import { error } from "@sveltejs/kit";
import { client } from "$lib/stores/sanityClient";
import type { Course, Instructor } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
    const result = await client.fetch<{
        course: Course | null;
        instructors: Instructor[];
    }>(
        `{
            "course": *[_type == "course" && slug.current == $slug][0]{..., "posterUrl": poster.asset->url},
            "instructors": *[_type == "instructor"]{..., "imageUrl": image.asset->url}
        }`,
        { slug: params.slug },
    );

    if (!result.course) throw error(404, "Course not found");
    const names = new Set(result.course.instructors ?? []);

    return {
        course: result.course,
        instructors: result.instructors.filter((instructor) => names.has(instructor.name)),
    };
};
