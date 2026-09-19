<script lang="ts">
    import { onMount } from "svelte";
    import { seedInstructors } from "$lib/stores/stores";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    onMount(() => seedInstructors(data.instructors));
</script>

<slot></slot>
