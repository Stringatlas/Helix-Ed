<script lang="ts">
    import { goto } from "$app/navigation";
    import { client } from "$lib/stores/sanityClient";
    import { onMount } from "svelte";

    let subject: string;
    let notFound = false;

    $: subject = typeof window !== "undefined" ? window.location.pathname.split("/")[2] : "";

    onMount(async () => {
        if (!subject) return;
        // GROQ: find a featured course for this subject
        const query = `*[_type == 'course' && featured == true && subject == "${subject}"][0]{ slug }`;
        const course = await client.fetch(query);
        if (course && course.slug && course.slug.current) {
            goto(`/classes/${course.slug.current}`);
        } else {
            notFound = true;
        }
    });
</script>

{#if notFound}
    <main>
        <h2>We currently do not offer classes for {subject}</h2>
        <slot />
    </main>
{/if}