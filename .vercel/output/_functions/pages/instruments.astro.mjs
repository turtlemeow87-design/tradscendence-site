import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute, f as renderScript } from '../chunks/astro/server_CfHE34sL.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DPR2iDcX.mjs';
import { $ as $$Divider } from '../chunks/Divider_DKHzv4fB.mjs';
import { neon } from '@neondatabase/serverless';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const title = "My Instruments — Tradscendence | Sound Beyond Borders";
  const description = "Browse Hunter Eastland’s world & folk instruments. Hear quick audio teasers and jump to pages: Surbahar, Oud, Saz, Rabab, Esraj, Duduk, Tar, and more.";
  const LATEST_YT = {
    id: "OUpYRKzTAhM?si=Vh8olflrhQvMtgcs",
    // true if the latest is a Short (9:16)
    title: "My latest performance",
    // caption + a11y title
    instrumentLink: "/instruments/CumbusOud"
    // point to the featured instrument (or '/instruments')
  };
  const embedUrl = `https://www.youtube.com/embed/${LATEST_YT.id}?rel=0`;
  const watchUrl = `https://youtu.be/${LATEST_YT.id}`;
  const sql = neon("postgresql://neondb_owner:npg_7w9kgXDBueEJ@ep-shiny-river-aiuubcro-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require");
  const dbItems = await sql`
  SELECT slug, name, audio_teaser, page_ready
  FROM instruments
  ORDER BY display_order ASC
`;
  const items = dbItems.map((row) => ({
    name: row.name,
    file: row.audio_teaser,
    href: row.page_ready ? `/instruments/${row.slug}` : "/coming-soon"
  }));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "canonical": "https://www.soundbeyondborders.com/instruments/", "data-astro-cid-roqy4i5r": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="instruments-page mx-auto max-w-6xl px-4 py-10 space-y-6" data-astro-cid-roqy4i5r> <h1 class="font-display text-3xl" data-astro-cid-roqy4i5r>My Instruments</h1> <p class="opacity-80" data-astro-cid-roqy4i5r>
Instruments that I've collected and learned to play over the years. Hit the play
      button to <b data-astro-cid-roqy4i5r>hear</b> a quick teaser that I made! Clicking the instrument's name sends
      you to the instrument's page. I hope you find a sound that you like! :)
</p> <ul class="grid gap-4 sm:grid-cols-2 md:grid-cols-3" data-astro-cid-roqy4i5r> ${items.map(({ name, file, href }) => renderTemplate`<li class="frame rounded-xl p-3 flex items-center justify-between" data-astro-cid-roqy4i5r> <a class="gothic-link"${addAttribute(href, "href")} data-astro-cid-roqy4i5r>${name}</a> <button type="button" class="opacity-60 hover:opacity-100 transition"${addAttribute(file, "data-audio")}${addAttribute(`Play ${name} sample`, "aria-label")} data-astro-cid-roqy4i5r>
▶︎
</button> </li>`)} </ul> </section> ${renderComponent($$result2, "Divider", $$Divider, { "data-astro-cid-roqy4i5r": true })}  <section id="latest-video" class="mx-auto max-w-6xl px-4 pb-10 scroll-mt-24" data-astro-cid-roqy4i5r> <h2 class="font-display text-xl sm:text-2xl mb-3 sm:mb-4" data-astro-cid-roqy4i5r>
My Latest Youtube Upload!
</h2> <figure class="space-y-3" data-astro-cid-roqy4i5r> <!-- Responsive frame that adapts to Shorts vs. regular --> <div${addAttribute(`relative w-full ${"aspect-video"} rounded-2xl overflow-hidden frame shadow-soft`, "class")} data-astro-cid-roqy4i5r> <iframe class="absolute inset-0 w-full h-full"${addAttribute(embedUrl, "src")}${addAttribute(LATEST_YT.title, "title")} loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen data-astro-cid-roqy4i5r></iframe> </div> <figcaption class="text-sm opacity-80 flex flex-col sm:flex-row sm:items-center sm:gap-3" data-astro-cid-roqy4i5r> <span class="font-display" data-astro-cid-roqy4i5r>${LATEST_YT.title}</span> <a${addAttribute(watchUrl, "href")} target="_blank" rel="noopener" class="gothic-link font-bold" data-astro-cid-roqy4i5r>
Watch on YouTube →
</a> </figcaption> </figure> <!-- “Explore this instrument” link, matching your CTA style --> <div class="pt-4" data-astro-cid-roqy4i5r> <a${addAttribute(LATEST_YT.instrumentLink, "href")} class="group gothic-link font-bold inline-flex items-center gap-1 drop-shadow-[0_0_2px_ivory]" data-astro-cid-roqy4i5r> <span data-astro-cid-roqy4i5r>Explore this instrument more</span> <span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5" data-astro-cid-roqy4i5r>→</span> </a> </div> </section> ${renderScript($$result2, "C:/Users/Owner/tradscendence-site/src/pages/instruments/index.astro?astro&type=script&index=0&lang.ts")}    ` })}`;
}, "C:/Users/Owner/tradscendence-site/src/pages/instruments/index.astro", void 0);
const $$file = "C:/Users/Owner/tradscendence-site/src/pages/instruments/index.astro";
const $$url = "/instruments";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
