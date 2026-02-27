import { c as createComponent, e as createAstro, r as renderComponent, a as renderTemplate, u as unescapeHTML, b as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_CfHE34sL.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_DPR2iDcX.mjs';
import { $ as $$Divider } from '../../chunks/Divider_DKHzv4fB.mjs';
import { neon } from '@neondatabase/serverless';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const sql = neon("postgresql://neondb_owner:npg_7w9kgXDBueEJ@ep-shiny-river-aiuubcro-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require");
  const instruments = await sql`SELECT * FROM instruments WHERE slug = ${slug}`;
  if (instruments.length === 0) {
    return Astro2.redirect("/instruments");
  }
  const inst = instruments[0];
  const videos = await sql`
  SELECT label, video_type AS type, src, poster, aspect_ratio AS ratio
  FROM instrument_videos
  WHERE instrument_id = ${inst.id}
  ORDER BY display_order ASC
`;
  const videoTabs = videos.map((v, i) => ({
    ...v,
    id: `v${i + 1}`
  }));
  const moods = await sql`
  SELECT label, audio_file
  FROM instrument_moods
  WHERE instrument_id = ${inst.id}
  ORDER BY display_order ASC
`;
  const title = inst.seo_title || `${inst.name} — Tradscendence | Sound Beyond Borders`;
  const description = inst.seo_description || `Explore the ${inst.name} with Hunter Eastland.`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "data-astro-cid-n7g4m3vo": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<section class="mx-auto max-w-6xl px-4 py-10 space-y-8" data-astro-cid-n7g4m3vo> <header class="space-y-2" data-astro-cid-n7g4m3vo> <h1 class="font-display text-3xl md:text-4xl" data-astro-cid-n7g4m3vo>', "</h1> ", " </header> <!-- ═══ Tabbed Hero Video (only renders if videos exist) ═══ --> ", " <!-- ═══ About Section ═══ --> ", ` <!-- ═══ Back Link ═══ --> <div class="pt-8" data-astro-cid-n7g4m3vo> <a href="/instruments" class="inline-flex items-center gap-2 font-display text-lg text-[var(--accent-gold)] hover:text-[var(--accent-rosewood)] transition-colors duration-200 group" data-astro-cid-n7g4m3vo> <span data-astro-cid-n7g4m3vo>Explore More Instruments</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" data-astro-cid-n7g4m3vo> <path d="M5 12h14" data-astro-cid-n7g4m3vo></path> <path d="M13 5l7 7-7 7" data-astro-cid-n7g4m3vo></path> </svg> </a> </div> </section>  <script type="module">
  // Tab behavior + adaptive aspect ratio
  const tablist = document.querySelector('[role="tablist"]');
  const shell = document.getElementById('video-shell');
  const buttons = tablist ? Array.from(tablist.querySelectorAll('.tab-button')) : [];
  const panes = Array.from(document.querySelectorAll('.video-pane'));

  const ratioMap = new Map();

  const setShellRatio = (ratioString) => {
    if (!shell) return;
    shell.style.setProperty('--ar', ratioString || '16 / 9');
  };

  const measurePane = (pane) => {
    const manual = pane.getAttribute('data-ratio');
    if (manual && manual.includes('/')) {
      ratioMap.set(pane.id, manual);
      return;
    }

    const vid = pane.querySelector('video');
    if (vid) {
      const apply = () => {
        const w = vid.videoWidth, h = vid.videoHeight;
        if (w && h) ratioMap.set(pane.id, \`\${w} / \${h}\`);
      };
      if (vid.readyState >= 1) {
        apply();
      } else {
        vid.addEventListener('loadedmetadata', apply, { once: true });
      }
      return;
    }

    const ifr = pane.querySelector('iframe');
    if (ifr) {
      ratioMap.set(pane.id, manual || '16 / 9');
    }
  };

  panes.forEach(measurePane);

  const activate = (id) => {
    for (const btn of buttons) {
      const isSelected = btn.dataset.tab === id;
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      btn.tabIndex = isSelected ? 0 : -1;
    }
    for (const pane of panes) {
      const isActive = pane.dataset.pane === id;
      pane.classList.toggle('is-active', isActive);

      if (!isActive) {
        const vid = pane.querySelector('video');
        if (vid) vid.pause();
        const ifr = pane.querySelector('iframe');
        if (ifr) { const src = ifr.src; ifr.src = src; }
      } else {
        const r = ratioMap.get(pane.id) || pane.getAttribute('data-ratio') || '16 / 9';
        setShellRatio(r);
      }
    }
  };

  if (tablist) {
    tablist.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-button');
      if (!btn) return;
      activate(btn.dataset.tab);
    });

    tablist.addEventListener('keydown', (e) => {
      const currentIndex = buttons.findIndex(b => b.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        const next = buttons[(currentIndex + 1) % buttons.length];
        next.focus(); activate(next.dataset.tab); e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        const prev = buttons[(currentIndex - 1 + buttons.length) % buttons.length];
        prev.focus(); activate(prev.dataset.tab); e.preventDefault();
      } else if (e.key === 'Enter' || e.key === ' ') {
        const btn = document.activeElement;
        if (btn && btn.classList.contains('tab-button')) {
          activate(btn.dataset.tab); e.preventDefault();
        }
      }
    });
  }

  const initiallyActive = panes.find(p => p.classList.contains('is-active')) || panes[0];
  if (initiallyActive) {
    const applyInitial = () => {
      const r = ratioMap.get(initiallyActive.id) || initiallyActive.getAttribute('data-ratio') || '16 / 9';
      setShellRatio(r);
    };

    const vid = initiallyActive.querySelector('video');
    if (vid && !(vid.readyState >= 1)) {
      vid.addEventListener('loadedmetadata', applyInitial, { once: true });
    } else {
      applyInitial();
    }
  }

  const initiallySelected = buttons.find(b => b.getAttribute('aria-selected') === 'true') || buttons[0];
  buttons.forEach(b => (b.tabIndex = b === initiallySelected ? 0 : -1));

  // Audio play behavior for mood buttons
  document.addEventListener('DOMContentLoaded', () => {
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    const players = new Map();
    let current = null;

    const getPlayer = (src) => {
      if (!players.has(src)) {
        const a = new Audio(src);
        a.preload = 'none';
        players.set(src, a);
      }
      return players.get(src);
    };

    const stopCurrent = () => {
      if (current && !current.paused) {
        current.pause();
        current.currentTime = 0;
      }
    };

    const play = async (src) => {
      stopCurrent();
      const a = getPlayer(src);
      current = a;
      a.currentTime = 0;
      a.volume = 0.9;
      try { await a.play(); } catch {}
    };

    document.querySelectorAll('[data-audio]').forEach(btn => {
      const src = btn.getAttribute('data-audio');
      btn.addEventListener('click', () => play(src), { passive: true });
      if (supportsHover) {
        btn.addEventListener('mouseenter', () => play(src));
        btn.addEventListener('mouseleave', () => stopCurrent());
        btn.addEventListener('blur', () => stopCurrent());
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopCurrent();
    });
  });
  </script> `], [" ", '<section class="mx-auto max-w-6xl px-4 py-10 space-y-8" data-astro-cid-n7g4m3vo> <header class="space-y-2" data-astro-cid-n7g4m3vo> <h1 class="font-display text-3xl md:text-4xl" data-astro-cid-n7g4m3vo>', "</h1> ", " </header> <!-- ═══ Tabbed Hero Video (only renders if videos exist) ═══ --> ", " <!-- ═══ About Section ═══ --> ", ` <!-- ═══ Back Link ═══ --> <div class="pt-8" data-astro-cid-n7g4m3vo> <a href="/instruments" class="inline-flex items-center gap-2 font-display text-lg text-[var(--accent-gold)] hover:text-[var(--accent-rosewood)] transition-colors duration-200 group" data-astro-cid-n7g4m3vo> <span data-astro-cid-n7g4m3vo>Explore More Instruments</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" data-astro-cid-n7g4m3vo> <path d="M5 12h14" data-astro-cid-n7g4m3vo></path> <path d="M13 5l7 7-7 7" data-astro-cid-n7g4m3vo></path> </svg> </a> </div> </section>  <script type="module">
  // Tab behavior + adaptive aspect ratio
  const tablist = document.querySelector('[role="tablist"]');
  const shell = document.getElementById('video-shell');
  const buttons = tablist ? Array.from(tablist.querySelectorAll('.tab-button')) : [];
  const panes = Array.from(document.querySelectorAll('.video-pane'));

  const ratioMap = new Map();

  const setShellRatio = (ratioString) => {
    if (!shell) return;
    shell.style.setProperty('--ar', ratioString || '16 / 9');
  };

  const measurePane = (pane) => {
    const manual = pane.getAttribute('data-ratio');
    if (manual && manual.includes('/')) {
      ratioMap.set(pane.id, manual);
      return;
    }

    const vid = pane.querySelector('video');
    if (vid) {
      const apply = () => {
        const w = vid.videoWidth, h = vid.videoHeight;
        if (w && h) ratioMap.set(pane.id, \\\`\\\${w} / \\\${h}\\\`);
      };
      if (vid.readyState >= 1) {
        apply();
      } else {
        vid.addEventListener('loadedmetadata', apply, { once: true });
      }
      return;
    }

    const ifr = pane.querySelector('iframe');
    if (ifr) {
      ratioMap.set(pane.id, manual || '16 / 9');
    }
  };

  panes.forEach(measurePane);

  const activate = (id) => {
    for (const btn of buttons) {
      const isSelected = btn.dataset.tab === id;
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      btn.tabIndex = isSelected ? 0 : -1;
    }
    for (const pane of panes) {
      const isActive = pane.dataset.pane === id;
      pane.classList.toggle('is-active', isActive);

      if (!isActive) {
        const vid = pane.querySelector('video');
        if (vid) vid.pause();
        const ifr = pane.querySelector('iframe');
        if (ifr) { const src = ifr.src; ifr.src = src; }
      } else {
        const r = ratioMap.get(pane.id) || pane.getAttribute('data-ratio') || '16 / 9';
        setShellRatio(r);
      }
    }
  };

  if (tablist) {
    tablist.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-button');
      if (!btn) return;
      activate(btn.dataset.tab);
    });

    tablist.addEventListener('keydown', (e) => {
      const currentIndex = buttons.findIndex(b => b.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        const next = buttons[(currentIndex + 1) % buttons.length];
        next.focus(); activate(next.dataset.tab); e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        const prev = buttons[(currentIndex - 1 + buttons.length) % buttons.length];
        prev.focus(); activate(prev.dataset.tab); e.preventDefault();
      } else if (e.key === 'Enter' || e.key === ' ') {
        const btn = document.activeElement;
        if (btn && btn.classList.contains('tab-button')) {
          activate(btn.dataset.tab); e.preventDefault();
        }
      }
    });
  }

  const initiallyActive = panes.find(p => p.classList.contains('is-active')) || panes[0];
  if (initiallyActive) {
    const applyInitial = () => {
      const r = ratioMap.get(initiallyActive.id) || initiallyActive.getAttribute('data-ratio') || '16 / 9';
      setShellRatio(r);
    };

    const vid = initiallyActive.querySelector('video');
    if (vid && !(vid.readyState >= 1)) {
      vid.addEventListener('loadedmetadata', applyInitial, { once: true });
    } else {
      applyInitial();
    }
  }

  const initiallySelected = buttons.find(b => b.getAttribute('aria-selected') === 'true') || buttons[0];
  buttons.forEach(b => (b.tabIndex = b === initiallySelected ? 0 : -1));

  // Audio play behavior for mood buttons
  document.addEventListener('DOMContentLoaded', () => {
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    const players = new Map();
    let current = null;

    const getPlayer = (src) => {
      if (!players.has(src)) {
        const a = new Audio(src);
        a.preload = 'none';
        players.set(src, a);
      }
      return players.get(src);
    };

    const stopCurrent = () => {
      if (current && !current.paused) {
        current.pause();
        current.currentTime = 0;
      }
    };

    const play = async (src) => {
      stopCurrent();
      const a = getPlayer(src);
      current = a;
      a.currentTime = 0;
      a.volume = 0.9;
      try { await a.play(); } catch {}
    };

    document.querySelectorAll('[data-audio]').forEach(btn => {
      const src = btn.getAttribute('data-audio');
      btn.addEventListener('click', () => play(src), { passive: true });
      if (supportsHover) {
        btn.addEventListener('mouseenter', () => play(src));
        btn.addEventListener('mouseleave', () => stopCurrent());
        btn.addEventListener('blur', () => stopCurrent());
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopCurrent();
    });
  });
  </script> `])), maybeRenderHead(), inst.name, inst.tagline && renderTemplate`<p class="opacity-80 max-w-3xl" data-astro-cid-n7g4m3vo>${inst.tagline}</p>`, videoTabs.length > 0 && renderTemplate`<section class="rounded-2xl overflow-hidden frame border border-black/40 bg-black/20" data-astro-cid-n7g4m3vo> <div class="tab-strip px-3 pt-3 sm:px-4 sm:pt-4" role="tablist" aria-label="Choose performance" data-astro-cid-n7g4m3vo> ${videoTabs.map((v, i) => renderTemplate`<button class="tab-button"${addAttribute(v.id, "data-tab")} role="tab"${addAttribute(i === 0 ? "true" : "false", "aria-selected")}${addAttribute(`pane-${v.id}`, "aria-controls")}${addAttribute(`tab-${v.id}`, "id")} data-astro-cid-n7g4m3vo> ${v.label} </button>`)} </div> <div id="video-shell" class="relative w-full bg-black" style="aspect-ratio: var(--ar, 16 / 9);" data-astro-cid-n7g4m3vo> ${videoTabs.map((v, i) => renderTemplate`<div${addAttribute(`pane-${v.id}`, "id")}${addAttribute(v.id, "data-pane")} role="tabpanel"${addAttribute(`tab-${v.id}`, "aria-labelledby")}${addAttribute(`video-pane ${i === 0 ? "is-active" : ""}`, "class")}${addAttribute(v.ratio || "", "data-ratio")} data-astro-cid-n7g4m3vo> ${v.type === "video" && v.src ? renderTemplate`<video class="h-full w-full object-contain" controls playsinline preload="metadata"${addAttribute(v.poster || void 0, "poster")} data-astro-cid-n7g4m3vo> <source${addAttribute(v.src, "src")} data-astro-cid-n7g4m3vo> </video>` : v.type === "iframe" && v.src ? renderTemplate`<iframe class="h-full w-full"${addAttribute(v.src, "src")}${addAttribute(v.label, "title")} loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen data-astro-cid-n7g4m3vo></iframe>` : renderTemplate`<div class="placeholder" data-astro-cid-n7g4m3vo> <div class="placeholder-inner" data-astro-cid-n7g4m3vo> <span class="placeholder-title" data-astro-cid-n7g4m3vo>Video coming soon</span> <span class="placeholder-sub" data-astro-cid-n7g4m3vo>Check back later!</span> </div> </div>`} </div>`)} </div> </section>`, inst.about_html && renderTemplate`<section class="prose-block" data-astro-cid-n7g4m3vo> <h2 class="font-display text-2xl md:text-3xl" data-astro-cid-n7g4m3vo>About this instrument</h2> <div class="opacity-80" data-astro-cid-n7g4m3vo>${unescapeHTML(inst.about_html)}</div> ${renderComponent($$result2, "Divider", $$Divider, { "data-astro-cid-n7g4m3vo": true })} <!-- ═══ Recommended Moods ═══ --> ${moods.length > 0 && renderTemplate`<section class="recommended-moods grid md:grid-cols-2 gap-6 items-center py-10" data-astro-cid-n7g4m3vo> <div class="space-y-5 order-1 md:order-2" data-astro-cid-n7g4m3vo> <h2 class="font-display text-2xl md:text-3xl mb-2" data-astro-cid-n7g4m3vo>
Recommended
<span class="moods-title" data-astro-cid-n7g4m3vo> <span class="m1" data-astro-cid-n7g4m3vo>M</span> <span class="m2" data-astro-cid-n7g4m3vo>o</span> <span class="m3" data-astro-cid-n7g4m3vo>o</span> <span class="m4" data-astro-cid-n7g4m3vo>d</span> <span class="m5" data-astro-cid-n7g4m3vo>s</span> </span>
for this instrument
</h2> ${inst.moods_intro && renderTemplate`<p class="opacity-80 text-base mb-4" data-astro-cid-n7g4m3vo>${inst.moods_intro}</p>`} <ul class="space-y-3" data-astro-cid-n7g4m3vo> ${moods.map((m) => renderTemplate`<li class="flex items-center justify-between rounded-xl px-3 py-2 frame" data-astro-cid-n7g4m3vo> <span class="font-medium" data-astro-cid-n7g4m3vo>${m.label}</span> <button type="button" class="opacity-70 hover:opacity-100 transition"${addAttribute(m.audio_file, "data-audio")}${addAttribute(`Play ${m.label}`, "aria-label")} data-astro-cid-n7g4m3vo>
▶︎
</button> </li>`)} </ul> </div> ${inst.image_url && renderTemplate`<figure class="rounded-xl overflow-hidden frame border border-black/40 shadow-soft order-2 md:order-1" data-astro-cid-n7g4m3vo> <img${addAttribute(inst.image_url, "src")}${addAttribute(inst.image_alt || inst.name, "alt")} class="object-cover w-full h-full aspect-[4/3]" loading="lazy" data-astro-cid-n7g4m3vo> </figure>`} </section>`} </section>`) })}`;
}, "C:/Users/Owner/tradscendence-site/src/pages/instruments/[slug].astro", void 0);
const $$file = "C:/Users/Owner/tradscendence-site/src/pages/instruments/[slug].astro";
const $$url = "/instruments/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
