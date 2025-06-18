<script lang="ts">
    import CourseCard from "$lib/components/CourseCard.svelte";
    import { openCourses, closedCourses } from "$lib/stores/stores";

</script>

<main>
    <section id="header">
        <h1>Our courses</h1>
    </section>

    <div>
        {#each $openCourses as course}
            <CourseCard courseData={course} />
        {/each}
        {#each $closedCourses as course}
            <CourseCard courseData={course} />
        {/each}
    </div>
</main>

<style lang="scss">
    main {
        padding: 28px;

        div {
            display: flex;
            flex-direction: column;
            gap: 16px;
            flex-wrap: nowrap;
        }
    }

    #header {
        padding: 52px 32px;

        h1 {
            text-align: center;
            font-size: 52px;
        }
    }
</style>
