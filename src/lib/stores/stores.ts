import { browser } from "$app/environment";
import { derived, get, writable } from "svelte/store";
import { client } from "./sanityClient";
import type { Course, Instructor, UICopy } from "$lib/types";

const instructorQuery = `*[_type == "instructor"]{..., "imageUrl": image.asset->url}`;
const courseQuery = `*[_type == "course"]{..., "posterUrl": poster.asset->url}`;
const uiCopyQuery = `*[_type == "uiCopy"][0]{featuredSubjects}`;

export const instructors = writable<Instructor[]>([]);
export const courses = writable<Course[]>([]);
export const uiCopy = writable<UICopy>({ featuredSubjects: [] });

const bySortOrder = (a: Instructor, b: Instructor) =>
    (a.sortOrder ?? 999) - (b.sortOrder ?? 999);

export const teachers = derived(instructors, ($instructors) =>
    $instructors
        .filter((instructor) => instructor.role === "Teacher")
        .sort(bySortOrder),
);
export const tas = derived(instructors, ($instructors) =>
    $instructors
        .filter((instructor) => instructor.role === "TA")
        .sort(bySortOrder),
);
export const officers = derived(instructors, ($instructors) =>
    $instructors.filter((instructor) => instructor.officer).sort(bySortOrder),
);
export const openCourses = derived(courses, ($courses) =>
    $courses.filter((course) => course.registrationOpen),
);
export const closedCourses = derived(courses, ($courses) =>
    $courses.filter((course) => !course.registrationOpen),
);
export const featuredSubjects = derived(
    uiCopy,
    ($uiCopy) => $uiCopy.featuredSubjects,
);

let instructorsLoaded = false;
let coursesLoaded = false;
let uiCopyLoaded = false;
let instructorsRequest: Promise<Instructor[]> | undefined;
let coursesRequest: Promise<Course[]> | undefined;
let uiCopyRequest: Promise<UICopy> | undefined;
const courseCache = new Map<string, Course>();
const courseRequests = new Map<string, Promise<Course | null>>();

export function seedInstructors(data: Instructor[]) {
    if (!browser) return;
    instructors.set(data);
    instructorsLoaded = true;
}

export function seedCourses(data: Course[]) {
    if (!browser) return;
    courses.set(data);
    coursesLoaded = true;
    data.forEach((course) => courseCache.set(course.slug.current, course));
}

export function seedCourse(course: Course) {
    if (!browser) return;
    courseCache.set(course.slug.current, course);
}

export function seedUICopy(data: UICopy) {
    if (!browser) return;
    uiCopy.set(data);
    uiCopyLoaded = true;
}

async function requestInstructors() {
    return client.fetch<Instructor[]>(instructorQuery);
}

async function requestCourses() {
    return client.fetch<Course[]>(courseQuery);
}

async function requestUICopy(): Promise<UICopy> {
    try {
        const data = await client.fetch<UICopy | null>(uiCopyQuery);
        return { featuredSubjects: data?.featuredSubjects ?? [] };
    } catch {
        return { featuredSubjects: [] };
    }
}

export async function ensureInstructors(): Promise<Instructor[]> {
    if (!browser) return requestInstructors();
    if (instructorsLoaded) return get(instructors);

    instructorsRequest ??= requestInstructors()
        .then((data) => {
            seedInstructors(data);
            return data;
        })
        .finally(() => {
            instructorsRequest = undefined;
        });

    return instructorsRequest;
}

export async function ensureCourses(): Promise<Course[]> {
    if (!browser) return requestCourses();
    if (coursesLoaded) return get(courses);

    coursesRequest ??= requestCourses()
        .then((data) => {
            seedCourses(data);
            return data;
        })
        .finally(() => {
            coursesRequest = undefined;
        });

    return coursesRequest;
}

export async function ensureCourse(slug: string): Promise<Course | null> {
    if (browser) {
        const cached = courseCache.get(slug);
        if (cached) return cached;

        const pending = courseRequests.get(slug);
        if (pending) return pending;
    }

    const request = client.fetch<Course | null>(
        `*[_type == "course" && slug.current == $slug][0]{..., "posterUrl": poster.asset->url}`,
        { slug },
    );

    if (!browser) return request;

    courseRequests.set(slug, request);
    try {
        const course = await request;
        if (course) seedCourse(course);
        return course;
    } finally {
        courseRequests.delete(slug);
    }
}

export async function ensureUICopy(): Promise<UICopy> {
    if (!browser) return requestUICopy();
    if (uiCopyLoaded) return get(uiCopy);

    uiCopyRequest ??= requestUICopy()
        .then((data) => {
            seedUICopy(data);
            return data;
        })
        .finally(() => {
            uiCopyRequest = undefined;
        });

    return uiCopyRequest;
}

export async function refreshInstructors() {
    const data = await requestInstructors();
    seedInstructors(data);
    return data;
}

export async function refreshCourses() {
    const data = await requestCourses();
    seedCourses(data);
    return data;
}

export async function refreshUiCopy() {
    const data = await requestUICopy();
    seedUICopy(data);
    return data;
}
