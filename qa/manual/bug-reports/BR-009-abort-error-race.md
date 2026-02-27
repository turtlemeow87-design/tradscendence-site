# Bug Report — BR-009

**Title:** AbortError race condition when rapidly switching between Featured Sound tracks on homepage  
**Reported by:** Hunter Eastland  
**Date:** 2026-02-27  
**Status:** Open  
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

When clicking rapidly between Featured Sound play buttons on the homepage, a race condition occurs where `pause()` is called on the first track while `play()` is still asynchronously starting on the second track. The result is that the second track fails to play and a warning is logged to the console. The behavior recovers correctly on a normal-speed retry.

---

## Steps to Reproduce

1. Navigate to `https://www.soundbeyondborders.com/` and scroll to the Featured Sounds section
2. Click ▶︎ on Baglama Saz
3. Immediately (within ~0.5 seconds) click ▶︎ on Arabic Oud
4. Observe: Baglama Saz stops but Arabic Oud does not play
5. Console shows: `play failed: AbortError: The play() request was interrupted by a call to pause()`
6. Click ▶︎ on Arabic Oud again at normal speed
7. Observe: Arabic Oud plays correctly on retry

---

## Expected Result

Switching between tracks at any speed should stop the first track and immediately begin the second, with no errors logged.

---

## Actual Result

Rapid switching causes the second track's `play()` promise to be rejected because `pause()` was called on the audio element before `play()` finished initializing. The second track is silently skipped. Console warning is logged.

---

## Screenshots

**BR-009-switch-playback-error.png** — DevTools Console showing the full error: `play failed: AbortError: The play() request was interrupted by a call to pause()` with a link to `https://goo.gl/LdLk22`. Also shows the favicon.ico 404 (separate issue — BR-008). Captured during TC-004-03 execution on 2026-02-27.

**BR-009-switch-playback-error-js.png** — DevTools Sources panel showing the originating line of code: `audio.play().catch((err) => console.warn('play failed:', err))` at line 56 of the compiled index file. Confirms the error originates from the homepage Featured Sounds audio handler.

**BR-009-screenshot-3.png** — DevTools Network request blocking panel showing `www.soundbeyondborders.com/media/baglamasaz1.m4a` successfully added to the block list. Captured during TC-004-06 execution — included here for context as it was taken in the same DevTools session.

---

## Root Cause

The `play()` method on an HTML Audio element returns a Promise. If `pause()` is called before that Promise resolves, the browser throws an AbortError. The current code does not wait for `play()` to resolve before allowing `pause()` to be called on the same element, creating a race condition under rapid user interaction.

---

## Proposed Fix

At minimum, suppress the AbortError specifically rather than catching all errors silently. This cleans up console noise without changing visible behavior:

```javascript
async function play(src) {
  stopCurrent();
  const a = getPlayer(src);
  current = a;
  a.currentTime = 0;
  a.volume = 0.9;
  try {
    await a.play();
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.warn('play failed:', err);
    }
    // AbortError is expected on rapid switching — suppress silently
  }
}
```

For a more complete fix, add a small debounce on the click handler to prevent rapid sequential calls from colliding.

---

## Impact

- Only triggered by unusually rapid clicking between tracks
- No crash, no data loss, no persistent broken state
- Recovers correctly on normal-speed retry
- Console noise may cause confusion during future testing sessions

---

## Linked Test Case

TC-004-03 — Only One Audio Plays at a Time  
**Test Session:** TS-004 Session 001