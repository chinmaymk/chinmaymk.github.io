// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://chinmay.ai',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
