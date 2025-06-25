<script lang="ts">
    import { goto } from "$app/navigation";
    import { client } from "$lib/stores/sanityClient";
    import { page } from "$app/state";

    let subject: string;
    let notFound = false;

    $: subject = page.params.slug;

    $: (async () => {
        if (!subject) return;
        // GROQ: find a featured course for this subject
        const query = `*[_type == 'course' && featured == true && subject == $subject][0]{ slug }`;
        const course = await client.fetch(query, { subject });
        
        console.log("slug", subject);
        console.log("Course found:", course);
        
        if (course && course.slug && course.slug.current) {
            goto(`/classes/${course.slug.current}`);
        } else {
            notFound = true;
        }
    })();
</script>

{#if notFound}
    <main>
        <h2>We currently do not offer classes for {subject}</h2>
        <slot />
    </main>
{/if}