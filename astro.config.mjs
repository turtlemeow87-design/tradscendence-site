import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel'; // fixed: was '@astrojs/vercel/serverless'

// Pages that shouldn't show up in search: private, account, placeholder, and the "secret" wish list.
// Instrument pages come from the database, so they're listed by src/pages/sitemap-instruments.xml.ts.
const NOT_IN_SITEMAP = /^\/(admin|dashboard|login|register|verify|reset-password|thanks|blog|store|calendar|coming-soon|mywishlist)(\/|$)/;

export default defineConfig({
  site: 'https://soundbeyondborders.com',
  output: 'server',
  adapter: vercel(),
  // Astro 5.14.2+ ignores the incoming host unless it's listed here and falls back to "localhost".
  // Its cross-site form check then rejected our own sign-out and admin PDF uploads (403).
  security: {
    allowedDomains: [
      { hostname: 'soundbeyondborders.com', protocol: 'https' },
      { hostname: 'www.soundbeyondborders.com', protocol: 'https' },
    ],
  },
  integrations: [
    sitemap({
      filter: (page) => !NOT_IN_SITEMAP.test(new URL(page).pathname),
      // Match the canonical URLs, which have no trailing slash (except the home page)
      serialize: (item) => {
        const { pathname } = new URL(item.url);
        return pathname === '/' ? item : { ...item, url: item.url.replace(/\/$/, '') };
      },
    }),
  ],
});
