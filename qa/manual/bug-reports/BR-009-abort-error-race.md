# Bug Report — BR-009

**Title:** AbortError race condition when rapidly switching between Featured Sound tracks on homepage  
**Reported by:** Hunter Eastland  
**Date Filed:** 2026-02-27  
**Date Resolved:** 2026-02-27  
**Status:** ✅ Resolved — Verified  
**Severity:** Low  
**Priority:** Low

---

## Environment

- **URL:** https://www.soundbeyondborders.com/ (Featured Sounds section)
- **Browser:** Chrome (Desktop)
- **Device:** Desktop PC
- **Build:** Production — live site as of 2026-02-27

---

## Description

When clicking rapidly between Featured Sound play buttons on the homepage, a race condition caused `pause()` to be called on the first track while `play()` was still asynchronously starting on the second. The second track failed to play and a warning was logged to the console. Recovered correctly on normal-speed retry.

---

## Steps to Reproduce (Original)

1. Navigate to `https://www.soundbeyondborders.com/` and scroll to Featured Sounds
2. Click ▶︎ on Baglama Saz
3. Immediately (~0.5 seconds) click ▶︎ on Arabic Oud
4. Observe: Baglama Saz stops but Arabic Oud does not play
5. Console shows: `play failed: AbortError: The play() request was interrupted by a call to pause()`

---

## Screenshots

**BR-009-screenshot-1.png** — DevTools Console showing the full AbortError: `play failed: AbortError: The play() request was interrupted by a call to pause()` with link to `https://goo.gl/LdLk22`. Also shows favicon.ico 404 (separate issue — BR-008). Captured during TC-004-03 execution on 2026-02-27.

**BR-009-screenshot-2.png** — DevTools Sources panel showing the originating line: `audio.play().catch((err) => console.warn('play failed:', err))` at line 56 of the compiled index file. Confirms error originates from the homepage Featured Sounds audio handler.

**BR-009-screenshot-3.png** — DevTools Network request blocking panel showing `www.soundbeyondborders.com/media/baglamasaz1.m4a` added to block list. Captured in the same DevTools session during TC-004-06 execution — included for context.

---

## Root Cause

The `play()` method on HTMLAudioElement returns a Promise. If `pause()` is called before that Promise resolves, the browser throws an AbortError. The original catch block used `console.warn('play failed:', err)` which surfaced all errors including expected AbortErrors from rapid switching.

---

## Fix Applied

Updated the catch block in `src/pages/index.astro` to suppress AbortError specifically, while still surfacing any other genuine errors:

**Before:**
```javascript
audio.play().catch((err) => console.warn('play failed:', err));
```

**After:**
```javascript
audio.play().catch((err) => {
  if (err.name !== 'AbortError') console.warn('play failed:', err);
  // AbortError is expected on rapid switching — suppress silently
});
```

**Files changed:** `src/pages/index.astro`

---

## Verification Steps

1. Navigate to `https://www.soundbeyondborders.com/` and scroll to Featured Sounds
2. Open DevTools Console
3. Click rapidly between Baglama Saz and Arabic Oud several times
4. Confirm no AbortError appears in console
5. Confirm audio behavior is otherwise unchanged — switching at normal speed still works correctly

**Verified in:** TS-004 Session 004

---

## Linked Test Case

TC-004-03 — Only One Audio Plays at a Time  
**Test Sessions:** TS-004 Session 001 (partial fail), Session 004 (pass)