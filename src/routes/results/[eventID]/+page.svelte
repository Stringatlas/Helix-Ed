<script lang="ts">
    import type { EventData } from "$lib/types";
    import bioBrawlData from "$lib/bioBrawlData.json";
    import Podium from "$lib/components/Podium.svelte";

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
    <div id="winners">
        <h1>Winners</h1>
        <Podium first={eventData.winners.first} second={eventData.winners.second} third={eventData.winners.third} />
    </div>

    <div id="bracket">
        <h1>Elimation Bracket</h1>
        <iframe src={eventData.eliminationBracket} frameborder="0" class="sheet"></iframe>
    </div>
</div>

<style lang="scss">
    #bracket {
        h1 {
            text-align: center;
        }
    }

    .sheet {
        width: 100%;
        height: 500px;
    }
    #winners {
        margin-top: 100px;
        h1 {
            text-align: center;
            margin-bottom: 48px;
        }
    }

    .title {
        h1,
        h2 {
            text-align: center;
        }
    }
</style>
