import { c as createComponent, m as maybeRenderHead, f as renderScript, b as addAttribute, a as renderTemplate, e as createAstro, r as renderComponent, o as renderSlot, p as renderHead } from './astro/server_CfHE34sL.mjs';
import 'kleur/colors';
/* empty css                         */
import 'clsx';

const $$Nav = createComponent(($$result, $$props, $$slots) => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact / Booking" },
    { href: "/instruments", label: "My Instruments" },
    { href: "/memories", label: "Memories" },
    { href: "/blog", label: "Blog", future: true },
    { href: "/calendar", label: "Calendar", future: true },
    { href: "/store", label: "Store", future: true }
  ];
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-charcoal/70 border-b border-black/40"> <div class="mx-auto max-w-6xl px-4 w-full overflow-x-clip"> <div class="flex justify-between min-w-0 py-3 sm:py-4"> <!-- Logo and handle stacked --> <div class="flex flex-col items-end gap-1"> <a href="/" class="block h-[88px] sm:h-[96px] relative group"> <div class="absolute inset-0 rounded-[22%] blur-md bg-gradient-to-r from-charcoal via-transparent to-charcoal opacity-30 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"></div> <img src="/media/logo4.png" alt="HE MUSIQ – HunterEastlandMusiq logo" class="relative h-full w-auto object-contain rounded-[22%] shadow-[0_2px_8px_rgba(0,0,0,0.35)]" loading="eager"> </a> <a href="/#footer" class="text-[0.83rem] sm:text-sm text-rosewood hover:text-gold font-medium italic tracking-wide pl-[2px] drop-shadow-[0_0_0.5px_ivory]">
@Tradscendence
</a> </div> <!-- Desktop nav --> <nav class="self-start mt-[2px] p-[6px] hidden md:flex gap-6 border bg-gradient-to-r from-rosewood via-gold/50 to-cedar border-ivory/50 rounded-md"> ${links.filter((l) => !l.future).map((l) => renderTemplate`<a class="gothic-link text-ivory hover:text-rosewood"${addAttribute(l.href, "href")}>${l.label}</a>`)} </nav> <!-- Mobile menu button --> <button id="menuBtn" class="md:hidden relative shrink-0 ml-2 mr-1 size-12 grid place-items-center rounded-tr-2xl rounded-br-2xl rounded-tl-2xl 
               border-t border-r border-b border-gold/60 
               bg-[linear-gradient(to_bottom,_rgba(255,255,255,.06),_rgba(0,0,0,.35))] 
               backdrop-blur-sm 
               shadow-[0_6px_16px_rgba(0,0,0,.45)] 
               [box-shadow:inset_0_1px_0_rgba(255,255,255,.18),inset_0_-1px_0_rgba(0,0,0,.35)] 
               ring-1 ring-rosewood/30 
               text-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal 
               data-[open=true]:ring-rosewood/60 data-[open=true]:shadow-[0_8px_20px_rgba(194,164,95,.35)]" aria-label="Open Menu" aria-expanded="false" aria-controls="mobileMenu" title="Menu"> <span class="pointer-events-none absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent"></span> <svg class="h-6 w-6 drop-shadow-sm transition-transform duration-200 ease-out data-[open=true]:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"> <path d="M4 7h16" class="opacity-95"></path> <path d="M4 12h16" class="opacity-95"></path> <path d="M8 17h12" class="opacity-95"></path> </svg> <span class="pointer-events-none absolute inset-0 rounded-tr-2xl rounded-br-2xl rounded-tl-2xl ring-2 ring-transparent data-[open=true]:ring-gold/40"></span> </button> </div> <!-- Mobile dropdown --> <div id="mobileMenu" class="md:hidden hidden pb-3"> <div class="flex flex-col gap-3 bg-charcoal/95 p-4 rounded-xl shadow-lg"> ${links.filter((l) => !l.future).map((l) => renderTemplate`<a class="gothic-link text-ivory"${addAttribute(l.href, "href")}>${l.label}</a>`)} </div> </div> </div> </header> ${renderScript($$result, "C:/Users/Owner/tradscendence-site/src/components/Nav.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Owner/tradscendence-site/src/components/Nav.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer id="footer" style="background-color: color-mix(in oklab, var(--ivory) 15%, transparent);" class="mt-16 border-t border-black/40"> <div class="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3"> <div> <div class="font-display text-xl">HunterEastlandMusiq</div> <div class="text-sm opacity-80">@Tradscendence</div> <div class="mt-4 text-sm opacity-80">Sound beyond borders • Transcend the traditional</div> </div> <nav class="grid grid-cols-2 gap-2 text-sm"> <a class="gothic-link" href="/">Home</a> <a class="gothic-link" href="/about">About</a> <a class="gothic-link" href="/contact">Contact / Booking</a> <a class="gothic-link" href="/instruments">My Instruments</a> <a class="gothic-link" href="/memories">Memories</a> <a class="gothic-link" href="/blog">Blog</a> <a class="gothic-link" href="/calendar">Calendar</a> <a class="gothic-link" href="/store">Store</a> </nav> <div class="text-sm"> <div class="font-semibold mb-2">Social</div> <div class="flex gap-4 flex-wrap"> <a class="gothic-link" href="https://www.facebook.com/hunter.eastland.2025" aria-label="Facebook">Facebook</a> <span class="opacity-40 cursor-not-allowed" title="Coming soon">Instagram</span> <a class="gothic-link" href="https://www.tiktok.com/@tradscendence" aria-label="TikTok">TikTok</a> <a class="gothic-link" href="https://www.youtube.com/@tradscendence" aria-label="YouTube">YouTube</a> </div> <div class="mt-6 opacity-70">© ${year} Hunter Eastland — All rights reserved.</div> </div> </div> </footer>`;
}, "C:/Users/Owner/tradscendence-site/src/components/Footer.astro", void 0);

const $$StickyBookMe = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Floating "Book me" button -->${maybeRenderHead()}<div class="fixed right-4 bottom-4 md:bottom-auto md:top-4 z-50"> <button id="open-book" class="rounded-2xl shadow-soft px-4 py-2 font-semibold bg-gold text-ivory hover:bg-golddark hover:text-rosewood focus:outline-none frame">
Book me
</button> </div> <!-- Quick-book dialog --> <dialog id="quick-book" class="rounded-2xl p-0 backdrop:bg-black/60"> <form id="quick-book-form" class="relative p-5 space-y-4 bg-neutral-900 text-neutral-100 rounded-2xl"> <!-- Top-right X close --> <button type="button" id="close-book" aria-label="Close" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center">
&times;
</button> <h2 class="text-xl font-semibold">Quick booking</h2> <!-- Notes above the mini form --> <div class="rounded-xl border border-gold/40 bg-gold/10 p-3 text-sm leading-relaxed frame"> <p><strong>I require booking inquiries to be at minimum one month out from the date of your event!</strong></p> <p class="mt-1"><strong>I'm available for intimate events: proposals, private weddings, other ceremonies, small gatherings, funerals, and studio sessions.</strong></p> </div> <label class="block"> <span class="text-sm">Your name *</span> <input name="name" required class="w-full mt-1 rounded-xl bg-black/40 p-2 border border-[var(--accent-bronze)]"> </label> <label class="block"> <span class="text-sm">Email *</span> <input name="email" type="email" required class="w-full mt-1 rounded-xl bg-black/40 p-2 border border-[var(--accent-bronze)]"> </label> <label class="block"> <span class="text-sm">Location (city/venue) *</span> <input name="location" required class="w-full mt-1 rounded-xl bg-black/40 p-2 border border-[var(--accent-bronze)]" placeholder="Richmond, VA"> </label> <label class="block"> <span class="text-sm">Event date (If Applicable)</span> <input name="date" type="date" class="w-full mt-1 rounded-xl bg-black/40 p-2 border border-[var(--accent-bronze)]"> </label> <label class="block"> <span class="text-sm">Message *</span> <textarea name="message" required rows="4" class="w-full mt-1 rounded-xl bg-black/40 p-2 border border-[var(--accent-bronze)]"></textarea> </label> <input type="hidden" name="formName" value="Quick booking"> <!-- Status message --> <div id="quick-status" class="hidden rounded-xl p-3 text-sm"></div> <div class="flex items-center justify-between gap-3"> <a href="/contact" class="rounded-xl px-4 py-2 bg-neutral-700 text-neutral-100 frame">Full Contact Page</a> <button type="submit" id="quick-submit-btn" class="rounded-xl px-4 py-2 bg-gold text-ivory hover:bg-golddark hover:text-rosewood font-semibold frame">
Send
</button> </div> </form> </dialog> ${renderScript($$result, "C:/Users/Owner/tradscendence-site/src/components/StickyBookMe.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Owner/tradscendence-site/src/components/StickyBookMe.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "Tradscendence",
    description = "Sound beyond borders",
    canonical,
    hideHeader = false
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>', '</title><meta name="description"', ">", '<!-- Google tag (gtag.js) --><script async src="https://www.googletagmanager.com/gtag/js?id=G-WKHBP3PKLL"><\/script>', "", '</head> <body class="min-h-screen flex flex-col"> ', " ", ' <main class="page-enter flex-1"> ', " </main> ", " </body></html>"])), title, addAttribute(description, "content"), canonical && renderTemplate`<link rel="canonical"${addAttribute(canonical, "href")}>`, renderScript($$result, "C:/Users/Owner/tradscendence-site/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts"), renderHead(), renderComponent($$result, "StickyBookMe", $$StickyBookMe, {}), !hideHeader && renderTemplate`${renderComponent($$result, "Nav", $$Nav, {})}`, renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "C:/Users/Owner/tradscendence-site/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
