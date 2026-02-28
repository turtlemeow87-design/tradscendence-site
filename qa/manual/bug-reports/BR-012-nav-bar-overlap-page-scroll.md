# Bug Report — BR-012

**Title:** Page scroll lands at bottom of bot response on mobile — nav bar overlaps chat header, first line not readable  
**Reported by:** Hunter Eastland  
**Date Filed:** 2026-02-28  
**Date Resolved:** 2026-02-28  
**Status:** ✅ Resolved — Verified  
**Severity:** Medium  
**Priority:** High

---

## Environment

- **URL:** https://www.soundbeyondborders.com/ (InstrumentChat component)
- **Browser:** Samsung Internet / Chrome Mobile
- **Device:** Samsung Galaxy S23 Ultra (Android)
- **Build:** Production — live site as of 2026-02-28

---

## Description

After a bot response arrives in the InstrumentChat component on Android, the page auto-scrolls but lands in the wrong position. The nav bar overlaps the top of the chat area, hiding the chat header and the first line of the response. The message area is also scrolled to the bottom of the response rather than the top, so the user has to manually scroll up to read from the beginning. On longer responses this means the first several lines are entirely missed unless the user knows to scroll up.

---

## Steps to Reproduce

1. Navigate to the home page on an Android device
2. Scroll down to the InstrumentChat component
3. Tap the input field and type a question likely to generate a longer response (e.g. "Tell me about the Baglama Saz in detail")
4. Tap send
5. Wait for the bot response to arrive
6. Observe where the page lands after the response appears

---

## Expected Behavior

Page scrolls so the chat header is visible just below the nav bar and the first line of the bot response is immediately readable without any manual scrolling.

---

## Actual Behavior

Page scrolls but lands with the nav bar covering the top of the chat area. The message area is positioned at the bottom of the response rather than the top. The first line of the response is not visible — user must scroll up manually to read from the beginning.

---

## Screenshots

**TC-006-scroll-correct.jpg** — Samsung S23 Ultra showing the correct scroll position after fix: chat header visible below nav bar, first line of the response readable without manual scrolling. Captured during TC-006-04 verification.

---

## Fix Applied

Resolved by the development team. Required two rounds of adjustment before scroll position was landing correctly.

**Files changed:** `src/components/InstrumentChat.astro`

---

## Verification Steps

1. Navigate to the home page on Android
2. Send a question likely to generate a longer response
3. Confirm page scrolls so the chat header is visible below the nav bar
4. Confirm the first line of the response is readable without manual scrolling
5. Repeat with a short response to confirm scroll behavior is consistent

**Verified on:** Samsung Galaxy S23 Ultra

**Verified in:** TS-006

---

## Linked Test Case

TC-006-04