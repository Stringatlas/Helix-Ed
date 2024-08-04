<script lang="ts">
    import courseData from "$lib/courseData.json";
    import type { CourseData } from "$lib/types";
    import CourseCard from "$lib/components/CourseCard.svelte";

    let openClasses: CourseData[] = [];
    let closedClasses: CourseData[] = [];

    $: {
        Object.entries(courseData).forEach(([subject, courses]) => {
            console.log(subject);
            console.log(courses);
            openClasses = openClasses.concat(courses.filter((course) => course.status === "Open"));
            closedClasses = closedClasses.concat(courses.filter((course) => course.status === "Closed"));
        });

        console.log(openClasses);
        console.log(closedClasses);
    }
</script>

<main>
    <section id="header">
        <h1>Our courses</h1>
    </section>

    <main>
        {#each openClasses as course}
            <CourseCard courseData={course} />
        {/each}
        {#each closedClasses as course}
            <CourseCard courseData={course} />
        {/each}
    </main>
</main>

<style lang="scss">
    #header {
        padding: 52px 32px;

        h1 {
            text-align: center;
            font-size: 52px;
        }
    }
</style>
