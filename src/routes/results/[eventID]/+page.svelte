<script lang="ts">
    import type { EventData } from "$lib/types";
    import bioBrawlData from "$lib/bioBrawlData.json";

    export let data: { eventID: string };

    let eventData: EventData;

    function isValidEventID(eventID: string): eventID is keyof typeof bioBrawlData {
        return eventID in bioBrawlData;
    }

    $: {
        if (isValidEventID(data.eventID)) {
            eventData = bioBrawlData[data.eventID];
        }
    }
</script>

<main>
    {#if !isValidEventID(data.eventID)}
        <h1>Event not found</h1>
    {:else}
        <h1>{eventData.name}</h1>
    {/if}
</main>

<style lang="scss">
    main {
        padding: 24px;
    }
</style>
