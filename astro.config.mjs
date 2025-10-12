import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap'; // 👈 added import

export default defineConfig({
  // The canonical site URL (required for sitemap generation)
  site: 'https://soundbeyondborders.com',

  // fully static export; no adapter needed
  output: 'static',

  // Integrations
  integrations: [sitemap()], // 👈 added sitemap integration
});
