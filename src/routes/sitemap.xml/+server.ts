import { client } from '$lib/stores/sanityClient';

const SITE_URL = 'https://helix-ed.org';

const STATIC_PAGES = [
  '/',
  '/enroll',
  '/about-us',
  '/contact',
  '/recruiting',
  '/privacy-policy',
  '/attributions'
];

export const GET = async () => {
  const courses: { slug: string; updatedAt: string }[] = await client.fetch(
    `*[_type == "course" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`
  );

  const staticUrls = STATIC_PAGES.map(
    (path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n  </url>`
  );

  const courseUrls = courses.map((course) => {
    const lastmod = course.updatedAt?.slice(0, 10);
    return `  <url>\n    <loc>${SITE_URL}/classes/${encodeURIComponent(course.slug)}</loc>${
      lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
    }\n  </url>`;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    ...staticUrls,
    ...courseUrls
  ].join('\n')}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
