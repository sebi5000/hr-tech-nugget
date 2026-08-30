import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '@/config/site';
import { allNuggets } from '@/lib/nuggets';

export async function GET(context: APIContext) {
	const nuggets = await allNuggets();

	return rss({
		title: SITE.name,
		description: SITE.description,
		site: context.site ?? SITE.url,
		customData: `<language>de-de</language>`,
		items: nuggets.map(({ entry }) => ({
			title: entry.data.title,
			description: entry.data.dek,
			pubDate: entry.data.published,
			link: `/nuggets/${entry.id}/`,
			categories: [entry.data.topic],
		})),
	});
}
