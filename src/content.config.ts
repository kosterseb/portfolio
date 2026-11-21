import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One line shown on cards and lists. */
      summary: z.string(),
      category: z.enum(['Product', 'Web', 'Games', 'Music']),
      year: z.coerce.string(),
      role: z.string(),
      client: z.string().optional(),
      stack: z.array(z.string()).default([]),
      /** Cover image in src/assets/work. Without one, a typographic cover is drawn. */
      cover: image().optional(),
      /** Silent looping clip in public/media/work/<slug>/ (.mp4, with a .webm next to it). */
      clip: z.string().optional(),
      poster: z.string().optional(),
      links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
      /** Extra images for the case study (src/assets/work). */
      gallery: z.array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() })).default([]),
      /** Extra silent loops for the case study (public/media/work/<slug>/, .mp4 with a .webm next to it). */
      footage: z.array(z.object({ src: z.string(), poster: z.string().optional(), caption: z.string() })).default([]),
      /** Shown in "Selected work" on the home page. */
      featured: z.boolean().default(false),
      order: z.number().default(99),
      draft: z.boolean().default(false),
    }),
});

export const collections = { work };
