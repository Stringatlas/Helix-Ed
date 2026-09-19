import { ensureUICopy } from "$lib/stores/stores";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => ({
    uiCopy: await ensureUICopy(),
});
