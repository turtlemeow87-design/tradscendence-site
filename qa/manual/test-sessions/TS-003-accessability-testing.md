# Test Session — Accessibility Testing: Screen Reader & Automated Scan
**Session ID:** TS-003  
**Author:** Hunter Eastland  
**Date:** February 23, 2026  
**Time:** ~4:16 PM EST  
**Environment:** Production (https://www.soundbeyondborders.com)  
**Tools:** Windows Narrator, axe DevTools (Chrome Extension)  
**Standard:** WCAG 2.1 AA  

---

## Session Goal
Perform an accessibility check on the live site using two methods — a manual screen reader walkthrough with Windows Narrator, and an automated scan with axe DevTools — to identify any issues that would affect users who rely on assistive technology.

---

## Method 1 — Windows Narrator (Screen Reader)

**What was tested:** Full site navigation using keyboard only (Tab key) with Windows Narrator active. No mouse used during this portion of the session.

**Results:**
- Nav links were announced correctly by name (Home, About, Contact / Booking, My Instruments, Memories)
- Hamburger button was announced with a meaningful label and updated correctly when opened and closed
- Page content was readable and navigable from top to bottom
- No elements were skipped or announced in a confusing order

**Overall Result:** ✅ Pass — Site navigates cleanly with a screen reader. ARIA attributes on the hamburger menu are functioning as intended.

---

## Method 2 — axe DevTools Automated Scan

**What was tested:** Full page scan run on the home page via the axe DevTools Chrome extension.

**Scan Summary:**
| # | Issue | Count | Impact | Source |
|---|---|---|---|---|
| 1 | Elements must only use permitted ARIA attributes | 2 | Serious | YouTube embed |
| 2 | Buttons must have discernible text | 2 | Critical | YouTube embed |
| 3 | Elements must meet minimum color contrast ratio | 2 | Serious | Site code + YouTube embed |

**Total Issues Found:** 6

**Breakdown:**
- 5 of the 6 issues are coming from an embedded YouTube player and are not fixable from within this codebase. These are third-party issues owned by YouTube.
- 1 issue is within the site's own code — the "Book me" button on the home page has a color contrast ratio of 2.12:1 against its gold background. WCAG 2.1 AA requires a minimum of 4.5:1 for normal-sized text. Filed as BR-005.

**Overall Result:** ⚠️ 1 actionable issue found — see BR-005. Remaining issues are third-party and out of scope.

---

## Bugs Filed
- **BR-005** — "Book me" button fails WCAG 2.1 AA minimum color contrast requirement (2.12:1, expected 4.5:1)

---

## Notes
- axe DevTools was run against the home page only. Other pages have not been scanned yet and would be worth including in a future session.
- The Narrator walkthrough covered desktop viewport only. A mobile screen reader test (e.g. TalkBack on Android or VoiceOver on iOS) would be a good follow-up for a future session.