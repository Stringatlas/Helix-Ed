<script lang="ts">
    import type { EventData } from "$lib/types";
    import { events } from "$lib/stores/stores";
    import Podium from "$lib/components/Podium.svelte";

    import { onMount } from "svelte";

    export let data: { eventID: string };
    let eventData: EventData | undefined;
    onMount(() => {
        eventData = $events.find(event => event.eventID == data.eventID);
    })

</script>

<body>
    {#if eventData && !eventData.active}
        <div class="title">
            <h1>{eventData.name}</h1>
            <h2>{eventData.date}</h2>
        </div>

        <div class="body">
            <div id="winners">
                <h1>Congratulations to our winners</h1>
                <Podium first={eventData.results?.winners?.first} second={eventData.results?.winners?.second} third={eventData.results?.winners?.third} />

                <h1 style="margin-top: 2em">Thank you to everyone for participating</h1>

                <p>{eventData.results?.description}</p>
            </div>

            <div id="bracket">
                <h1>Elimation Bracket</h1>
                <a href={eventData.results?.eliminationBracket}>Elimination bracket link</a>
                <iframe title="elimation bracket sheet" src={eventData.results?.eliminationBracket} frameborder="0" class="sheet"></iframe>
            </div>
        </div>
    {:else}
        <p>Event not found.</p>
    {/if}
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

            & {
                margin-bottom: 2rem;
            }
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
