import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel'; // fixed: was '@astrojs/vercel/serverless'

export default defineConfig({
  site: 'https://soundbeyondborders.com',
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap()],
});
