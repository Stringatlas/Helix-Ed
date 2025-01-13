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
            eventData = { ...bioBrawlData[data.eventID], eventID: data.eventID };
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
            <Podium first={eventData.results.winners.first} second={eventData.results.winners.second} third={eventData.results.winners.third} />

            <h1 style="margin-top: 2em">Thank you to everyone for participating</h1>

            <p>{eventData.results.description}</p>
        </div>

        <div id="bracket">
            <h1>Elimation Bracket</h1>
            <a href={eventData.results.eliminationBracket}>Elimination bracket link</a>
            <iframe title="elimation bracket sheet" src={eventData.results.eliminationBracket} frameborder="0" class="sheet"></iframe>
        </div>
    </div>
</body>

<style lang="scss">
    p {
        line-height: 1.5;
        letter-spacing: 1.5;
        padding: 0 25vw;
    }
    @media (max-width: $mobile-width) {
        #bracket {
            iframe {
                display: none;
            }

            margin-bottom: 2rem;
        }
    }
    #bracket {
        margin-top: 200px;
        h1 {
            text-align: center;
        }
        a {
            margin-top: 1.5rem;
            font-size: large;
            text-align: center;
            display: block;
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
