# Test Session — AI Chatbot: Mobile UX Testing

**Session ID:** TS-006  
**Test Cases Covered:** TC-006-01, TC-006-02, TC-006-03, TC-006-04  
**Author:** Hunter Eastland  
**Date:** February 28, 2026  
**Time:** ~2:00 PM – 3:15 PM EST  
**Environment:** Production (https://www.soundbeyondborders.com/)  
**Device:** Samsung Galaxy S23 Ultra (Android)  
**Tool:** Samsung Internet / Chrome Mobile

---

## Session Goal

Verify that the chat widget is actually usable on Android — keyboard behaves correctly, nothing is cut off, the suggestion chips don't clutter the UI after the first message, and the page scrolls to show the beginning of bot responses rather than the end.

---

## Results Summary

| Test Case | Description | Result |
|---|---|---|
| TC-006-01 | Keyboard dismisses after send, stays down | ✅ Pass (after fix) |
| TC-006-02 | Send button fully visible on mobile | ✅ Pass (after fix) |
| TC-006-03 | Suggestion chips disappear after first message | ✅ Pass (after fix) |
| TC-006-04 | Response scroll shows beginning of response | ✅ Pass (after fix) |

---

## Session Notes

**TC-006-02 — Send Button Cut Off (Initial Fail)**  
First thing I noticed on loading the widget — the send button was about half-hidden by the right edge of the container. Tap still sort of worked but the button looked broken. Reported to dev as BR-011. Fixed and verified on retest.

**TC-006-01 — Keyboard Not Dismissing (Initial Fail)**  
After the send button was fixed, moved on to testing the send flow. Keyboard stayed open after tapping send, blocking most of the message thread. Tried again and noticed that even when it closed briefly, it would reopen on its own when the bot response arrived. Reported to dev as BR-010. Fixed and verified on retest.

**TC-006-03 — Suggestion Chips Piling Up (Initial Fail)**  
After BR-010 fix was deployed, noticed the suggestion chips were still showing below the message thread after sending a message — they didn't go away and started stacking up visually. Reported to dev. Fixed and verified on retest; chips now fade out after the first message.

**TC-006-04 — Scroll Landing at Bottom of Response (Initial Fail)**  
Sent a longer question to test scroll behavior. After the response came in, the page scrolled but landed with the nav bar covering the top of the chat widget and the first line of the response hidden. The message area was also scrolled to the bottom of the response rather than the top, so I had to scroll up manually to read from the beginning. Reported to dev. Took two rounds of adjustments before the scroll position was landing correctly. Pass on final retest.

---

## Bugs Filed

| ID | Title | Severity | Status |
|---|---|---|---|
| BR-010 | Soft keyboard stays open after send and reopens on response | Medium | ✅ Resolved |
| BR-011 | Send button partially cut off on mobile | Low | ✅ Resolved |

---

## Screenshots

 `TC-006-scroll-correct.jpg` — correct landing position after fix: chat header visible, first line of response readable (TC-006-04)

---

## Notes

None of this could be tested locally — every fix cycle meant a full deployment before I could check anything on the device. All four test cases failed on the first pass and required fixes before passing.

---

## Overall Result

✅ All test cases passed after fixes. Widget is usable on Samsung Galaxy S23 Ultra.