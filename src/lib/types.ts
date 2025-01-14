
export type InstructorData = {
    name: string;
    role: string;
    imagePath: string;
    bio: string;
    school: string;
    additionalRole?: string;
}

export type TestimonialData = {
    name: string;
    quote: string;
    role: string;
    imagePath: string;
}

export type CourseData = {
    title: string,
    season: string, 
    subject: string,
    description: string,
    syllabus: string,
    registrationForm: string,
    studentDescription: string,
    status: string,
    tuition: number,
    content: string,
    poster?: string,
    dates: string,
}


export interface EventData {
    eventID: string;
    name: string;
    date: string;
    time: string;
    location: string;
    description: string;
    rules: string;
    prizes: {
        first: string;
        second: string;
        third: string;
    };

    registrationFee: number;
    teamSize: string;
    registration: {
        opens: string;
        closes: string;
        link: string;
        alternativeLink: string;
    };

    results: {
        winners: {
            first: string;
            second: string;
            third: string;
        };

        description: string;
        eliminationBracket: string;
    };

}
