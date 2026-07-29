export interface EventData {
    eventID: string;
    active?: boolean;
    live?: boolean;
    year: number;
    name: string;
    date: string;
    time?: string;
    location?: string;
    description?: string;
    rules?: string;
    prizes?: {
        first?: string;
        second?: string;
        third?: string;
        fourth?: string;
        fifth?: string;
    };
    registrationFee?: number;
    teamSize?: string;
    grades?: string;
    postEventData?: {
        participants?: number;
        teams?: number;
    };
    registration?: {
        opens?: string;
        closes?: string;
        link?: string;
        alternativeLink?: string;
        isOpen?: boolean;
    };
    mock?: {
        date?: string;
    };
    rulesWorkshop?: {
        date?: string;
    };
    contact?: string;
    results?: {
        eliminationBracket?: string;
        /**
         * Legacy single-ladder results, used by the 2024 and 2025 events.
         * Still rendered when `divisions` is absent.
         */
        winners?: {
            first?: string;
            second?: string;
            third?: string;
        };
        /**
         * Results split by bracket. From 2026 the competition runs separate
         * High School and Middle School divisions (plus a mock round), which
         * the three flat `winners` slots cannot represent.
         *
         * Takes precedence over `winners` when present.
         */
        divisions?: Division[];
        description?: string;
    };
}

export interface Place {
    /** 1 = first, 2 = second, and so on. */
    rank: number;
    team: string;
    /** Prize in whole US dollars. */
    award?: number;
}

export interface Division {
    /** e.g. "High School", "Middle School", "Mock Competition" */
    name: string;
    places: Place[];
}