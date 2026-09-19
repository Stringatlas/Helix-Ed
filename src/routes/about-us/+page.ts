import { ensureInstructors } from "$lib/stores/stores";
import type { Instructor } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    const instructors = await ensureInstructors();
    const bySortOrder = (a: Instructor, b: Instructor) =>
        (a.sortOrder ?? 999) - (b.sortOrder ?? 999);

    return {
        instructors,
        officers: instructors.filter((instructor) => instructor.officer).sort(bySortOrder),
        teachers: instructors.filter((instructor) => instructor.role === "Teacher").sort(bySortOrder),
        tas: instructors.filter((instructor) => instructor.role === "TA").sort(bySortOrder),
    };
};
