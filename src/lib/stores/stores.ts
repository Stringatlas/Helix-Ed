import { writable } from 'svelte/store';
import type { EventData } from "$lib/types";
import type { Writable } from "svelte/store";
import { client } from "./sanityClient";

export let events = writable<EventData[]>([]);
export let currentEvent = writable<EventData>();

async function getEvents() {
    try {
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
    } catch (error) {
        console.warn('Failed to fetch events from Sanity:', error);
        // Set empty data as fallback
        events.set([]);
    }
}

events.subscribe((value) => {
    console.log('Updated events:', value);
});

currentEvent.subscribe((value) => {
    console.log('Updated current event:', value);
});

getEvents()

export interface FAQData {
    question: string;
    answer: string;
}

export let faqs = writable<FAQData[]>([]);

export async function getFAQs() {
    try {
        const query = `*[_type == "faq"] | order(_createdAt asc)`;
        const data: FAQData[] = await client.fetch(query);
        faqs.set(data);
    } catch (error) {
        console.warn('Failed to fetch FAQs from Sanity:', error);
        // Set empty data as fallback
        faqs.set([]);
    }
}

getFAQs();