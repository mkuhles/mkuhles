import { defineCollection, z } from "astro:content";

const sections = defineCollection({
    type: 'content', //Markdown
    schema: z.object({
        title: z.string().optional(),
        image: z.string().optional(),
    }),
});

export const collections = { sections };