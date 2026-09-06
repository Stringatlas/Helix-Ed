import { client } from "$lib/stores/sanityClient";
import type { RequestHandler } from "./$types";

const origin = "https://helix-ed.org";
const staticPaths = [
    "/",
    "/about-us",
    "/enroll",
    "/contact",
    "/recruiting",
    "/privacy-policy",
    "/attributions",
];

const escapeXml = (value: string) =>
    value.replace(/[<>&'\"]/g, (character) => ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
    })[character] ?? character);

export const GET: RequestHandler = async () => {
    const courses = await client.fetch<{ slug: string; updatedAt: string }[]>(
        `*[_type == "course" && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt}`,
    );
    const urls = [
        ...staticPaths.map((path) => ({ location: `${origin}${path}`, updatedAt: null })),
        ...courses.map((course) => ({
            location: `${origin}/classes/${encodeURIComponent(course.slug)}`,
            updatedAt: course.updatedAt?.slice(0, 10) ?? null,
        })),
    ];
    const entries = urls.map(({ location, updatedAt }) =>
        `  <url><loc>${escapeXml(location)}</loc>${updatedAt ? `<lastmod>${updatedAt}</lastmod>` : ""}</url>`,
    ).join("\n");

    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`,
        { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } },
    );
};
