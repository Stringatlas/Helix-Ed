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
    refundPolicy: string;
    classFormat: string;
};

export type UICopy = {
    featuredSubjects: string[];
};
