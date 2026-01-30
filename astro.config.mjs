// @ts-check
import { defineConfig } from 'astro/config';
import { imagetools } from 'vite-imagetools';
import mdx from "@astrojs/mdx";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["de", "en"],
    defaultLocale: "de",
    routing: {
      // falls du auch für die Default-Sprache ein Prefix willst: /de/...
      prefixDefaultLocale: true
    }
  },
  integrations: [mdx()],
  vite: {
    plugins: [imagetools(), tailwindcss()],
    css: {
      transformer: "postcss",
    },
  },
  site: 'https://melanie-kuhles.statichost.page',
  base: '/'
});