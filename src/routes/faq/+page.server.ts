import { client } from '$lib/stores/sanityClient';

// Marketing may degrade during a CMS outage (`05` §6); archive layouts never
// import this module or await this fetch (`09` §10.4).
export const load = async () => {
	try {
		const faqs = await client.fetch<{ question: string; answer: string }[]>(
			'*[_type == "faq"] | order(_createdAt asc)', {}, { signal: AbortSignal.timeout(2000) }
		);
		return { faqs, unavailable: false };
	} catch {
		return { faqs: [], unavailable: true };
	}
};
