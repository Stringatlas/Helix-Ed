export interface EventData {
    eventID: string;
    active?: boolean;
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
    contact?: string;
    results?: {
        eliminationBracket?: string;
        winners?: {
            first?: string;
            second?: string;
            third?: string;
        };
        description?: string;
    };
}