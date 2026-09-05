// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical origin, required for absolute URLs in SEO meta tags and sitemap.
  site: 'https://hjx-25pc1.xyz',
  // Pages build to /about/index.html and are served as /about/. Stated
  // explicitly so canonical links and the sitemap share one URL form.
  build: { format: 'directory' },
  // Vercel's CDN already canonicalises /about -> /about/, so Astro no
  // longer enforces trailing slashes at build time.
  trailingSlash: 'ignore',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
