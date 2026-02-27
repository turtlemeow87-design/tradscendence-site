import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_CfHE34sL.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DPR2iDcX.mjs';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

const $$ComingSoon = createComponent(($$result, $$props, $$slots) => {
  const email = "HunterEast.Musiq@gmail.com";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Coming Soon \u2014 Tradscendence" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="mx-auto max-w-3xl px-4 py-16 space-y-8 text-center"> <header class="space-y-3"> <h1 class="font-display text-4xl">Coming Soon!</h1> <p class="opacity-80">
This page is brewing. I’m tuning details and polishing audio—check back soon.
</p> </header> <!-- Decorative card --> <div class="rounded-2xl border border-gold/40 bg-gold/10 p-6 frame space-y-3"> <p>
In the meantime, you can explore other parts of the site or reach out if you’re planning an event.
</p> <p class="text-sm opacity-80">
I’m available for intimate events: private weddings, ceremonies, small gatherings, funerals, and studio sessions.
</p> </div> <!-- Optional notify form (Formspree) --> <form action="https://formspree.io/f/mldwoalq" method="POST" class="mx-auto grid gap-3 sm:grid-cols-[1fr_auto] max-w-md"> <label class="sr-only" for="notify-email">Email</label> <input id="notify-email" type="email" name="email" required autocomplete="email" placeholder="Get a quick note when this page goes live" class="bg-ebony/60 text-ivory frame rounded-xl px-3 py-2 border border-[var(--accent-bronze)] placeholder:opacity-60 sm:rounded-r-none"> <input type="hidden" name="formName" value="Coming Soon Notify"> <button type="submit" class="rounded-xl sm:rounded-l-none px-4 py-2 bg-gold text-ivory hover:bg-golddark hover:text-rosewood font-semibold frame">
Notify Me
</button> </form> <!-- Helpful links --> <nav class="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2"> <a class="gothic-link" href="/">Return Home</a> <a class="gothic-link" href="/contact">Contact / Booking</a> <a class="gothic-link"${addAttribute(`mailto:${email}`, "href")}>Email Me Directly</a> </nav> <!-- Soft divider --> <div class="mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-[var(--accent-bronze)]/60 to-transparent rounded-full"></div> <!-- Subtle reassurance footer --> <p class="text-sm opacity-70">
Quality over haste—thanks for your patience.
</p> </section>   ` })}`;
}, "C:/Users/Owner/tradscendence-site/src/pages/coming-soon.astro", void 0);

const $$file = "C:/Users/Owner/tradscendence-site/src/pages/coming-soon.astro";
const $$url = "/coming-soon";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ComingSoon,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
