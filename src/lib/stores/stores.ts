import { writable } from 'svelte/store';
import { client } from './sanityClient';
import type { Instructor, Course } from '$lib/types';

export const instructors = writable<Instructor[]>([]);
export const teachers = writable<Instructor[]>([]);
export const tas = writable<Instructor[]>([]);
export const officers = writable<Instructor[]>([]);

export const courses = writable<Course[]>([]);
export const openCourses = writable<Course[]>([]);
export const closedCourses = writable<Course[]>([]);


export async function fetchInstructors() {
    const query = `*[_type == "instructor"]{
        name,
        school,
        subjects,
        role,
        officer,
        additionalRole,
        bio,
        "imageUrl": image.asset->url,
        image {
            alt
        }
    }`;
    const data: Instructor[] = await client.fetch(query);
    instructors.set(data);
    teachers.set(data.filter((i) => i.role === "Teacher"));
    tas.set(data.filter((i) => i.role === "TA"));
    officers.set(data.filter((i) => i.officer));
}

export async function fetchCourses() {
    const query = `*[_type == "course"]{
        title,
        season,
        subject,
        slug,
        description,
        registrationForm,
        syllabus,
        status,
        studentDescription,
        tuition,
        "posterUrl": poster.asset->url,
        dates,
        content,
        registrationOpen
    }`;
    const data: Course[] = await client.fetch(query);
    courses.set(data);
    openCourses.set(data.filter((c) => c.registrationOpen));
    closedCourses.set(data.filter((c) => !c.registrationOpen));
}

instructors.subscribe((value) => {
  console.log('Updated instructors:', value);
});

courses.subscribe((value) => {
  console.log('Updated courses:', value);
});

fetchInstructors();
fetchCourses();