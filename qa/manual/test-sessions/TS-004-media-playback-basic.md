# Test Sessions — Media Playback (Basic Audio)

**Page(s):** https://www.soundbeyondborders.com/instruments/ | https://www.soundbeyondborders.com/

**Author:** Hunter Eastland

---

## Session 001

**Date:** 2026-02-27  
**Tester:** Hunter Eastland  
**Environment:** Production  
**Browser:** Chrome (Desktop)  
**Device:** Desktop PC  
**Build / Version:** Live site as of 2026-02-27

| TC # | Title | Result | Actual Result | Bug Filed |
|------|-------|--------|---------------|-----------|
| TC-004-01 | Hover Triggers Audio Playback (Desktop) | ❌ Fail | On first page load, hovering over any ▶︎ button produced no audio and no visible feedback. After clicking any ▶︎ button once, hover began working normally across all buttons for the remainder of the session. Console showed no error during failed hover — failure was silent. | BR-007 |
| TC-004-02 | Click/Tap — Desktop restart behavior | ✅ Pass | Clicking ▶︎ on a playing instrument restarted audio from beginning. Clicking a different ▶︎ while first was playing stopped the first and started the second. Consistent across multiple instruments tested. | — |
| TC-004-03 | Only One Audio Plays at a Time | ⚠️ Partial | Under normal switching speed: Pass — mutual exclusion worked correctly. Under rapid switching on homepage Featured Sounds: Fail — AbortError logged in console. Second track failed to play. Recovered on retry. See BR-009-screenshot-1.png, BR-009-screenshot-2.png. | BR-009 |
| TC-004-04 | Homepage Featured Sounds Playback | ✅ Pass | All three featured sound cards played correctly at normal switching speed. Audio continued after mouse left card (by design). Audio persisted across tab switches (by design). | — |
| TC-004-05 | REMOVED | N/A | Test case removed — see TC-004-05 note in test case file. | — |
| TC-004-06 | Graceful Failure on Broken Audio Source | ⏳ Incomplete | Network request blocking panel opened and URL entered (see BR-009-screenshot-3.png). Hard refresh step not yet completed this session. | — |

**Summary:** 2 passed, 1 failed, 1 partial, 1 N/A, 1 incomplete  
**Notes:** BR-008 (favicon.ico 404) also observed in console — see BR-008-screenshot-1.png. Unrelated to audio. TC-004-06 completed in Session 002.

---

## Session 002

**Date:** 2026-02-27  
**Tester:** Hunter Eastland  
**Environment:** Production  
**Browser:** Chrome (Desktop)  
**Device:** Desktop PC  
**Scope:** Completion of TC-004-06

| TC # | Title | Result | Actual Result | Bug Filed |
|------|-------|--------|---------------|-----------|
| TC-004-06 | Graceful Failure on Broken Audio Source | ✅ Pass | After hard refresh with `baglamasaz1.m4a` blocked via Network request blocking panel, clicking ▶︎ on Baglama Saz produced no audio. No visible crash or error shown to user. All other play buttons continued to function normally. | — |

**Summary:** 1 passed  
**Notes:** Blocked URL: `www.soundbeyondborders.com/media/baglamasaz1.m4a`. Page remained fully stable throughout.

---

## Session 003

**Date:** 2026-02-27  
**Tester:** Hunter Eastland  
**Environment:** Production  
**Browser:** Chrome Mobile  
**Device:** Android  
**Scope:** Mobile testing — TC-004-02 tap trigger, TC-004-04 homepage featured sounds

| TC # | Title | Result | Actual Result | Bug Filed |
|------|-------|--------|---------------|-----------|
| TC-004-02 | Click/Tap — Mobile tap as primary trigger | ✅ Pass | Tapping ▶︎ on instruments page triggered audio playback correctly. Audio stopped when a second instrument was tapped. No page reload or navigation occurred. Behavior consistent across multiple instruments tested. | — |
| TC-004-04 | Homepage Featured Sounds Playback — Mobile | ✅ Pass | All three featured sound cards (Surbahar, Baglama Saz, Arabic Oud) responded correctly to tap. Mutual exclusion worked — tapping a second card stopped the first. | — |

**Summary:** 2 passed  
**Notes:** No hover behavior on mobile as expected — tap-only confirmed working correctly. No issues observed.

---

## Session 004

**Date:** 2026-02-27  
**Tester:** Hunter Eastland  
**Environment:** Production  
**Browser:** Chrome (Desktop)  
**Device:** Desktop PC  
**Scope:** Confirmation retest of BR-007, BR-008, BR-009 after fixes deployed

| TC # | Title | Result | Actual Result | Bug Closed |
|------|-------|--------|---------------|------------|
| TC-004-01 | Hover Triggers Audio Playback (Desktop) | ✅ Pass | Toast appeared on page load. After clicking anywhere on the page, toast faded out and hover-to-play worked immediately on first hover attempt. No console errors. | BR-007 ✅ Closed |
| TC-004-03 | Only One Audio Plays at a Time — Rapid switching | ✅ Pass | Rapid switching between Featured Sound tracks no longer produces AbortError in console. Audio behavior unchanged at normal switching speed. | BR-009 ✅ Closed |
| BR-008 | favicon.ico 404 | ✅ Resolved | No favicon.ico 404 error in console on any page. Browser tab displays correct icon. | BR-008 ✅ Closed |

**Summary:** 3 passed, 0 failed  
**Notes:** All three bugs confirmed resolved. Full TC-004 test suite now complete across desktop and mobile.