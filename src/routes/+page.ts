import type { PageLoad } from "./$types";
import { client } from "$lib/stores/sanityClient";

const defaultUniversities = [
    "Carnegie Mellon",
    "Berkeley",
    "MIT",
    "Princeton",
    "John's Hopkins",
    "Michigan",
    "WashU",
    "Wellesley",
];

function shuffle(items: string[]) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [
            shuffled[randomIndex],
            shuffled[index],
        ];
    }

    return shuffled;
}

export const load: PageLoad = async () => {
    try {
        const universities = await client.fetch<string[] | null>(
            `*[_type == "uiCopy"][0].universities`,
        );
        const validUniversities = universities?.filter(
            (university) => typeof university === "string" && university.trim(),
        );

        return {
            universities: shuffle(
                validUniversities?.length
                    ? validUniversities
                    : defaultUniversities,
            ),
        };
    } catch {
        return { universities: shuffle(defaultUniversities) };
    }
};
