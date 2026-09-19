import { ensureCourses } from "$lib/stores/stores";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    const courses = await ensureCourses();

    return {
        courses,
        openCourses: courses.filter((course) => course.registrationOpen),
        closedCourses: courses.filter((course) => !course.registrationOpen),
    };
};
