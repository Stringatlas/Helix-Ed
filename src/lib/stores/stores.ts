
import { writable } from 'svelte/store';
import type { EventData } from "$lib/types";
import type { Writable } from "svelte/store";
import { client } from "./sanityClient";

export let events = writable<EventData[]>([]);
export let currentEvent = writable<EventData>();

async function getEvents() {
    // GROQ query to fetch all events
    const query = `*[_type == "event"] | order(date desc)`;
    const data: EventData[] = await client.fetch(query);
    events.set(data);

    const activeEvent = data.find(event => event.active);
    if (activeEvent) {
        currentEvent.set(activeEvent);
    } else if (data.length > 0) {
        currentEvent.set(data[0]);
    }
}

events.subscribe((value) => {
    console.log('Updated events:', value);
});

currentEvent.subscribe((value) => {
    console.log('Updated current event:', value);
});

getEvents()