# Bug Report — BR-007

**Title:** Hover-to-play audio silently fails on first page load before any click interaction  
**Reported by:** Hunter Eastland  
**Date Filed:** 2026-02-27  
**Date Resolved:** 2026-02-27  
**Status:** ✅ Resolved — Verified  
**Severity:** Medium  
**Priority:** Medium

---

## Environment

- **URL:** https://www.soundbeyondborders.com/instruments/
- **Browser:** Chrome (Desktop)
- **Device:** Desktop PC
- **Build:** Production — live site as of 2026-02-27

---

## Description

On the `/instruments` page, hovering over any ▶︎ play button on first page load produced no audio and no visible feedback. After the user clicked any play button at least once, hover-to-play began working normally for the rest of the session.

---

## Steps to Reproduce (Original)

1. Open a fresh browser tab and navigate to `https://www.soundbeyondborders.com/instruments/`
2. Without clicking anywhere on the page, hover the mouse over any ▶︎ button
3. Observe: no audio plays, no feedback given
4. Click any ▶︎ button once
5. Hover again — now works normally

---

## Root Cause

Modern browsers enforce an autoplay policy that blocks audio from playing until the user has made at least one deliberate click/tap on the page. The hover handler called `audio.play()` but the browser rejected it silently. The `catch {}` block swallowed the rejection with no user feedback.

---

## Fix Applied

Added a subtle toast notification to the `/instruments` page (desktop only) reading "👆 Click anywhere to enable audio previews." The toast:
- Only renders on hover-capable devices via `window.matchMedia('(hover: hover)')`
- Fades in on page load
- Fades out and removes itself on first click anywhere on the page
- That first click simultaneously satisfies the browser autoplay gesture requirement, unlocking hover-to-play for the rest of the session

**Files changed:** `src/pages/instruments/index.astro`

---

## Verification Steps

1. Hard refresh `/instruments` on desktop
2. Confirm toast appears at bottom of page
3. Hover over any ▶︎ button — no audio yet (expected, no click has occurred)
4. Click anywhere on page — toast fades out
5. Hover over any ▶︎ button — audio plays correctly
6. Confirm toast does not appear on mobile

**Verified in:** TS-004 Session 004

---

## Linked Test Case

TC-004-01 — Hover Triggers Audio Playback (Desktop)  
**Test Sessions:** TS-004 Session 001 (fail), Session 004 (pass)