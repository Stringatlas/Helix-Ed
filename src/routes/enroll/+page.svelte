<script lang="ts">
    import courseData from "$lib/courseData.json";
    import type { CourseData } from "$lib/types";
    import CourseCard from "$lib/components/CourseCard.svelte";

    let openClasses: CourseData[] = [];
    let closedClasses: CourseData[] = [];

    $: {
        Object.entries(courseData).forEach(([subject, courses]) => {
            openClasses = openClasses.concat(courses.filter((course) => course.status == "open"));
            closedClasses = closedClasses.concat(courses.filter((course) => course.status == "closed"));
        });

        console.log(openClasses);
        console.log(closedClasses);

        // for (const subject in courseData) {
        //     //@ts-ignore
        //     for (const course of courseData[subject]) {
        //         console.log(course);
        //         if (course.status == "open") {
        //             openClasses.push(course);
        //         } else {
        //             closedClasses.push(course);
        //         }
        //     }
        // }

        // console.log(openClasses);
        // console.log(closedClasses);
    }
</script>

<main>
    <section id="header">
        <h1>Our courses</h1>
    </section>

    <div>
        {#each openClasses as course}
            <CourseCard courseData={course} />
        {/each}
        {#each closedClasses as course}
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
