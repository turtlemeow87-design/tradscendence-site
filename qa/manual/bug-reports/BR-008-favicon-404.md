# Bug Report — BR-008

**Title:** favicon.ico returns 404 on all pages  
**Reported by:** Hunter Eastland  
**Date Filed:** 2026-02-27  
**Date Resolved:** 2026-02-27  
**Status:** ✅ Resolved — Verified  
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

Every page load generated a 404 error in the browser console for `favicon.ico`. The site had a `favicon.svg` in the public directory but no `favicon.ico` file. Browsers automatically request `favicon.ico` by convention regardless of what is declared in the HTML.

---

## Steps to Reproduce (Original)

1. Navigate to any page on `https://www.soundbeyondborders.com/`
2. Open DevTools → Console
3. Observe: `GET https://www.soundbeyondborders.com/favicon.ico 404 (Not Found)`

---

## Screenshots

**BR-008-screenshot-1.png** — DevTools Console showing the favicon.ico 404 error appearing at top and bottom of console output. Captured during TC-004-01 execution on 2026-02-27.

---

## Root Cause

No `favicon.ico` file existed at the site root. Browsers request it automatically by convention even when an SVG favicon is declared.

---

## Fix Applied

Two-part fix:

1. Generated a `favicon.ico` file (32x32) from the existing logo using [favicon.io](https://favicon.io) and added it to `/public/favicon.ico`

2. Added explicit favicon link tags to `BaseLayout.astro` `<head>`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

The SVG tag is the modern preferred format; the `.ico` tag is the fallback for browsers that request it by convention.

**Files changed:** `src/layouts/BaseLayout.astro`, `public/favicon.ico` (new file)

---

## Verification Steps

1. Hard refresh any page on the live site
2. Open DevTools → Console
3. Confirm no favicon.ico 404 error appears
4. Confirm browser tab displays the correct icon

**Verified in:** TS-004 Session 004

---

## Linked Test Case

Discovered during TC-004-01 execution — not directly related to audio playback.  
**Test Session:** TS-004 Session 001