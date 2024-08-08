
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

export type EventData = {
    eventID: number,
    name: string,
    date: string,
    time: string,
    location: string,
    description: string,
    rules: string,
    prizes: string,
    registration: string,
    results: string,
    contact: string
}