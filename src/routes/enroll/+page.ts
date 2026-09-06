import { client } from "$lib/stores/sanityClient";
import type { Course } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    const courses = await client.fetch<Course[]>(
        `*[_type == "course"]{..., "posterUrl": poster.asset->url}`,
    );

    return {
        openCourses: courses.filter((course) => course.registrationOpen),
        closedCourses: courses.filter((course) => !course.registrationOpen),
    };
};
