import { defineCollection, z } from "astro:content";

const sections = defineCollection({
    type: 'content', //Markdown
    schema: z.object({
        title: z.string().optional(),
        image: z.string().optional(),
    }),
});

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),

      heroImage: image().optional(),
      heroAlt: z.string().optional(),
    }),
});

export const collections = { sections, blog };

