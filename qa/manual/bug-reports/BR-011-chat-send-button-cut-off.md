# Bug Report — BR-011

**Title:** Chat send button partially cut off on mobile — right side hidden by container edge  
**Reported by:** Hunter Eastland  
**Date Filed:** 2026-02-28  
**Date Resolved:** 2026-02-28  
**Status:** ✅ Resolved — Verified  
**Severity:** Low  
**Priority:** Low

---

## Environment

- **URL:** https://www.soundbeyondborders.com/ (InstrumentChat component)
- **Browser:** Samsung Internet / Chrome Mobile
- **Device:** Samsung Galaxy S23 Ultra (Android)
- **Build:** Production — live site as of 2026-02-28

---

## Description

The send button in the InstrumentChat component's input row is partially cut off on mobile. About half the button is hidden behind the right edge of the chat container, so only the left half of the arrow icon is visible. The button still works if tapped in roughly the right area, but it looks broken and the tap target feels unreliable.

---

## Steps to Reproduce

1. Navigate to the home page on an Android device
2. Scroll down to the InstrumentChat component
3. Look at the input row at the bottom of the chat area
4. Observe the send button on the right side of the input field

---

## Expected Behavior

Send button is fully visible within the chat container.

---

## Actual Behavior

Send button is approximately half-hidden behind the right edge of the container. Only the left portion of the icon is visible.

---

## Screenshots

**BR-011-screenshot-1.jpg** — Samsung S23 Ultra showing the chat input row with the send button visibly cut off on the right side of the container.

---

## Fix Applied

Resolved by the development team.

**Files changed:** `src/components/InstrumentChat.astro`

---

## Verification Steps

1. Navigate to the home page on Android
2. Scroll to the InstrumentChat component
3. Confirm send button is fully visible within the container
4. Tap send with a test message — confirm it responds correctly

**Verified on:** Samsung Galaxy S23 Ultra

**Verified in:** TS-006

---

## Linked Test Case

TC-006-02