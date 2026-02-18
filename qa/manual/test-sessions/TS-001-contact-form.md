# Test Sessions — Contact / Booking Form

**Page:** https://www.soundbeyondborders.com/contact

---

## Session 001

**Date:** 2026-02-19
**Tester:** Hunter Eastland
**Environment:** Production
**Browser:** Chrome 121
**Build / Version:** Live site as of 2026-02-19

| TC # | Title | Result | Actual Result | Bug Filed |
|------|-------|--------|---------------|-----------|
| TC-001 | Successful Full Booking Submission | Pass | Redirected to /thanks as expected | — |
| TC-002 | Submit with Missing Required Fields | Pass | Error banner appeared listing missing fields | — |
| TC-003 | Phone Number Auto-Formatting | Fail | Typing 18045551234 did not truncate "1" - instead stopped at 10 digits | BUG-002 |
| TC-004 | Instrument Multi-Select with Pills | Pass | Pills appeared and removed correctly | — |
| TC-005 | "Other" Genre Reveals Custom Text Field | Pass | Textarea appeared and disappeared as expected | — |
| TC-006 | Invalid Email Format | Pass | Error banner mentioned email specifically | — |
| TC-007 | Email Link Alternative | Pass | Email client opened with correct address | — |
| TC-008 | Form State After Failed Submission | Pass | Data preserved, resubmission succeeded | — |

**Summary:** 7 passed, 1 failed
**Notes:** TC-003 edge case with leading 1 may need API-level handling.

---

## Session 002

**Date:** 2026-02-19
**Triggered by:** BUG-002 fix
**Scope:** Confirmation retest of TC-003 only
| TC-003 | Phone Number Auto-Formatting | Pass | Typing 18045551234 truncated "1" - resulting in proper 10-digit number | BUG-002 |

...