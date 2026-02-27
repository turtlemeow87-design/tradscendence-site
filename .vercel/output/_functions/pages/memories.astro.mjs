import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_CfHE34sL.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DPR2iDcX.mjs';
export { renderers } from '../renderers.mjs';

const $$Memories = createComponent(($$result, $$props, $$slots) => {
  const title = "Memories \u2014 Tradscendence | Sound Beyond Borders";
  const description = "A living timeline of Hunter Eastland\u2019s performances and reflections \u2014 from intimate world and folk instrument events to personal milestones in music and travel.";
  const memories = [
    {
      title: "Palestinian-Style Wedding",
      date: "2024-09-13",
      location: "Wintergreen, VA",
      reflection: "This was a beautiful wedding in the mountains, where I took the opportunity to enhance the atomosphere with some Arabic-style taqsim.  The entire trip was a pleasure, the couple and their family were very warm, and I am proud to have this as my first professional memory with music.",
      video: { youtubeId: "dQw4w9WgXcQ" },
      // or your real video src
      photos: [
        { src: "/media/BrideandGroom1.jpg", alt: "" }
      ]
    }
  ];
  const sorted = [...memories].sort((a, b) => a.date < b.date ? 1 : -1);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="mx-auto max-w-6xl px-4 py-10 space-y-8 text-ivory"> <header class="space-y-2"> <h1 class="font-display text-3xl">Memories</h1> <p class="opacity-80">
A living timeline of performances — brief reflections, sounds, and images. Newest first.
</p> </header> <ol class="relative pl-6 sm:pl-8"> <div class="absolute left-2 sm:left-3 top-0 bottom-0" style="width:2px;background:var(--accent-gold);" aria-hidden="true"></div> ${sorted.map((m) => renderTemplate`<li class="relative mb-10 last:mb-0"> <span class="absolute -left-0.5 sm:-left-1 top-1.5 inline-block rounded-full ring-2" style="
              width:14px;height:14px;
              background:var(--accent-gold);
              box-shadow: 0 0 0 2px rgba(0,0,0,0.5);
            " aria-hidden="true"></span> <article class="ml-6 sm:ml-8 grid gap-4"> <div class="flex flex-wrap items-center gap-x-3 gap-y-1"> <h2 class="font-display text-xl leading-snug">${m.title}</h2> <span class="text-xs px-2 py-0.5 rounded-full" style="background:color-mix(in oklab, var(--accent-gold) 20%, transparent); color:var(--ivory); border:1px solid rgba(0,0,0,.35);"> ${new Date(m.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} </span> ${m.location && renderTemplate`<span class="text-sm opacity-80">• ${m.location}</span>`} </div> <p class="opacity-90">${m.reflection}</p> ${(m.video || m.photos && m.photos.length) && renderTemplate`<div class="grid gap-4 md:grid-cols-5"> ${m.video && renderTemplate`<div class="md:col-span-3 rounded-xl overflow-hidden frame bg-ebony/60"> ${m.video.youtubeId ? renderTemplate`<div class="aspect-video"> <iframe class="w-full h-full"${addAttribute("media/PalestinianOud.mp4", "src")}${addAttribute(`${m.title} video`, "title")} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> </div>` : renderTemplate`<video class="w-full h-auto block" controls preload="metadata"${addAttribute(m.video.poster, "poster")}> <source${addAttribute(m.video.src, "src")} type="video/mp4">
Your browser does not support the video tag.
</video>`} </div>`} ${m.photos && m.photos.length > 0 && renderTemplate`<div${addAttribute(`grid gap-3 ${m.video ? "md:col-span-2" : "md:col-span-5 md:grid-cols-2"}`, "class")}> ${m.photos.slice(0, 4).map((p) => renderTemplate`<figure class="rounded-xl overflow-hidden frame bg-ebony/40"> <img${addAttribute(p.src, "src")}${addAttribute(p.alt || m.title, "alt")} class="w-full h-100 object-cover" loading="lazy"> </figure>`)} </div>`} </div>`} </article> </li>`)} </ol> </section> ` })}`;
}, "C:/Users/Owner/tradscendence-site/src/pages/memories.astro", void 0);

const $$file = "C:/Users/Owner/tradscendence-site/src/pages/memories.astro";
const $$url = "/memories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Memories,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
