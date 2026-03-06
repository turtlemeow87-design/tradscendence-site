# Traceability Matrix — Sound Beyond Borders

**Project:** Sound Beyond Borders — Music Booking Website  
**Author:** Hunter Eastland  
**Last Updated:** March 2026  

---

## What is a Traceability Matrix?

Since I built this site myself with the help of AI, there wasn't a formal spec or product manager handing me requirements — so I worked backwards from the intended behavior of the application to derive them. From there I tried to map each one to the test cases I wrote to verify it. In a real team environment I'd be working from requirements written by others upstream, but I wanted to practice understanding how the pieces connect. That's what this matrix is attempting to do.

---

## Instruments API

| Feature / Requirement | Test Case | Collection | Expected Result | Status |
|---|---|---|---|---|
| List all instruments | Populating Instruments | Instruments API | 200, JSON array | ✅ Pass |
| Response is valid JSON | Populating Instruments | Instruments API | Content-Type: application/json | ✅ Pass |
| Instruments array returned | Populating Instruments | Instruments API | Response is an array | ✅ Pass |
| Single instrument page loads | Returning a Single Instrument | Instruments API | 200, JSON object | ✅ Pass |
| Instrument has required fields | Returning a Single Instrument | Instruments API | name, slug, tagline, image_url, videos present | ✅ Pass |
| Featured instruments endpoint | Featured Instruments | Instruments API | 200, JSON array | ✅ Pass |
| Featured returns correct shape | Featured Instruments | Instruments API | Each item has name, slug, image_url, audio_teaser | ✅ Pass |
| Admin can add instrument | Admin Panel Add Instrument | Instruments API | 201, success: true, id returned | ✅ Pass |
| Admin add requires auth | Admin Panel Add Instrument | Instruments API | 401 without valid x-admin-key | ✅ Pass |
| Admin can delete instrument | Admin Panel Delete Instrument | Instruments API | 200, success: true | ✅ Pass |
| Admin delete requires auth | Admin Panel Delete Instrument | Instruments API | 401 without valid x-admin-key | ✅ Pass |

---

## Contact / Booking Form API

| Feature / Requirement | Test Case | Collection | Expected Result | Status |
|---|---|---|---|---|
| Full booking submission succeeds | Happy Path - Full Booking | Contact API Tests | 200, ok: true | ✅ Pass |
| Custom genre field accepted | Custom Genre | Contact API Tests | 200, ok: true | ✅ Pass |
| Missing required fields rejected | Missing Required Fields | Contact API Tests | 400, errors object with field-level messages | ✅ Pass |
| name required | Missing Required Fields | Contact API Tests | errors.name present | ✅ Pass |
| email required | Missing Required Fields | Contact API Tests | errors.email present | ✅ Pass |
| location required | Missing Required Fields | Contact API Tests | errors.location present | ✅ Pass |
| message required | Missing Required Fields | Contact API Tests | errors.message present | ✅ Pass |
| Wrong content type rejected | Wrong Content Type | Contact API Tests | 415 Unsupported Media Type | ✅ Pass |
| Invalid email format rejected | Invalid Email | Contact API Tests | 400, errors.email present | ✅ Pass |
| Invalid date format rejected | Invalid Date | Contact API Tests | 400, errors.date with YYYY-MM-DD message | ✅ Pass |
| Honeypot bot detection | Honeypot Triggered | Contact API Tests | 200 silent pass (no processing) | ✅ Pass |
| Oversized message clamped | Max Length Message | Contact API Tests | 200, message truncated to 4000 chars | ✅ Pass |

---

## Contact / Booking Form — Manual UI

| Feature / Requirement | Test Case | Type | Expected Result | Status |
|---|---|---|---|---|
| Full booking submission succeeds | TC-001 | Happy Path | Redirects to /thanks | ✅ Pass |
| Required fields enforced | TC-002 | Validation | Native browser tooltip on first empty required field | ✅ Pass |
| Page scrolls to invalid field | TC-002 | Validation | Smooth scroll to field above sticky header | ✅ Pass |
| Phone auto-formats on input | TC-003 | UI Behavior | Digits format to (XXX) XXX-XXXX in real time | ✅ Pass |
| Leading country code stripped | TC-003 | UI Behavior | 18045551234 formats to (804) 555-1234 | ✅ Pass |
| Instrument multi-select with pills | TC-004 | UI Behavior | Pills reflect selection, removal unchecks checkbox | ✅ Pass |
| "Other" genre reveals textarea | TC-005 | UI Behavior | Textarea appears/disappears with Other selection | ✅ Pass |
| "Other" pill removal hides textarea | TC-005 | UI Behavior | Removing pill via × hides textarea | ✅ Pass |
| Invalid email format blocked | TC-006 | Validation | Native browser tooltip on email field | ✅ Pass |
| Email link opens mail client | TC-007 | UI Behavior | Default email client opens with correct address | ✅ Pass |
| Form preserves data after failed submit | TC-008 | Validation | Previously entered data retained after validation failure | ✅ Pass |

---

## Database Validation — contact_submissions

| Feature / Requirement | Test Case | Type | Expected Result | Status |
|---|---|---|---|---|
| Recent submissions retrievable | TC-002-DB-001 | Data Validation | Rows returned sorted by created_at DESC, no NULLs in id/name/email | ✅ Pass |
| Submission stored with correct field values | TC-002-DB-002 | Data Integrity | All fields match submitted form data exactly | ✅ Pass |
| Required fields never NULL | TC-002-DB-003 | Data Integrity | Zero rows returned when checking for NULLs on name/email/location/message | ✅ Pass |
| Duplicate submissions detectable | TC-002-DB-004 | Data Integrity | Query identifies multiple submissions from same email within short window | ✅ Pass |

---

## Core Navigation

| Feature / Requirement | Test Case | Type | Expected Result | Status |
|---|---|---|---|---|
| Desktop nav links route correctly | TC-003-01 | Happy Path | All 5 links navigate to correct pages, no 404s | ✅ Pass |
| Logo routes to home | TC-003-02 | Happy Path | Clicking logo from any page returns to `/` | ✅ Pass |
| @Tradscendence handle routes to footer | TC-003-03 | UI Behavior | Smooth scroll to footer on home page | ✅ Pass |
| Mobile menu opens and closes | TC-003-04 | UI Behavior | Hamburger toggles menu, button state updates | ✅ Pass |
| Mobile menu closes on outside click | TC-003-05 | UI Behavior | Clicking outside dismisses menu | ✅ Pass |
| Mobile menu closes on Escape key | TC-003-06 | UI Behavior / Accessibility | Escape key closes menu, supports keyboard nav | ✅ Pass |
| Mobile menu links route correctly | TC-003-07 | Happy Path | All 5 mobile nav links navigate correctly | ✅ Pass |
| Future nav links not visible | TC-003-08 | Validation | Blog, Calendar, Store not visible in desktop or mobile nav | ✅ Pass |

---

## Authentication — Route Protection

| Feature / Requirement | Test Case | Collection / Type | Expected Result | Status |
|---|---|---|---|---|
| Unauthenticated user visiting /dashboard | TC-007 | Manual — Security | Redirect to /login (302 → 200) | ✅ Pass |
| Authenticated user visiting /login | TC-007 | Manual — Security | Redirect to /dashboard | ✅ Pass |
| Authenticated user visiting /register | TC-007 | Manual — Security | Redirect to /dashboard | ✅ Pass |
| Logout removes auth cookie | TC-007 | Manual — Security | auth_token cookie cleared, /dashboard no longer accessible | ✅ Pass |
| No protected content flash before redirect | TC-007 | Manual — Security | Dashboard content not visible during redirect | ✅ Pass |

---

## Authorization — Admin Boundary (Security Regression)

| Feature / Requirement | Test Case | Collection | Expected Result | Status |
|---|---|---|---|---|
| Admin endpoints blocked — no key | 02 - Admin: Missing Key | Security Regression | 401 Unauthorized | ✅ Pass |
| Admin endpoints blocked — wrong key | 03 - Admin: Invalid Key | Security Regression | 401 Unauthorized | ✅ Pass |
| Admin endpoints accessible — valid key | TC-009-03 | Security Regression | 200 OK | ✅ Pass |
| Non-admin authenticated user blocked from /api/admin/* | TC-009-02 | Security Regression | 401 Unauthorized | ✅ Pass |

---

## Authorization — IDOR / Horizontal Privilege Escalation

| Feature / Requirement | Test Case | Collection | Expected Result | Status |
|---|---|---|---|---|
| User A cannot view User B's contract | 04 - IDOR: Read | Security Regression | 403 Forbidden | ✅ Pass |
| User A cannot download User B's invoice | 04 - IDOR: Read | Security Regression | 403 Forbidden | ✅ Pass |
| Unauthenticated user cannot view any contract | 04 - IDOR: Read | Security Regression | 401 or 403 | ✅ Pass |
| Unauthenticated user cannot view any invoice | 04 - IDOR: Read | Security Regression | 401 or 403 | ✅ Pass |
| User A cannot submit review for User B's booking | 05 - IDOR: Write | Security Regression | 403 Forbidden | ✅ Pass |

---

## Password Reset — Security Boundaries

| Feature / Requirement | Test Case | Collection | Expected Result | Status |
|---|---|---|---|---|
| Unregistered email returns 200 (no enumeration) | 06 - Password Reset | Security Regression | 200 OK, no content difference | ✅ Pass |
| Valid email triggers OTP email + reset_token cookie | Manual | Manual | 200 OK, email received, cookie issued | ✅ Pass |
| /reset-password without cookie redirects to /login | Manual | Manual | Redirect to /login before page renders | ✅ Pass |
| Tampered reset_token cookie rejected | 06 - Password Reset | Security Regression | 401 or redirect | ✅ Pass |

---

## Input Validation — Admin Endpoints

| Feature / Requirement | Test Case | Collection | Expected Result | Status |
|---|---|---|---|---|
| Admin contract upload — missing file | 07 - Input Validation | Security Regression | 400 Bad Request | ✅ Pass |
| Admin invoice upload — missing label | 07 - Input Validation | Security Regression | 400 Bad Request | ✅ Pass |
| Duplicate invoice label blocked before upload | 07 - Input Validation | Security Regression | 409 Conflict | ✅ Pass |

---

## Input Validation — Review Submission (Manual Only)

| Feature / Requirement | Test Case | Type | Expected Result | Status |
|---|---|---|---|---|
| Review body under 10 chars rejected | TC-008 / Manual | Manual | 400 validation error | ✅ Pass |
| Review body over 1000 chars rejected | TC-008 / Manual | Manual | 400 validation error | ✅ Pass |
| Script injection in review body escaped on /memories | Manual (pre-release) | Manual — Observation | Rendered as text, not executed | ✅ Pass |
| Duplicate review on same booking blocked | TC-008 | Manual | 409 Conflict | ✅ Pass |
| Review on non-Complete booking blocked | TC-008 | Manual | 403 Forbidden | ✅ Pass |
| Unauthenticated review submission blocked | TC-008 | Manual | 401 Unauthorized | ✅ Pass |

---

## Accessibility

| Feature / Requirement | Test Case | Type | Expected Result | Status |
|---|---|---|---|---|
| No critical axe violations on home page | TS-003 | Accessibility | Zero critical violations in axe DevTools scan | ✅ Pass |
| Screen reader announces page content | TS-003 | Accessibility | Windows Narrator reads headings, labels, and interactive elements correctly | ✅ Pass |
| Hamburger button ARIA state updates | TC-003-04 | Accessibility | aria-expanded and aria-label update on open/close | ✅ Pass |
| Book Me button color contrast | TS-003 | Accessibility | Requires 4.5:1 contrast ratio (WCAG 2.1 AA) | ❌ Fail — BR-005 (2.12:1 actual) |

---

## Open Bugs

| Bug ID | Description | Severity | Status |
|---|---|---|---|
| BR-004 | Intermittent SSL protocol error on custom domain | Medium | ✅ Closed |
| BR-005 | Book Me button fails WCAG 2.1 AA color contrast — 2.12:1 actual, 4.5:1 required | Medium | 🔴 Open |

---

## Environment Coverage

| Test Collection | Local | Production |
|---|---|---|
| Instruments API | ✅ Tested | ✅ Tested |
| Contact API Tests | ✅ Tested | ⬜ Not yet run (triggers real emails/DB) |
| Security Regression (Stateless — CI) | ✅ Tested | ✅ Tested (via GitHub Actions) |
| Security Regression (Auth-Dependent) | ✅ Tested | ✅ Tested (local Newman) |
| Contact Form Manual UI | N/A | ✅ Tested |
| Database Validation | N/A | ✅ Tested (Neon SQL Editor) |
| Core Navigation | N/A | ✅ Tested |
| Authentication Enforcement | N/A | ✅ Tested |
| IDOR / Privilege Escalation | N/A | ✅ Tested |
| Accessibility (axe + Narrator) | N/A | ✅ Tested (home page only) |

---

## Coverage Gaps & Future Test Cases

| Feature | Gap | Priority |
|---|---|---|
| Forgot password — full happy path | Test cases not yet documented | High |
| Memories system — CRUD flows | TC not yet written (Layer 5b) | Medium |
| Review system — full flow | TC not yet written (Layer 5) | Medium |
| axe scans — dashboard, admin, memories | Only home page scanned so far | Medium |
| Mobile screen reader testing | Narrator tested on desktop only | Medium |
| Phone validation | Only digit count checked, not real number format | Low |
| Duplicate slug on instrument POST | Should return 409 Conflict | Medium |
| Non-existent instrument slug | Should return 404 | Medium |
| Contact form — Production DB write | Needs verification against live database | High |
| Contact form — Resend email delivery | Needs end-to-end email verification | High |
| Physical device testing | Not yet run on real mobile hardware | Medium |