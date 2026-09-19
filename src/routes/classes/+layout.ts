import { ensureInstructors } from "$lib/stores/stores";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => ({
    instructors: await ensureInstructors(),
});
