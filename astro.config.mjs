// @ts-check
import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

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
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    css: {
      transformer: "postcss",
    },
  },
  site: 'https://melanie-kuhles.statichost.page',
  base: '/'
});
