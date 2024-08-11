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

<body>
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
            <h1>Congratulations to our winners</h1>
            <Podium first={eventData.winners.first} second={eventData.winners.second} third={eventData.winners.third} />

            <h1 style="margin-top: 2em">Thank you to everyone for participating</h1>
        </div>

        <div id="bracket">
            <h1>Elimation Bracket</h1>
            <iframe title="elimation bracket sheet" src={eventData.eliminationBracket} frameborder="0" class="sheet"></iframe>
        </div>
    </div>
</body>

<style lang="scss">
    #bracket {
        margin-top: 200px;
        h1 {
            text-align: center;
        }
    }

    .sheet {
        width: calc(100% - 400px);
        height: 600px;
        margin: 24px 200px;
    }

    #winners {
        margin-top: 100px;
        h1 {
            text-align: center;
            margin-bottom: 48px;
        }
    }

    .title {
        padding-top: 24px;

        h1,
        h2 {
            text-align: center;
        }
    }
</style>
