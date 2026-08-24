import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Division, EventData, Place } from '$lib/types';
import { client } from './sanityClient';

interface SanityPrize {
    place?: number;
    amount?: string;
}

interface SanityWinner {
    place?: number;
    team?: string;
}

interface SanityDivision {
    name?: string;
    prizes?: SanityPrize[];
    winners?: SanityWinner[];
}

type SanityEvent = Omit<EventData, 'eventID' | 'results'> & {
    eventID: string | number;
    divisions?: SanityDivision[];
    results?: Omit<NonNullable<EventData['results']>, 'divisions'> & {
        divisions?: SanityDivision[];
    };
};

function adaptDivision(division: SanityDivision): Division {
    const prizes = new Map(
        (division.prizes ?? [])
            .filter((prize): prize is Required<Pick<SanityPrize, 'place'>> & SanityPrize =>
                Number.isFinite(prize.place)
            )
            .map((prize) => [prize.place, prize.amount])
    );

    const places: Place[] = (division.winners ?? [])
        .filter(
            (winner): winner is SanityWinner & { place: number; team: string } =>
                Number.isFinite(winner.place) && Boolean(winner.team?.trim())
        )
        .map((winner) => ({
            rank: winner.place,
            team: winner.team.trim(),
            ...(prizes.get(winner.place)?.trim()
                ? { award: prizes.get(winner.place)!.trim() }
                : {})
        }))
        .sort((a, b) => a.rank - b.rank);

    return {
        name: division.name?.trim() || 'Division',
        places
    };
}

function adaptEvent(event: SanityEvent): EventData {
    const { divisions: nestedDivisions, ...results } = event.results ?? {};
    const rawDivisions = nestedDivisions ?? event.divisions;
    const divisions = rawDivisions?.map(adaptDivision).filter((division) => division.places.length);

    return {
        ...event,
        eventID: String(event.eventID),
        results:
            event.results || divisions?.length
                ? {
                      ...results,
                      ...(divisions?.length ? { divisions } : {})
                  }
                : undefined
    };
}

export const events = writable<EventData[]>([]);
export const currentEvent = writable<EventData>();

async function getEvents() {
    const query = `*[_type == "event"] | order(date desc)`;
    const data = (await client.fetch<SanityEvent[]>(query)).map(adaptEvent);
    events.set(data);

    const activeEvent = data.find((event) => event.active);
    if (activeEvent) {
        currentEvent.set(activeEvent);
    } else if (data.length > 0) {
        currentEvent.set(data[0]);
    }
}

let eventsInitialized = false;
if (!eventsInitialized) {
    getEvents();
    eventsInitialized = true;
}

export interface FAQData {
    question: string;
    answer: string;
}

export const faqs = writable<FAQData[]>([]);

export async function getFAQs() {
    const query = `*[_type == "faq"] | order(_createdAt asc)`;
    const data: FAQData[] = await client.fetch(query);
    faqs.set(data);
}

let faqsInitialized = false;
if (!faqsInitialized) {
    getFAQs();
    faqsInitialized = true;
}
