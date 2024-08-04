<script lang="ts">
    import type { CourseData } from "$lib/types";

    export let courseData: CourseData;
</script>

<div class="card">
    <h1>{courseData.title}</h1>
    <div class="status">
        <div id="indicator" style="background-color: {courseData.status == 'closed' ? 'red' : 'green'};"></div>
        <p>Registration {courseData.status}</p>
    </div>

    <p>{courseData.description}</p>
</div>

<style lang="scss">
    .status {
        background-color: white;
        border-radius: 8px;
        padding: 4px 12px;
        display: inline-block;

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
        }
    }

    .card {
        height: 100%;
        background-color: $background-color;
        border-radius: 10px;
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
        padding: 24px;

        h1 {
            margin-bottom: 0.6em;
        }
    }
</style>
