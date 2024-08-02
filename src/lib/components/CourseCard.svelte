<script lang="ts">
    import type { CourseData } from "$lib/types";

    export let courseData: CourseData;
</script>

<div class="card"></div>

<style lang="scss">
    #card {
        width: 100%;
        height: 100%;
        background-color: $background-color;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
</style>
