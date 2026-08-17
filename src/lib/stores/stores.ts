import { writable } from 'svelte/store';
import { dev } from '$app/environment';
import { client } from './sanityClient';
import type { Instructor, Course } from '$lib/types';

export const instructors = writable<Instructor[]>([]);
export const teachers = writable<Instructor[]>([]);
export const tas = writable<Instructor[]>([]);
export const officers = writable<Instructor[]>([]);

export const courses = writable<Course[]>([]);
export const openCourses = writable<Course[]>([]);
export const closedCourses = writable<Course[]>([]);

export const featuredSubjects = writable<string[]>([]);


export async function fetchInstructors() {
    const query = `*[_type == "instructor"]{..., "imageUrl": image.asset->url}`;
    const data: Instructor[] = await client.fetch(query);
    instructors.set(data);
    teachers.set(data.filter((i) => i.role === "Teacher").sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999)));
    tas.set(data.filter((i) => i.role === "TA").sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999)));
    officers.set(data.filter((i) => i.officer).sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999)));
}

export async function fetchCourses() {
    const query = `*[_type == "course"]{..., "posterUrl": poster.asset->url}`;
    const data: Course[] = await client.fetch(query);
    courses.set(data);
    openCourses.set(data.filter((c) => c.registrationOpen));
    closedCourses.set(data.filter((c) => !c.registrationOpen));
}

export async function fetchFeaturedSubjects() {
    const query = `*[_type == "uiCopy"][0].featuredSubjects`;
    const data: string[] = await client.fetch(query);
    featuredSubjects.set(data || []);
}

instructors.subscribe((value) => {
  if (dev) {
    console.log('Updated instructors:', value);
  }
});

courses.subscribe((value) => {
  if (dev) {
    console.log('Updated courses:', value);
  }
});

fetchInstructors();
fetchCourses();
fetchFeaturedSubjects();