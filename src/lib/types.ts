
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
    description: string,
    syllabus: string,
    registrationForm: string,
    studentDescription: string,
    status: string,
    tuition: number,
    content: string,
    poster?: string,
}