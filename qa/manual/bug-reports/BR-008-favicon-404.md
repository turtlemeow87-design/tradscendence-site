# Bug Report — BR-008

**Title:** favicon.ico returns 404 on all pages  
**Reported by:** Hunter Eastland  
**Date:** 2026-02-27  
**Status:** Open  
**Severity:** Low  
**Priority:** Low

---

## Environment

- **URL:** https://www.soundbeyondborders.com/ (reproduced on all pages)
- **Browser:** Chrome (Desktop)
- **Device:** Desktop PC
- **Build:** Production — live site as of 2026-02-27

---

## Description

Every page load generates a 404 error in the browser console for `favicon.ico`. The site has a `favicon.svg` in the public directory but does not serve a `favicon.ico` file. Browsers automatically request `favicon.ico` by convention regardless of whether one is declared in the HTML, causing this error on every page.

---

## Steps to Reproduce

1. Navigate to any page on `https://www.soundbeyondborders.com/`
2. Open DevTools → Console
3. Observe: `GET https://www.soundbeyondborders.com/favicon.ico 404 (Not Found)`

---

## Expected Result

No 404 errors in the console related to favicon. The browser tab icon displays correctly.

---

## Actual Result

Console logs a 404 on every page load:  
`Failed to load resource: the server responded with a status of 404 () — favicon.ico`

The SVG favicon still displays correctly in the browser tab (Chrome falls back to the SVG), but the 404 is logged regardless.

---

## Screenshots

**BR-008-favicon-404.png** — DevTools Console showing the favicon.ico 404 error (`GET https://www.soundbeyondborders.com/favicon.ico 404 (Not Found)`) visible at top and bottom of console output. Captured during TC-004-01 execution on 2026-02-27.

---

## Root Cause

The site declares `favicon.svg` but does not include a `favicon.ico` fallback. Browsers request `favicon.ico` automatically by convention even when an SVG is declared. No `.ico` file exists at the site root to satisfy this request.

---

## Proposed Fix

Add a `favicon.ico` file to the `/public` directory. Can be generated from the existing logo using any free online converter (e.g. favicon.io) — a 32x32 or 48x48 `.ico` export is sufficient. No code changes required.

Optionally also add the following to `BaseLayout.astro` `<head>` for explicit browser guidance:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

---

## Impact

- Console noise on every page load — minor but clutters DevTools during testing
- No user-facing impact — SVG favicon still displays correctly in Chrome
- Low priority but quick fix (~5 minutes)

---

## Linked Test Case

Discovered during TC-004-01 execution — not directly related to audio playback.  
**Test Session:** TS-004 Session 001