import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless'; // 👈 added for API routes

export default defineConfig({
  // The canonical site URL (required for sitemap generation)
  site: 'https://soundbeyondborders.com',

  // changed to 'server' to enable API routes
  output: 'server',

  // Vercel adapter for deployment
  adapter: vercel(),

  // Integrations
  integrations: [sitemap()], // 👈 your sitemap still works!
});