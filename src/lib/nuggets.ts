import { getCollection, type CollectionEntry } from 'astro:content';
import type { TopicId } from '@/config/site';

/**
 * The ONLY module allowed to call getCollection('nuggets').
 *
 * Numbering is derived from publish order, so it has to be derived in exactly
 * one place — otherwise the hero, the featured badge, the archive column and
 * the article breadcrumb can disagree about what number a nugget has.
 */

export type Nugget = {
	entry: CollectionEntry<'nuggets'>;
	number: number;
	readingMinutes: number;
};

const WORDS_PER_MINUTE = 200;

/**
 * Word count from raw MDX. Strips the things that are not prose so a
 * <BarFigure bars={[...]} /> does not inflate the reading time.
 */
export function estimateMinutes(body: string): number {
	const prose = body
		.replace(/^---[\s\S]*?---/, '') // frontmatter, if the loader left it
		.replace(/```[\s\S]*?```/g, '') // fenced code
		.replace(/^import\s.+$/gm, '') // MDX imports
		.replace(/<[^>]+>/g, ' ') // JSX/HTML tags and their props
		.replace(/[#*_>`|-]/g, ' '); // markdown punctuation

	const words = prose.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

let cache: Nugget[] | null = null;

/** All published nuggets, numbered, newest first. */
export async function allNuggets(): Promise<Nugget[]> {
	if (cache) return cache;

	// Drafts are filtered BEFORE numbering. Otherwise publishing a draft
	// renumbers every nugget that came after it.
	const entries = await getCollection('nuggets', ({ data }) =>
		import.meta.env.PROD ? !data.draft : true,
	);

	const ascending = [...entries].sort((a, b) => {
		const byDate = a.data.published.getTime() - b.data.published.getTime();
		// Deterministic tiebreak, so same-day nuggets number identically on CI and locally.
		return byDate !== 0 ? byDate : a.id.localeCompare(b.id);
	});

	const numbered = ascending.map((entry, i) => ({
		entry,
		number: entry.data.number ?? i + 1,
		readingMinutes: estimateMinutes(entry.body ?? ''),
	}));

	cache = numbered.reverse();
	return cache;
}

export async function latestNugget(): Promise<Nugget | undefined> {
	return (await allNuggets())[0];
}

/** Everything below the featured nugget — the home page's "more" rows. */
export async function homeArchive(limit = 5): Promise<Nugget[]> {
	return (await allNuggets()).slice(1, 1 + limit);
}

export async function nuggetsByTopic(topic: TopicId): Promise<Nugget[]> {
	return (await allNuggets()).filter((n) => n.entry.data.topic === topic);
}

export async function topicCount(topic: TopicId): Promise<number> {
	return (await nuggetsByTopic(topic)).length;
}

export async function totalCount(): Promise<number> {
	return (await allNuggets()).length;
}

export async function findBySlug(slug: string): Promise<Nugget | undefined> {
	return (await allNuggets()).find((n) => n.entry.id === slug);
}

/** Up to two other nuggets for the READ NEXT band, preferring the same topic. */
export async function readNext(current: Nugget, limit = 2): Promise<Nugget[]> {
	const others = (await allNuggets()).filter((n) => n.entry.id !== current.entry.id);
	const sameTopic = others.filter((n) => n.entry.data.topic === current.entry.data.topic);
	const rest = others.filter((n) => n.entry.data.topic !== current.entry.data.topic);
	return [...sameTopic, ...rest].slice(0, limit);
}

/** Newest publish/update date across all nuggets — powers the spec strip. */
export async function lastUpdated(): Promise<Date | undefined> {
	const all = await allNuggets();
	const dates = all.map((n) => n.entry.data.updated ?? n.entry.data.published);
	if (dates.length === 0) return undefined;
	return dates.reduce((newest, d) => (d > newest ? d : newest));
}
