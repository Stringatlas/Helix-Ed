<script lang="ts">
    import InstructorCard from "$lib/components/InstructorCard.svelte";
    import instructors from "$lib/instructorData.json";
</script>

<body>
    {#each Object.entries(instructors) as [subject, subjectInstructors]}
        <h1>{subject}</h1>
        <div>
            {#each subjectInstructors as instructor}
                <InstructorCard instructorData={instructor} {subject} />
            {/each}
        </div>
    {/each}
</body>

<style lang="scss">
    h1 {
        margin-top: 50px;
    }

    body {
        padding: 8px;
    }

    div {
        display: flex;
        flex-direction: row;
        gap: 16px;
        flex-wrap: wrap;
        align-items: flex-start;
    }
</style>
