// @ts-check
import { defineConfig } from 'astro/config';
import { imagetools } from 'vite-imagetools';

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
  vite: {
    plugins: [imagetools(), tailwindcss()]
  }
});