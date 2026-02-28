# Test Cases — AI Chatbot: Mobile UX

**Feature:** InstrumentChat AI Component — mobile layout, keyboard, scroll, chip behavior  
**Page(s):**
- https://www.soundbeyondborders.com/ (homepage chat widget)

**Author:** Hunter Eastland  
**Last Updated:** February 2026  
**Status:** Complete

---

## Behavior Notes (Read Before Testing)

Mobile testing has to be done on the live production site — local dev doesn't replicate mobile browser behavior for things like keyboard dismissal or scroll position. All of these were tested on a Samsung Galaxy S23 Ultra running Android. What to expect on mobile:

- Keyboard should dismiss right after tapping send and should not come back when the bot responds
- Send button should be fully visible and tappable — not cut off by the edge of the container
- Suggestion chips should disappear after the first message is sent so they don't clutter the conversation
- After a response comes in, the page should scroll so the user sees the beginning of the response, not the end of it

---

## TC-006-01 — Keyboard Dismisses After Send and Stays Down

**Type:** UX — Mobile Only  
**Priority:** High  
**Environment:** Mobile (Android — Samsung Galaxy S23 Ultra)

**Preconditions:**
- Testing on a physical Android device against the live production site
- Chat widget visible on the home page

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to the home page on Android | Chat widget visible |
| 2 | Tap the chat input field | Soft keyboard opens |
| 3 | Type any question | Text appears in the input |
| 4 | Tap the send button | Message sends; keyboard dismisses |
| 5 | Wait for the bot response (~2–5 seconds) | Response appears; keyboard stays dismissed |

**Expected Result:** Keyboard goes away on send and does not come back when the response arrives.  
**Pass Criteria:** Keyboard down after send; stays down through response. Input field does not get focus back on its own.  
**Fail Criteria:** Keyboard stays up after send, or closes briefly and then reopens when the response comes in.

---

## TC-006-02 — Send Button Fully Visible on Mobile

**Type:** Layout — Mobile Only  
**Priority:** Medium  
**Environment:** Mobile (Android — Samsung Galaxy S23 Ultra)

**Preconditions:**
- Testing on a physical Android device against the live production site

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to the home page on Android | Chat widget visible |
| 2 | Scroll to the chat widget | Full widget in view |
| 3 | Look at the input row at the bottom of the widget | Both the input field and send button are fully visible; send button not cut off |
| 4 | Tap the send button with any text in the input | Button responds; message sends |

**Expected Result:** Send button is completely visible and tappable within the chat container.  
**Pass Criteria:** Entire send button icon visible; tap works correctly.  
**Fail Criteria:** Send button is partially or fully hidden by the container edge; tap is unreliable.

---

## TC-006-03 — Suggestion Chips Disappear After First Message on Mobile

**Type:** UX — Mobile Only  
**Priority:** Medium  
**Environment:** Mobile (Android)

**Preconditions:**
- Live production site, physical Android device
- No prior messages sent in the session (chips visible on load)

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to the home page on Android | Chat widget visible; 4 suggestion chips showing below the opening message |
| 2 | Tap any suggestion chip | Chip text sends as a message; thinking indicator appears |
| 3 | Watch the chip area while waiting for the response | Chips fade out and disappear |
| 4 | Confirm chips are gone after the response arrives | No chips visible; no visual clutter below the messages |

**Expected Result:** Chips disappear after the first message on mobile so they don't pile up.  
**Pass Criteria:** Chips fade out after first send and don't come back for the rest of the session.  
**Fail Criteria:** Chips stay visible after sending, pile up in the layout, or disrupt the message area.

---

## TC-006-04 — Response Scroll Shows Beginning of Bot Response

**Type:** UX — Mobile Only  
**Priority:** High  
**Environment:** Mobile (Android — Samsung Galaxy S23 Ultra)

**Preconditions:**
- Live production site, physical Android device

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to the home page on Android | Chat widget visible |
| 2 | Send a question likely to get a long response (e.g. "Tell me about the Baglama Saz in detail") | Message sends |
| 3 | Wait for the response | Response appears in the chat |
| 4 | Note where the screen lands after the response appears | Page has scrolled so the chat header is visible below the nav bar; first line of the response is readable |
| 5 | Confirm the first line is readable without having to scroll up manually | First sentence visible without user doing anything |

**Expected Result:** After a response comes in, the user sees the beginning of it — not the end.  
**Pass Criteria:** First sentence of the response visible right away. Nav bar does not cover the top of the chat widget.  
**Fail Criteria:** User lands at the bottom of the response and has to scroll up; nav bar overlaps the chat header or first line of text.

---

## Notes

- All four of these failed on the first production test and needed fixes before passing
- Each fix required a full deployment cycle to test — can't replicate any of this behavior locally
- Suggestion chips stay visible on desktop throughout the session; hiding them is mobile-only behavior