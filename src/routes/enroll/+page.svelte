<script lang="ts">
    import { onMount } from "svelte";
    import { CheckCircle, LockKey, Sparkle } from "phosphor-svelte";
    import CourseCard from "$lib/components/CourseCard.svelte";
    import Seo from "$lib/components/Seo.svelte";
    import JsonLd from "$lib/components/JsonLd.svelte";
    import { seedCourses } from "$lib/stores/stores";
    import type { PageData } from "./$types";

    export let data: PageData;

    onMount(() => seedCourses(data.courses));
</script>

<Seo title="Our Courses | Helix-Ed" description="Explore Helix-Ed's expertly crafted curriculum — interactive courses taught by instructors from top universities." />
<JsonLd data={{
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [...data.openCourses, ...data.closedCourses].map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://helix-ed.org/classes/${encodeURIComponent(course.slug.current)}`,
        item: {
            "@type": "Course",
            name: course.title,
            description: course.description,
            provider: { "@type": "Organization", name: "Helix-Ed", url: "https://helix-ed.org/" },
        },
    })),
}} />

<main>
    <section class="hero" aria-labelledby="page-title">
        <div class="hero-content">
            <div class="eyebrow">
                <Sparkle size={18} weight="fill" aria-hidden="true" />
                <span>Learn with Helix-Ed</span>
            </div>
            <h1 id="page-title">Find your next course</h1>
            <p>Explore interactive courses designed by instructors from top universities and learn alongside students from around the world.</p>
        </div>
    </section>

    <section class="courses-section" aria-label="Course catalog">
        <div class="courses-container">
            {#if data.openCourses.length > 0}
                <section class="courses-group" aria-labelledby="open-courses-title">
                    <header class="group-header">
                        <div class="group-icon open"><CheckCircle size={24} weight="bold" aria-hidden="true" /></div>
                        <div>
                            <div class="title-row">
                                <h2 id="open-courses-title">Open for registration</h2>
                                <span class="count">{data.openCourses.length} {data.openCourses.length === 1 ? 'course' : 'courses'}</span>
                            </div>
                            <p>Choose a course and view its full schedule, syllabus, and enrollment details.</p>
                        </div>
                    </header>
                    <div class="courses-list">
                        {#each data.openCourses as course}
                            <CourseCard courseData={course} />
                        {/each}
                    </div>
                </section>
            {/if}

            {#if data.closedCourses.length > 0}
                <section class="courses-group closed-group" aria-labelledby="closed-courses-title">
                    <header class="group-header">
                        <div class="group-icon closed"><LockKey size={23} weight="bold" aria-hidden="true" /></div>
                        <div>
                            <div class="title-row">
                                <h2 id="closed-courses-title">Past courses</h2>
                                <span class="count">{data.closedCourses.length} {data.closedCourses.length === 1 ? 'course' : 'courses'}</span>
                            </div>
                            <p>Registration has ended for these courses. Check back for future offerings.</p>
                        </div>
                    </header>
                    <div class="courses-list">
                        {#each data.closedCourses as course}
                            <CourseCard courseData={course} />
                        {/each}
                    </div>
                </section>
            {/if}
        </div>
    </section>
</main>

<style lang="scss">
    main {
        min-height: calc(100vh - $nav-height);
        background: $background-color;
    }

    .hero {
        padding: 5rem 2rem 4.5rem;
        background: #fff;
        border-bottom: 1px solid #e2e8f0;
    }

    .hero-content {
        max-width: 920px;
        margin: 0 auto;
    }

    .eyebrow {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        margin-bottom: 1.1rem;
        color: #087c16;
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.09em;
        text-transform: uppercase;
    }

    h1 {
        max-width: 760px;
        margin: 0 0 1.2rem;
        color: $accent;
        font-size: clamp(2.6rem, 6vw, 4.5rem);
        font-weight: 750;
        letter-spacing: -0.045em;
        line-height: 1.02;
    }

    .hero-content > p {
        max-width: 720px;
        margin: 0;
        color: #526174;
        font-size: clamp(1rem, 2vw, 1.18rem);
        line-height: 1.7;
    }

    .courses-section {
        padding: 4rem 2rem 5rem;
    }

    .courses-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .courses-group + .courses-group {
        margin-top: 5rem;
        padding-top: 4rem;
        border-top: 1px solid #dbe3ec;
    }

    .group-header {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr);
        gap: 1rem;
        align-items: start;
        margin-bottom: 1.75rem;
    }

    .group-icon {
        display: grid;
        width: 46px;
        height: 46px;
        place-items: center;
        border: 1px solid;
        border-radius: 12px;

        &.open {
            color: #087c16;
            background: #edfaef;
            border-color: #bee7c3;
        }

        &.closed {
            color: #64748b;
            background: #f1f5f9;
            border-color: #dbe3ec;
        }
    }

    .title-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin: 0.05rem 0 0.4rem;

        h2 {
            margin: 0;
            color: $accent;
            font-size: clamp(1.45rem, 3vw, 1.85rem);
            line-height: 1.2;
        }
    }

    .count {
        padding: 0.28rem 0.6rem;
        color: #526174;
        background: #e9eef4;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 700;
    }

    .group-header p {
        margin: 0;
        color: #64748b;
        font-size: 0.94rem;
        line-height: 1.55;
    }

    .courses-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    @media (max-width: $mobile-width) {
        .hero {
            padding: 3.5rem 1.25rem 3rem;
        }

        .courses-section {
            padding: 2.75rem 1rem 4rem;
        }

        .courses-group + .courses-group {
            margin-top: 3.5rem;
            padding-top: 3rem;
        }

        .group-header {
            grid-template-columns: 40px minmax(0, 1fr);
            gap: 0.75rem;
        }

        .group-icon {
            width: 38px;
            height: 38px;
            border-radius: 10px;
        }
    }
</style>
