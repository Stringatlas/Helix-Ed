export interface EventData {
    eventID: number;
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