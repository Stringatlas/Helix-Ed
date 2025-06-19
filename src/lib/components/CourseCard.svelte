<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Course } from "$lib/types";

    export let courseData: Course;
</script>

<div class="card">
    <h1>{courseData.season + " " + courseData.title}</h1>
    <h2>{courseData.dates}</h2>
    <div class="status">
        <div id="indicator" style="background-color: {courseData.registrationOpen ? 'green' : 'red'};"></div>
        <p>Registration {courseData.registrationOpen ? 'Open' : 'Closed'}</p>
    </div>

    <p>{courseData.content}</p>

    {#if courseData.registrationOpen}
        <button on:click={() => goto("/classes/" + courseData.slug)}>Go to class page</button>
    {/if}
</div>

<style lang="scss">
    button {
        @include button-primary;
        margin-top: 32px;
    }

    .status {
        background-color: white;
        border-radius: 8px;
        padding: 4px 12px;
        display: inline-flex;
        align-items: center;
        position: absolute;
        right: 24px;
        top: 24px;

        #indicator {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: $primary;
            display: inline-block;
            margin-right: 8px;
        }

        p {
            display: inline-block;
            height: 100%;
        }
    }

    .card {
        height: 100%;
        position: relative;
        background-color: $background-color;
        border-radius: 10px;
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
        padding: 24px;
        background: radial-gradient(circle at top left, darken($background-color, 2.5%) 0%, lighten($background-color, 0%) 80%);

        h1 {
            margin-bottom: 0px;
        }

        h2 {
            margin-bottom: 12px;
        }

        .status {
            margin-bottom: 16px;
        }
    }
</style>
