<script lang="ts">
    import { page } from "$app/stores";
    import { capitalizeFirstLetter } from "$lib/util";
    import instructorData from "$lib/instructorData.json";
    import courseData from "$lib/courseData.json";
    import type { InstructorData, CourseData } from "$lib/types";
    import { onMount } from "svelte";

    import InstructorCard from "$lib/components/InstructorCard.svelte";

    let subject: string;
    let instructors: InstructorData[] = [];
    let tas: InstructorData[] = [];

    let courses: CourseData[];
    let currentCourse: CourseData;
    type Subjects = keyof typeof instructorData & keyof typeof courseData;

    function isValidSubject(subject: string): subject is Subjects {
        return subject in instructorData && subject in courseData;
    }

    $: {
        subject = $page.url.pathname.split("/")[2];

        if (isValidSubject(subject)) {
            instructors = instructorData[subject].filter((instructorDatum: InstructorData) => instructorDatum.role === "Instructor");
            tas = instructorData[subject].filter((instructorDatum: InstructorData) => instructorDatum.role === "TA");

            courses = courseData[subject];
            currentCourse = courses[courses.length - 1];
        }

        console.log(tas);
        console.log(instructors);
        console.log(currentCourse);
    }
</script>

<main>
    <!-- {#if instructors.length}
        <h2>Taught by instructor{instructors.length > 1 ? "s" : ""}: {instructors.map((instructor) => instructor.name).join(", ")}</h2>
    {/if}
    {#if tas.length}
        <h2>With TA{instructors.length > 1 ? "s" : ""}: {tas.map((instructor) => instructor.name).join(", ")}</h2>
    {/if} -->

    <section id="top">
        <div id="title"><h1>{currentCourse.title}</h1></div>
        <!-- <div id="contents">
            <a href="#instructors">Instructors</a>
        </div> -->
    </section>

    <div id="body-content">
        <section id="text-content">
            <div>
                <h1>About this course</h1>
                <p>{currentCourse.description}</p>
                <h1>Who should take this course?</h1>
                <p>{currentCourse.studentDescription}</p>
                <h1>Course content</h1>
                <p>{currentCourse.content}</p>
                <h1>Refund Policy</h1>
                <p>Full refund for two classes, no refund for further classes</p>
                <h1>Class format</h1>
                <p>Small sized zoom classes with recordings available for two months</p>
            </div>

            <div id="actions">
                {#if currentCourse.status == "open"}
                    <button class="button primary" on:click={() => (window.location.href = currentCourse.registrationForm)}>Register</button>
                {:else}
                    <button class="button" disabled>Registration closed</button>
                {/if}

                <button class="button secondary" on:click={() => (window.location.href = currentCourse.syllabus)}>View Syllabus</button>
            </div>
        </section>

        <section id="poster-section">
            <div>
                {#if currentCourse.poster}
                    <img id="poster" src={"/" + currentCourse.poster} alt="" />
                {/if}
            </div>
        </section>
    </div>

    <section id="instructors">
        <h1 id="instructors">Meet the instructors</h1>
        <div>
            {#each instructors as instructor}
                <div>
                    <InstructorCard instructorData={instructor} {subject} />
                </div>
            {/each}
            {#each tas as ta}
                <div>
                    <InstructorCard instructorData={ta} {subject} />
                </div>
            {/each}
        </div>
    </section>

    <slot />
</main>

<style lang="scss">
    // a {
    //     text-decoration: none;
    // }

    #poster-section {
        padding: 72px;
    }

    #poster {
        width: 100%;
    }

    #actions {
        display: flex;
        flex-grow: 1;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }

    #body-content {
        display: flex;
        flex-direction: row;
    }

    p {
        line-height: 1.5;
        letter-spacing: 1.5;
    }
    #text-content {
        display: flex;
        flex-direction: column;
        width: 50%;
        h1 {
            margin-bottom: 0.25em;
            margin-top: 1.5em;
        }
    }
    #title {
        margin: 32px 32px;
        h1 {
            font-size: 52px;
            text-align: center;
        }
    }
    #instructors {
        > div {
            overflow-x: auto;
            scrollbar-color: rgb(122, 125, 136) lighten($background-color, 5%);
            scrollbar-width: thin;
            display: flex;
            flex-direction: row;
            gap: 16px;
            padding: 16px;
        }
    }
    main {
        padding: 20px 16px;
    }

    .primary {
        @include button-primary;
        &:hover {
            background-color: darken($primary, 5%);
        }
    }

    .secondary {
        @include button-secondary;

        &:hover {
            background-color: darken($secondary, 5%);
        }
    }

    .button {
        @include button;
        font-size: large;
        padding: 1em 1.5em;
    }
</style>
