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

// Only fetch events once on initialization
let eventsInitialized = false;
if (!eventsInitialized) {
    getEvents();
    eventsInitialized = true;
}

export interface FAQData {
    question: string;
    answer: string;
}

export let faqs = writable<FAQData[]>([]);

export async function getFAQs() {
    const query = `*[_type == "faq"] | order(_createdAt asc)`;
    const data: FAQData[] = await client.fetch(query);
    faqs.set(data);
}

// Only fetch FAQs once on initialization
let faqsInitialized = false;
if (!faqsInitialized) {
    getFAQs();
    faqsInitialized = true;
}