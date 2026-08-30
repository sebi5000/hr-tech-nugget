import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Astro 6+: zod comes from 'astro/zod'. Not from 'astro:content', and 'astro:schema' is gone.
import { z } from 'astro/zod';
import { TOPIC_IDS } from '@/config/site';

const nuggets = defineCollection({
	loader: glob({ base: './src/content/nuggets', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string().min(1).max(90),
		/** Standfirst under the H1, archive description, RSS description and meta description. */
		dek: z.string().min(1).max(240),
		topic: z.enum(TOPIC_IDS),
		published: z.coerce.date(),
		updated: z.coerce.date().optional(),
		draft: z.boolean().default(false),
		/**
		 * Pin only. Normal append-only writing never sets this. Exists because
		 * backdating a nugget otherwise renumbers everything published after it.
		 */
		number: z.number().int().positive().optional(),
	}),
});

export const collections = { nuggets };
