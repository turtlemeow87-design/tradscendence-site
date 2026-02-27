import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_c7rZIilc.mjs';
import { manifest } from './manifest_QNr9euG3.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin/instruments.astro.mjs');
const _page3 = () => import('./pages/api/contact.json.astro.mjs');
const _page4 = () => import('./pages/api/health.astro.mjs');
const _page5 = () => import('./pages/api/instruments/featured.json.astro.mjs');
const _page6 = () => import('./pages/api/instruments/index.json.astro.mjs');
const _page7 = () => import('./pages/api/instruments/_slug_.json.astro.mjs');
const _page8 = () => import('./pages/blog.astro.mjs');
const _page9 = () => import('./pages/calendar.astro.mjs');
const _page10 = () => import('./pages/coming-soon.astro.mjs');
const _page11 = () => import('./pages/contact.astro.mjs');
const _page12 = () => import('./pages/instruments/_slug_.astro.mjs');
const _page13 = () => import('./pages/instruments.astro.mjs');
const _page14 = () => import('./pages/memories.astro.mjs');
const _page15 = () => import('./pages/mywishlist.astro.mjs');
const _page16 = () => import('./pages/store.astro.mjs');
const _page17 = () => import('./pages/thanks.astro.mjs');
const _page18 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin/instruments.astro", _page2],
    ["src/pages/api/contact.json.ts", _page3],
    ["src/pages/api/health.ts", _page4],
    ["src/pages/api/instruments/featured.json.ts", _page5],
    ["src/pages/api/instruments/index.json.ts", _page6],
    ["src/pages/api/instruments/[slug].json.ts", _page7],
    ["src/pages/blog/index.astro", _page8],
    ["src/pages/calendar/index.astro", _page9],
    ["src/pages/coming-soon.astro", _page10],
    ["src/pages/contact.astro", _page11],
    ["src/pages/instruments/[slug].astro", _page12],
    ["src/pages/instruments/index.astro", _page13],
    ["src/pages/memories.astro", _page14],
    ["src/pages/mywishlist.astro", _page15],
    ["src/pages/store/index.astro", _page16],
    ["src/pages/thanks.astro", _page17],
    ["src/pages/index.astro", _page18]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "93afa376-ba4d-4343-8fde-fdf795b3c907",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
