import { c as createComponent, e as createAstro, m as maybeRenderHead, r as renderComponent, b as addAttribute, a as renderTemplate, f as renderScript } from '../chunks/astro/server_CfHE34sL.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DPR2iDcX.mjs';
import { $ as $$Divider } from '../chunks/Divider_DKHzv4fB.mjs';
import '../chunks/index_CR4ZvYMV.mjs';
import { $ as $$Image } from '../chunks/_astro_assets_DkQ3qVem.mjs';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$FeaturedInstrumentCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FeaturedInstrumentCard;
  const { title, imgSrc, audioSrc, href = "/instruments" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="js-teaser-card cursor-pointer rounded-xl overflow-hidden frame shadow-soft"> <div class="relative"> ${renderComponent($$result, "Image", $$Image, { "src": imgSrc, "alt": title, "width": 600, "height": 192, "class": "w-full h-48 object-cover", "loading": "lazy", "format": "webp", "quality": 80 })} <span class="absolute top-2 right-2 play-icon bg-black/50 text-white text-sm px-2 py-1 rounded">▶︎</span> </div> <div class="p-3 font-display text-lg">${title}</div> <audio class="teaser hidden" preload="none"${addAttribute(audioSrc, "src")}></audio> </div>`;
}, "C:/Users/Owner/tradscendence-site/src/components/FeaturedInstrumentCard.astro", void 0);

const $$Astro = createAstro();
const $$YouTubeFacade = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$YouTubeFacade;
  const { videoId, siParam, title, isShort = false, class: className = "" } = Astro2.props;
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const thumbnailFallback = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const siQuery = siParam ? `si=${siParam}&` : "";
  const embedUrl = `https://www.youtube.com/embed/${videoId}?${siQuery}rel=0&autoplay=1`;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["yt-facade", className], "class:list")}${addAttribute(embedUrl, "data-embed")}${addAttribute(title, "data-title")} role="button" tabindex="0"${addAttribute(`Play video: ${title}`, "aria-label")} data-astro-cid-qtly7il3> <img${addAttribute(thumbnailUrl, "src")}${addAttribute(title, "alt")} width="1280"${addAttribute(isShort ? 2275 : 720, "height")} loading="lazy" decoding="async"${addAttribute(`this.onerror=null;this.src='${thumbnailFallback}'`, "onerror")} data-astro-cid-qtly7il3> <!-- YouTube-style play button --> <div class="yt-play-btn" aria-hidden="true" data-astro-cid-qtly7il3> <svg width="68" height="48" viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg" data-astro-cid-qtly7il3> <path d="M66.5 7.5C65.7 4.7 63.5 2.5 60.7 1.7 55.3.2 34 .2 34 .2S12.7.2 7.3 1.7C4.5 2.5 2.3 4.7 1.5 7.5.2 13 .2 24 .2 24s0 11 1.3 16.5c.8 2.8 3 5 5.8 5.8C12.7 47.8 34 47.8 34 47.8s21.3 0 26.7-1.5c2.8-.8 5-3 5.8-5.8C67.8 35 67.8 24 67.8 24s0-11-1.3-16.5z" fill="#FF0000" data-astro-cid-qtly7il3></path> <path d="M27 34l18-10-18-10v20z" fill="white" data-astro-cid-qtly7il3></path> </svg> </div> </div>  ${renderScript($$result, "C:/Users/Owner/tradscendence-site/src/components/YouTubeFacade.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Owner/tradscendence-site/src/components/YouTubeFacade.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const title = "Hunter Eastland / Tradscendence \u2014 World & Folk Multi-Instrumentalist | Sound Beyond Borders";
  const description = "World/folk multi-instrumentalist in Richmond, VA. Book for private/intimate events, and studio sessions. Explore through videos and sound teasers. Surbahar, Arabic Oud, Esraj, Duduk, Azeri Tar, Turkish Baglama Saz, and more!";
  const LATEST_YT = {
    id: "OUpYRKzTAhM",
    si: "Vh8olflrhQvMtgcs",
    isShort: false,
    title: "Instrument: Turkish C\xFCmb\xFC\u015F Oud"
  };
  const SECOND_YT = {
    id: "1p_zNEC1FY8",
    si: "Tcx8T5XA-lamzTlU",
    isShort: false,
    title: 'This is the first and only music video that I recorded and produced entirely by myself a couple years ago with the goal of composing the most "unlikely" instruments together in one place.  Trying my best to convey a message about relativity through sound, but only a very small portion of the internet noticed it.  Anyway, Enjoy!'
  };
  const watchUrl = `https://youtu.be/${LATEST_YT.id}`;
  const watchUrl2 = `https://youtu.be/${SECOND_YT.id}`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "canonical": "https://www.soundbeyondborders.com/", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", '<section class="mx-auto max-w-6xl px-4 pt-3 sm:pt-10" data-astro-cid-j7pv25f6> <div class="flex flex-col sm:items-center sm:text-center" data-astro-cid-j7pv25f6> <h1 class="font-display text-[9vw] sm:text-5xl md:text-6xl leading-[1.05] opacity-75 bg-gradient-to-r from-black via-black/85 to-transparent rounded-md bg-clip-text text-transparent drop-shadow-[0_0_1px_ivory]" data-astro-cid-j7pv25f6>\n~<span class="font-extrabold text-[1.05em]" data-astro-cid-j7pv25f6>Sound</span> <span class="text-rosewood/70" data-astro-cid-j7pv25f6>Beyond</span> Borders~\n</h1> <p class="mt-1 sm:mt-2 text-base sm:text-lg opacity-60 bg-gradient-to-r from-rosewood via-rosewood/10 to-transparent rounded-md max-w-[42ch]" data-astro-cid-j7pv25f6> <a href="#transcend-video" class="outline-none no-underline hover:opacity-80 focus:opacity-80" title="Jump to the &quot;Transcend the Traditional&quot; video" data-astro-cid-j7pv25f6>\nTranscend the traditional.\n</a> </p> </div> </section> ', `  <section class="mx-auto max-w-6xl px-4" data-astro-cid-j7pv25f6> <figure class="relative rounded-2xl overflow-hidden frame shadow-soft" data-astro-cid-j7pv25f6> <!--
        Image component converts to WebP at build time and adds proper width/height
        to prevent layout shift (CLS). Dimensions match the display size at max viewport.
        fetchpriority="high" tells the browser to load this immediately (it's above the fold).
      --> `, ' <div class="hero-fade-overlay" data-astro-cid-j7pv25f6></div> <figcaption class="relative p-3 sm:p-4 text-xs sm:text-sm bg-gradient-to-r from-ebony via-ebony to-transparent" data-astro-cid-j7pv25f6> <div class="font-display" data-astro-cid-j7pv25f6>What is sound beyond borders?</div> <div class="opacity-80" data-astro-cid-j7pv25f6>Music as a bridge between cultures, not a separation.</div> </figcaption> </figure> </section>  ', `  <section class="mx-auto max-w-6xl px-4 space-y-6 sm:space-y-8" data-astro-cid-j7pv25f6> <h2 class="font-display text-xl sm:text-2xl" data-astro-cid-j7pv25f6>About my approach</h2> <div class="grid sm:grid-cols-2 gap-6 sm:gap-8 items-center" data-astro-cid-j7pv25f6> <div class="space-y-4" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>
Every instrument has an origin story. Sometimes these stories are pretty well-documented, and other times we are left to fill in the blanks for ourselves. In fact, academic studies such as organology exist for that purpose. The same is true for the sound that comes out of those instruments. Ethnomusicology exists for that purpose. And as beautiful as it is to be able to discover and study all of the ways in which a particular sound, or musical framework (theory) relate to their culture or country of origin: what is equally as beautiful, to me, is to be able to take a particular sound, and explore how it can relate to anybody from any culture.
</p> </div> <div class="space-y-4" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>
Music is important for different people at different times in different ways. I'm available for intimate events: <b data-astro-cid-j7pv25f6>proposals, private weddings, other ceremonies, small gatherings, and yes, even funerals.</b>~
</p> <p data-astro-cid-j7pv25f6>I am based in <i data-astro-cid-j7pv25f6>Richmond, VA</i> (US), but willing to travel if travel expenses are covered.</p> <p data-astro-cid-j7pv25f6>
Working on a song/album and you want something different that isn't digital? I also take studio musician inquiries!
</p> </div> </div> <div class="space-y-4 pt-1" data-astro-cid-j7pv25f6> <p class="opacity-90 font-semibold text-[0.92rem]" data-astro-cid-j7pv25f6>
*All sound teasers and photos on this website are of my own making on my own instruments!! No special effects.*
</p> <div class="flex flex-col gap-2" data-astro-cid-j7pv25f6> <a href="/instruments" class="group gothic-link font-bold block drop-shadow-[0_0_2px_ivory]" data-astro-cid-j7pv25f6> <span class="inline-flex items-center gap-1" data-astro-cid-j7pv25f6>
Explore the instruments
<span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5" data-astro-cid-j7pv25f6>\u2192</span> </span> </a> <a href="/about" class="group gothic-link font-bold block drop-shadow-[0_0_2px_ivory]" data-astro-cid-j7pv25f6> <span class="inline-flex items-center gap-1" data-astro-cid-j7pv25f6>
More about me and my approach
<span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5" data-astro-cid-j7pv25f6>\u2192</span> </span> </a> <a href="#latest-video" class="group gothic-link font-bold block drop-shadow-[0_0_2px_ivory]" data-astro-cid-j7pv25f6> <span class="inline-flex items-center gap-1" data-astro-cid-j7pv25f6>
See my latest YouTube video!
<span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5" data-astro-cid-j7pv25f6>\u2193</span> </span> </a> </div> </div> `, ' <!-- 3 featured instruments with audio teasers --> <section class="mx-auto max-w-6xl px-4 pb-8" data-astro-cid-j7pv25f6> <h2 class="font-display text-xl sm:text-2xl mb-3 sm:mb-4" data-astro-cid-j7pv25f6>Featured sounds</h2> <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3" data-astro-cid-j7pv25f6> <div class="space-y-2" data-astro-cid-j7pv25f6> ', ' <a href="/instruments/Surbahar" class="gothic-link text-sm font-bold drop-shadow-[0_0_2px_ivory]" data-astro-cid-j7pv25f6>Explore more Surbahar \u2192</a> </div> <div class="space-y-2" data-astro-cid-j7pv25f6> ', ' <a href="/instruments/BaglamaSaz" class="gothic-link text-sm font-bold drop-shadow-[0_0_2px_ivory]" data-astro-cid-j7pv25f6>Explore more Baglama Saz \u2192</a> </div> <div class="space-y-2" data-astro-cid-j7pv25f6> ', ' <a href="/instruments/ArabicOud" class="gothic-link text-sm font-bold drop-shadow-[0_0_2px_ivory]" data-astro-cid-j7pv25f6>Explore more Arabic Oud \u2192</a> </div> </div> </section> ', ' <!-- First video \u2014 YouTube Facade replaces the <iframe> --> <section id="latest-video" class="mx-auto max-w-6xl px-4 pb-6 scroll-mt-24" data-astro-cid-j7pv25f6> <h2 class="font-display text-xl sm:text-2xl mb-3 sm:mb-4" data-astro-cid-j7pv25f6>My Latest Youtube Upload!</h2> <figure class="space-y-3" data-astro-cid-j7pv25f6> <div class="relative rounded-2xl overflow-hidden frame shadow-soft p-[2px] bg-gradient-to-r from-[#C2A45F] via-[#A8743D] to-[#6E2A2A]" data-astro-cid-j7pv25f6> <div', " data-astro-cid-j7pv25f6> <!--\n              YouTubeFacade goes here \u2014 same location as the old <iframe>.\n              The parent div already has aspect-video and overflow-hidden,\n              so the facade fills it exactly the same way the iframe did.\n            --> ", ' </div> </div> <figcaption class="text-sm opacity-80 flex flex-col sm:flex-row sm:items-center sm:gap-3" data-astro-cid-j7pv25f6> <span class="font-display" data-astro-cid-j7pv25f6>', "</span> <a", ' target="_blank" rel="noopener" class="gothic-link font-bold" data-astro-cid-j7pv25f6>Watch on YouTube \u2192</a> </figcaption> </figure> <div class="pt-4" data-astro-cid-j7pv25f6> <a href="/instruments/CumbusOud" class="group gothic-link font-bold inline-flex items-center gap-1 drop-shadow-[0_0_2px_ivory]" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>Explore this instrument more</span> <span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5" data-astro-cid-j7pv25f6>\u2192</span> </a> </div> </section> ', ' <!-- Second video \u2014 YouTube Facade --> <section id="transcend-video" class="mx-auto max-w-6xl px-4 pb-10 scroll-mt-24" data-astro-cid-j7pv25f6> <h2 class="font-display text-xl sm:text-2xl mb-3 sm:mb-4" data-astro-cid-j7pv25f6>Transcend The Traditional</h2> <figure class="space-y-3" data-astro-cid-j7pv25f6> <div class="relative rounded-[20px] overflow-hidden p-[5px] bg-gradient-to-r from-[#A07133] via-[#8D5A2C] to-[#6E2A2A] shadow-[0_0_28px_10px_rgba(141,90,44,0.22)]" data-astro-cid-j7pv25f6> <div class="absolute -inset-[2px] bg-[radial-gradient(circle_at_center,rgba(141,90,44,0.35)_0%,transparent_70%)] blur-[30px] opacity-60 pointer-events-none" data-astro-cid-j7pv25f6></div> <div class="absolute inset-0 bg-rosewood/15 mix-blend-multiply pointer-events-none" data-astro-cid-j7pv25f6></div> <div', " data-astro-cid-j7pv25f6> ", ' </div> </div> <figcaption class="text-sm opacity-80" data-astro-cid-j7pv25f6> <span class="font-display block" data-astro-cid-j7pv25f6>', "</span> <a", ` target="_blank" rel="noopener" class="gothic-link font-bold inline-block mt-2" data-astro-cid-j7pv25f6>
Watch on YouTube \u2192
</a> </figcaption> </figure> </section> <script>
      document.addEventListener('click', (e) => {
        const card = e.target.closest('.js-teaser-card');
        if (!card) return;
        const audio = card.querySelector('audio.teaser');
        if (!audio) return;
        document.querySelectorAll('audio.teaser').forEach((a) => {
          if (a !== audio) { try { a.pause(); a.currentTime = 0; } catch {} }
        });
        if (audio.paused) {
          audio.muted = false; audio.volume = 1;
          audio.play().catch((err) => console.warn('play failed:', err));
        } else { audio.pause(); }
      });

      const attachIconSync = (a) => {
        const card = a.closest('.js-teaser-card');
        const icon = card?.querySelector('.play-icon');
        if (!icon) return;
        a.addEventListener('play',  () => icon.textContent = '\u275A\u275A');
        a.addEventListener('pause', () => icon.textContent = '\u25B6\uFE0E');
        a.addEventListener('ended', () => { icon.textContent = '\u25B6\uFE0E'; a.currentTime = 0; });
      };
      document.querySelectorAll('audio.teaser').forEach(attachIconSync);
    <\/script>  <script>
      document.addEventListener("DOMContentLoaded", () => {
        const scrollOffset = 80;
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

        function smoothScroll(targetY, duration = 900) {
          const startY = window.scrollY;
          const distance = targetY - startY;
          let startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            window.scrollTo(0, startY + distance * eased);
            if (elapsed < duration) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }

        document.querySelectorAll('a[href^="#"]').forEach(link => {
          const href = link.getAttribute("href");
          const targetEl = document.querySelector(href);
          if (targetEl) {
            link.addEventListener("click", (e) => {
              e.preventDefault();
              const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - scrollOffset;
              smoothScroll(targetTop, 1800);
            });
          }
        });
      });
    <\/script> </section> `])), maybeRenderHead(), renderComponent($$result2, "Divider", $$Divider, { "data-astro-cid-j7pv25f6": true }), renderComponent($$result2, "Image", $$Image, { "src": "/media/hero-placeholder.jpg", "alt": "Hunter with instruments", "width": 1200, "height": 848, "format": "webp", "quality": 82, "class": "w-full h-[42vh] sm:h-[56vh] object-cover", "loading": "eager", "fetchpriority": "high", "data-astro-cid-j7pv25f6": true }), renderComponent($$result2, "Divider", $$Divider, { "data-astro-cid-j7pv25f6": true }), renderComponent($$result2, "Divider", $$Divider, { "data-astro-cid-j7pv25f6": true }), renderComponent($$result2, "FeaturedInstrumentCard", $$FeaturedInstrumentCard, { "title": "Surbahar", "imgSrc": "/media/inst-surbahar.jpg", "audioSrc": "/media/surbahar.m4a", "data-astro-cid-j7pv25f6": true }), renderComponent($$result2, "FeaturedInstrumentCard", $$FeaturedInstrumentCard, { "title": "Baglama Saz", "imgSrc": "/media/inst-baglamasaz.jpg", "audioSrc": "/media/baglamasaz1.m4a", "data-astro-cid-j7pv25f6": true }), renderComponent($$result2, "FeaturedInstrumentCard", $$FeaturedInstrumentCard, { "title": "Arabic Oud", "imgSrc": "/media/inst-arabicoud.jpg", "audioSrc": "/media/arabicoud.m4a", "data-astro-cid-j7pv25f6": true }), renderComponent($$result2, "Divider", $$Divider, { "data-astro-cid-j7pv25f6": true }), addAttribute(`relative w-full ${"aspect-video"} rounded-[14px] overflow-hidden`, "class"), renderComponent($$result2, "YouTubeFacade", $$YouTubeFacade, { "videoId": LATEST_YT.id, "siParam": LATEST_YT.si, "title": LATEST_YT.title, "isShort": LATEST_YT.isShort, "class": "absolute inset-0 rounded-[12px]", "data-astro-cid-j7pv25f6": true }), LATEST_YT.title, addAttribute(watchUrl, "href"), renderComponent($$result2, "Divider", $$Divider, { "data-astro-cid-j7pv25f6": true }), addAttribute(`relative w-full ${"aspect-video"} rounded-[16px] overflow-hidden`, "class"), renderComponent($$result2, "YouTubeFacade", $$YouTubeFacade, { "videoId": SECOND_YT.id, "siParam": SECOND_YT.si, "title": SECOND_YT.title, "isShort": SECOND_YT.isShort, "class": "absolute inset-0 rounded-[14px]", "data-astro-cid-j7pv25f6": true }), SECOND_YT.title, addAttribute(watchUrl2, "href")) })}`;
}, "C:/Users/Owner/tradscendence-site/src/pages/index.astro", void 0);

const $$file = "C:/Users/Owner/tradscendence-site/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
