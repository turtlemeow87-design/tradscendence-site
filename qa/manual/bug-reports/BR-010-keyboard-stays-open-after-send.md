# Bug Report — BR-010

**Title:** Soft keyboard stays open after sending a chat message on Android, and reopens when the response arrives  
**Reported by:** Hunter Eastland  
**Date Filed:** 2026-02-28  
**Date Resolved:** 2026-02-28  
**Status:** ✅ Resolved — Verified  
**Severity:** Medium  
**Priority:** Medium

---

## Environment

- **URL:** https://www.soundbeyondborders.com/ (InstrumentChat component)
- **Browser:** Samsung Internet / Chrome Mobile
- **Device:** Samsung Galaxy S23 Ultra (Android)
- **Build:** Production — live site as of 2026-02-28

---

## Description

On Android, tapping the send button in the InstrumentChat component doesn't dismiss the soft keyboard. The keyboard stays open and takes up the lower half of the screen, blocking most of the message thread. Even in cases where the keyboard briefly closed on send, it would reopen on its own when the bot response came in — pushing the chat area upward and making the response hard to read.

---

## Steps to Reproduce

1. Navigate to the home page on an Android device
2. Tap the chat input field — soft keyboard opens
3. Type any question
4. Tap the send button
5. Observe: keyboard stays open, blocking the message thread
6. If keyboard closes briefly — observe: it reopens automatically when the bot response arrives

---

## Expected Behavior

Keyboard closes when send is tapped and stays closed when the response comes in.

---

## Actual Behavior

Keyboard stays open after send, blocking the chat. Even when it briefly closes, it reopens automatically when the response generates.

---

## Screenshots

**BR-010-screenshot-1.jpg** — Samsung S23 Ultra showing the keyboard still open after tapping send, with the message thread mostly hidden behind it. Send button also visibly cut off on the right edge (see BR-011).

---

## Fix Applied

Resolved by the development team.

**Files changed:** `src/components/InstrumentChat.astro`

---

## Verification Steps

1. Navigate to the home page on Android
2. Tap the input field, type a question, tap send
3. Confirm keyboard closes immediately after send
4. Wait for the bot response — confirm keyboard does not reopen
5. Confirm input field does not grab focus back on its own

**Verified on:** Samsung Galaxy S23 Ultra

**Verified in:** TS-006

---

## Linked Test Case

TC-006-01