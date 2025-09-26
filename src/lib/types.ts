import type { instructors } from "./stores/stores";

// types from sanityio schemas
export type Instructor = {
    name: string;
    school: string;
    subjects: Array<string>;
    role: string;
    officer?: string;
    additionalRole?: string;
    bio: string;
    imageUrl: string;
    image?: { alt: string };
    sortOrder?: number;
};

export type Course = {
    title: string;
    season: string;
    subject: string;
    slug: { current: string, _type: "slug" };
    description: string;
    registrationForm: string;
    syllabus: string;
    studentDescription: string;
    tuition: number;
    posterUrl: string;
    dates: string;
    content: string;
    registrationOpen: boolean;
    instructors: Array<String>;
};

// Deprecated types
/** @deprecated Use Instructor instead */
export type InstructorData = {
    name: string;
    role: string;
    imagePath: string;
    bio: string;
    school: string;
    additionalRole?: string;
    officer?: boolean;
    subject?: string;
}

/** @deprecated Use Testimonial instead */
export type TestimonialData = {
    name: string;
    quote: string;
    role: string;
    imagePath: string;
}

/** @deprecated Use Course instead */
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