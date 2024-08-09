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

<div class="title">
    {#if !isValidEventID(data.eventID)}
        <h1>Event not found</h1>
    {:else}
        <h1>{eventData.name}</h1>
        <h2>{eventData.date}</h2>
    {/if}
</div>
<div class="body">
    <h2>Winners</h2>
    <p>1st Place: {eventData.winners.first}</p>
    <p>2nd Place: {eventData.winners.second}</p>
    <p>3rd Place: {eventData.winners.third}</p>
</div>

<style lang="scss">
    .title {
        h1,
        h2 {
            text-align: center;
        }
    }
</style>
