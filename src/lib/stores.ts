import bioBrawlData from "$lib/bioBrawlData.json";
import { writable } from 'svelte/store';


type ValidYear = keyof typeof bioBrawlData;
let currentYear: ValidYear = Object.keys(bioBrawlData).at(-1) as ValidYear;

let registrationOpens = "August 15th";

function isValidYear(year: string): year is ValidYear {
    return year in bioBrawlData;
}

export const currentEvent = writable(bioBrawlData[currentYear]);
export const events = writable(bioBrawlData);