import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CfHE34sL.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DPR2iDcX.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Coming Soon \u2014 Tradscendence" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="mx-auto max-w-3xl px-4 py-10 space-y-4"> <h1 class="font-display text-3xl">Coming Soon</h1> <p>Placeholder page. This section will be launched later.</p> </section> ` })}`;
}, "C:/Users/Owner/tradscendence-site/src/pages/calendar/index.astro", void 0);

const $$file = "C:/Users/Owner/tradscendence-site/src/pages/calendar/index.astro";
const $$url = "/calendar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
