import { defineCollection, z } from "astro:content";

const post = defineCollection({
    type: 'content', //Markdown
    schema: z.object({
        title: z.string().optional(),

    }),
});

export const collections = { post };