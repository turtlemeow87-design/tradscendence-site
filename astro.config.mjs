import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/server'; // or '/edge' if you want edge runtime

export default defineConfig({
  output: 'hybrid', // 'server' also OK; 'hybrid' lets static pages pre-render + runtime for dynamic
  adapter: vercel(),
});
