// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://soundbeyondborders.com',

  output: 'server',

  adapter: vercel(),

  integrations: [sitemap()],

  // Image optimization config.
  // Sharp is the default service and is included automatically with the Vercel adapter.
  // These are global defaults — you can override per-image with props on <Image />.
  image: {
    // Default format for all <Image /> components that don't specify format="..."
    // WebP is the best choice: ~30% smaller than JPEG, supported in all modern browsers.
    // Your logo.png stays as PNG because it's referenced with a plain <img> tag.
    format: 'webp',

    // domains/remotePatterns: needed if you ever use <Image /> with an external src URL.
    // YouTube thumbnails in YouTubeFacade.astro use a plain <img> tag (not <Image />),
    // so you don't need to add ytimg.com here.
    remotePatterns: [],
  },
});
