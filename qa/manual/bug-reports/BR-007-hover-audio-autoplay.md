# Bug Report — BR-007

**Title:** Hover-to-play audio silently fails on first page load before any click interaction  
**Reported by:** Hunter Eastland  
**Date:** 2026-02-27  
**Status:** Open  
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

On the `/instruments` page, hovering over any ▶︎ play button on first page load produces no audio and no visible feedback. The hover interaction appears to do nothing. After the user clicks any play button at least once, hover-to-play begins working normally across all buttons for the remainder of the session.

---

## Steps to Reproduce

1. Open a fresh browser tab and navigate to `https://www.soundbeyondborders.com/instruments/`
2. Without clicking anywhere on the page, hover the mouse over any ▶︎ button
3. Observe: no audio plays, no feedback given
4. Click any ▶︎ button once
5. Observe: audio plays on click
6. Now hover over a different ▶︎ button without clicking
7. Observe: hover now works normally

---

## Expected Result

Hovering over a ▶︎ button should begin playing audio immediately, regardless of whether the user has previously clicked anywhere on the page.

---

## Actual Result

Hover-to-play is silently blocked on first page load. No audio, no error shown to user, no console error logged. After one click anywhere on the page, hover works correctly for the rest of the session.

---

## Root Cause

Modern browsers enforce an autoplay policy that blocks audio from playing until the user has made at least one deliberate interaction (click or tap) with the page. The hover handler calls `audio.play()` but the browser rejects it silently. The `catch {}` block in the playback code swallows the rejection without any feedback. The first click anywhere on the page satisfies the browser's gesture requirement, after which hover works normally.

---

## Proposed Fix

Add a one-time click listener on `document.body` that calls a silent, zero-duration audio play to unlock the browser's autoplay policy as early as possible — before the user has hovered over anything. This is a standard pattern for sites that rely on hover-triggered audio.

Alternatively, show a subtle visual indicator on first load (e.g. a tooltip or pulsing effect on the first ▶︎ button) prompting the user to click once to enable sound.

---

## Impact

- Users on desktop who try to preview instruments by hovering on first visit will hear nothing and may assume the feature is broken
- No crash or data loss — purely a UX/discoverability issue
- After one click, behavior is fully correct

---

## Screenshots

No console error produced — failure is silent. See TS-004 Session 001 notes.

---

## Linked Test Case

TC-004-01 — Hover Triggers Audio Playback (Desktop)  
**Test Session:** TS-004 Session 001