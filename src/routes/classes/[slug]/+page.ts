import { error } from "@sveltejs/kit";
import { ensureCourse } from "$lib/stores/stores";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
    const course = await ensureCourse(params.slug);

    if (!course) throw error(404, "Course not found");
    return { course };
};
