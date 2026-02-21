# Traceability Matrix — Sound Beyond Borders

**Project:** Sound Beyond Borders — Music Booking Website  
**Author:** Hunter Eastland  
**Last Updated:** February 2026  

---

## What is a Traceability Matrix?

A traceability matrix maps each feature or requirement to the specific test cases that verify it. It answers the question: *"How do I know everything important is tested?"*

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
| Admin add requires auth | Admin Panel Add Instrument | Instruments API | 401 without valid x-admin-key | ✅ Pass (by design) |
| Admin can delete instrument | Admin Panel Delete Instrument | Instruments API | 200, success: true | ✅ Pass |
| Admin delete requires auth | Admin Panel Delete Instrument | Instruments API | 401 without valid x-admin-key | ✅ Pass (by design) |

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
| Leading country code stripped | TC-003 | UI Behavior | 18045551234 formats to (804) 555-1234 | ✅ Pass (after BR-002) |
| Instrument multi-select with pills | TC-004 | UI Behavior | Pills reflect selection, removal unchecks checkbox | ✅ Pass |
| "Other" genre reveals textarea | TC-005 | UI Behavior | Textarea appears/disappears with Other selection | ✅ Pass (after BR-003) |
| "Other" pill removal hides textarea | TC-005 | UI Behavior | Removing pill via × hides textarea | ✅ Pass (after BR-003) |
| Invalid email format blocked | TC-006 | Validation | Native browser tooltip on email field | ✅ Pass |
| Email link opens mail client | TC-007 | UI Behavior | Default email client opens with correct address | ✅ Pass |
| Form preserves data after failed submit | TC-008 | Validation | Previously entered data retained after validation failure | ✅ Pass |

---

## Authentication & Security

| Feature / Requirement | Test Case | Collection | Expected Result | Status |
|---|---|---|---|---|
| Admin endpoints protected | Admin Panel Add Instrument | Instruments API | 401 without x-admin-key header | ✅ Pass |
| Admin endpoints protected | Admin Panel Delete Instrument | Instruments API | 401 without x-admin-key header | ✅ Pass |
| Bot submissions silently ignored | Honeypot Triggered | Contact API Tests | 200 returned, no data processed | ✅ Pass |
| Non-JSON requests rejected | Wrong Content Type | Contact API Tests | 415 returned | ✅ Pass |

---

## Environment Coverage

| Test Collection | Local | Production |
|---|---|---|
| Instruments API | ✅ Tested | ✅ Tested |
| Contact API Tests | ✅ Tested | ⬜ Not yet run (triggers real emails/DB) |
| Contact Form Manual UI | N/A | ✅ Tested |

---

## Coverage Gaps & Future Test Cases

| Feature | Gap | Priority |
|---|---|---|
| Phone validation | Only digit count checked, not real number format | Low |
| Blog API | Not yet built | Medium |
| Calendar API | Not yet built | Medium |
| Store API | Not yet built | Medium |
| Admin update instrument (PUT) | Not yet covered with tests | Medium |
| Duplicate slug on POST | Should return 409 Conflict | High |
| Non-existent instrument slug | Should return 404 | High |
| Contact form — Production DB write | Needs verification against live database | High |
| Contact form — Resend email delivery | Needs end-to-end email verification | High |
| Navigation & core pages | TC-003 placeholder not yet completed | Medium |
| Media playback | TC-004 placeholder not yet completed | Medium |