<script lang="ts">
//   import { page } from "$app/stores";
  import { page } from "$app/stores";
  import { capitalizeFirstLetter } from "$lib/util";
  import { instructors, teachers, tas, officers, courses } from "$lib/stores/stores";
  import type { Instructor, Course } from "$lib/types";
  import InstructorCard from "$lib/components/InstructorCard.svelte";

  let slug: string;
  let subjectTeachers: Instructor[] = [];
  let subjectTAs: Instructor[] = [];
  let course: Course | undefined;

  $: slug = $page.params.slug;
  $: course = $courses.find((c) => c.slug.current == slug);
  
  $: {
    let subject = course?.subject ?? "";
    subjectTeachers = $teachers.filter(
      (instructor) =>
        instructor.subjects &&
        instructor.subjects.some((s) => s.toLowerCase() === subject.toLowerCase()) &&
        course?.instructors?.includes(instructor.name)
    );
    subjectTAs = $tas.filter(
      (instructor) =>
        instructor.subjects &&
        instructor.subjects.some((s) => s.toLowerCase() === subject.toLowerCase()) &&
        course?.instructors?.includes(instructor.name)
    );
  }
</script>

<main>
  {#if course}
    <section id="top">
      <div id="title"><h1>{course.title}</h1></div>
    </section>
    <div id="body-content">
      <section id="text-content">
        <h1>About this course</h1>
        <p>{course.description}</p>
        <h1>Who should take this course?</h1>
        <p>{course.studentDescription}</p>
        <h1>Course content</h1>
        <p>{course.content}</p>
        <h1>Class Dates</h1>
        <p>{course.dates}</p>
        <h1>Refund Policy</h1>
        <p>Full refund for two classes, no refund for further classes</p>
        <h1>Class format</h1>
        <p>Small sized zoom classes with recordings available for two months</p>
        <div id="actions">
          {#if course.registrationOpen}
            <button class="button primary" on:click={() => (window.location.href = course?.registrationForm ?? "#")}>Register</button>
          {:else}
            <button class="button" disabled>Registration closed</button>
          {/if}
          <button class="button secondary" on:click={() => (window.location.href = course?.syllabus ?? "#")}>View Syllabus</button>
        </div>
      </section>
      <section id="poster-section">
        {#if course.posterUrl}
          <img id="poster" src={course.posterUrl} alt="class poster" />
        {/if}
      </section>
    </div>
    <section id="instructors">
      <h1 id="instructors-label">Meet the instructors</h1>
      <div class="flex-div">
        {#each subjectTeachers as instructor}
          <div><InstructorCard instructorData={instructor} /></div>
        {/each}
        {#each subjectTAs as ta}
          <div><InstructorCard instructorData={ta} /></div>
        {/each}
      </div>
    </section>
  {:else}
    <h2>Course not found for: {slug}</h2>
  {/if}
</main>

<style lang="scss">
    // a {
    //     text-decoration: none;
    // }

    #poster-section {
        // padding: 10%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }

    #poster {
        width: 70%;
    }

    #actions {
        margin-top: 24px;
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
        margin-top: 24px;

        .flex-div {
            overflow-x: scroll;
            display: flex;
            flex-direction: row;

            gap: 52px;
            padding: 16px;

            > div {
                flex: 0 0 auto;
                width: 400px;
                box-sizing: content-box;
            }
        }
    }
    main {
        padding: 20px 40px;
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

    @media (max-width: $mobile-width) {
        #body-content {
            display: flex;
            flex-direction: column-reverse;
            margin-bottom: 24px;
        }

        main {
            padding: 20px 8px;
        }

        #title {
            h1 {
                font-size: 52px;
                text-align: center;
            }
        }

        #body-content {
            padding: 0 8px;
        }

        #poster-section {
            #poster {
                width: 60%;
            }
        }

        #text-content {
            width: 100%;
        }

        #instructors {
            margin-top: 48px;

            h1 {
                text-align: center;
                margin-bottom: 8px;
            }

            .flex-div {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                overflow-x: hidden;

                padding: 16px;
                gap: 16px;
                align-items: center;
                justify-content: center;

                > div {
                    display: contents;
                }
            }
        }
    }
</style>
