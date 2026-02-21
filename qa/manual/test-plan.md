# Test Plan — Sound Beyond Borders (soundbeyondborders.com)

**Project:** Sound Beyond Borders — Music Booking Website  
**Author:** Hunter Eastland  
**Last Updated:** February 2026  
**Status:** Active  

---

## 1. Overview

This test plan covers testing performed on the Sound Beyond Borders music booking website. The site is built with Astro (TypeScript), uses a Neon PostgreSQL database, and deploys via Vercel. Testing includes manual UI testing, API testing via Postman, mock server simulation via Mockoon, and exploratory automated UI testing via Playwright.

---

## 2. Scope

### In Scope
- Contact/Booking form UI (manual testing)
- Instruments API endpoints (GET, POST, DELETE)
- Contact/Booking form API endpoint (POST)
- Input validation and error handling
- Authentication on protected admin routes
- Response structure and data integrity
- Mobile device testing (in progress)

### Out of Scope
- Third-party services (Resend email, Neon database internals)
- Blog, calendar, and store pages (not yet built)

---

## 3. Test Environments

| Environment | Base URL | When Used |
|---|---|---|
| Local | `http://localhost:4321` | Active development, manual runs |
| Production | `https://www.soundbeyondborders.com` | Post-deployment verification and manual UI testing |

> **Note:** In the Local environment, the contact API skips database inserts and email sends by design (development mode flag). Production runs trigger real database writes and Resend email notifications.

Environments are managed as Postman Environment variables using `{{base_url}}` across all requests, allowing seamless switching without modifying individual requests.

---

## 4. Tools

| Tool | Purpose |
|---|---|
| Postman | API test authoring, collection runner, environment management |
| Mockoon | Mock server simulating contact API responses for isolated testing |
| Jira | Bug tracking and ticket management (project: QA Testing / SCRUM) |
| GitHub | Version control, test artifact storage |
| Playwright | Exploratory automated UI testing (contact form — one suite completed as learning exercise) |
| Chrome DevTools | Manual inspection, network monitoring, mobile emulation |

---

## 5. Test Collections

### 5.1 Instruments API

Tests covering the public instruments listing, individual instrument pages, featured instruments, and admin CRUD operations.

| Request | Method | Endpoint | Auth Required |
|---|---|---|---|
| Populating Instruments | GET | `/api/instruments/index.json` | No |
| Returning a Single Instrument | GET | `/api/instruments/[slug].json` | No |
| Featured Instruments | GET | `/api/instruments/featured.json` | No |
| Admin Panel Add Instrument | POST | `/api/instruments/index.json` | Yes (x-admin-key) |
| Admin Panel Delete Instrument | DELETE | `/api/instruments/[slug].json` | Yes (x-admin-key) |

**Authentication:** Admin endpoints require an `x-admin-key` header matching the `ADMIN_API_KEY` environment variable.

**Total Tests:** 14 assertions across 5 requests  
**Status:** ✅ All passing (Local + Production)

---

### 5.2 Contact API Tests

Tests covering the booking/contact form submission endpoint, organized by scenario type.

#### Happy Path
| Request | Scenario |
|---|---|
| Happy Path - Full Booking | All fields populated including optional fields |
| Custom Genre | `genre_other` field populated with custom genre text |

#### Validation Errors
| Request | Scenario | Expected Status |
|---|---|---|
| Missing Required Fields | name, email, location, message all empty | 400 |
| Wrong Content Type | Request sent as `application/x-www-form-urlencoded` instead of JSON | 415 |

#### Edge Cases
| Request | Scenario | Expected Status |
|---|---|---|
| Invalid Email | Email field contains `not-an-email` | 400 |
| Invalid Date | Date field uses `MM/DD/YYYY` instead of required `YYYY-MM-DD` | 400 |
| Honeypot Triggered | Honeypot field contains text (bot detection) | 200 (silent pass) |
| Max Length Message | Message exceeds 4000 character limit (auto-clamped) | 200 |

**Total Tests:** Assertions across 8 requests  
**Status:** ✅ All passing (Local)

---

### 5.3 Manual UI Testing — Contact / Booking Form

Test cases covering UI behavior, validation, and happy path scenarios for the contact form at `/contact`. Test cases were documented and executed against the production environment.

| TC # | Title | Type | Status |
|---|---|---|---|
| TC-001 | Successful Full Booking Submission | Happy Path | ✅ Pass |
| TC-002 | Submit with Missing Required Fields | Validation | ✅ Pass |
| TC-003 | Phone Number Auto-Formatting | UI Behavior | ✅ Pass (after BUG-002 fix) |
| TC-004 | Instrument Multi-Select with Pills | UI Behavior | ✅ Pass |
| TC-005 | "Other" Genre Reveals Custom Text Field | UI Behavior | ✅ Pass (after BUG-003 fix) |
| TC-006 | Invalid Email Format | Validation | ✅ Pass |
| TC-007 | Email Link Alternative | UI Behavior | ✅ Pass |
| TC-008 | Form State After Failed Submission | Validation | ✅ Pass |

**Bugs filed during testing:** BUG-002 (phone leading "1" not stripped), BUG-003 ("Other" genre textarea persists after pill removal)  
**Both bugs fixed and verified in subsequent test sessions.**  
**Full test cases:** `qa/manual/test-cases/TC-001-contact-form.md`  
**Test sessions:** `qa/manual/test-sessions/TS-001-contact-form.md`

> **Note on TC-003:** Step 3 of the test case document requires updating — the expected result for typing `18045551234` should now reflect `(804) 555-1234` following the BUG-002 fix.

---

## 6. Test Approach

### Manual UI Testing
Test cases are executed against the production site. Results are logged in test session documents including actual results, pass/fail status, and any bugs filed.

### Functional API Testing
Each API endpoint is tested for correct HTTP status codes, response structure (JSON shape), and field-level validation. Tests are written as Postman post-response scripts using the `pm.test()` and `pm.expect()` assertion library.

### Positive Testing (Happy Path)
Verify that valid, well-formed requests return expected success responses with correct data shapes.

### Negative Testing (Validation & Edge Cases)
Verify that invalid inputs are correctly rejected with appropriate error codes and descriptive error messages.

### Mock Testing
Mockoon is used to simulate the contact API with predefined responses, allowing frontend and integration testing without depending on the live backend.

### Exploratory Automated UI Testing
A Playwright test suite was developed for the contact form as a learning exercise. Covers form submission, multi-select interactions, validation behavior, and success redirect. Not currently integrated into a CI/CD pipeline.

---

## 7. Bug Reporting

Bugs discovered during test runs are logged in Jira (project: QA Testing). Commit messages reference Jira ticket IDs to maintain traceability between code changes and reported issues.

**Bug report fields:**
- Summary
- Steps to reproduce
- Expected behavior
- Actual behavior
- Severity
- Environment (Local / Production)
- Fix applied and verification status

---

## 8. Known Limitations

- Contact API tests on Local do not verify database writes or email delivery (by design)
- Production contact form tests write real data to the database — use test data only
- Phone validation accepts any 10 or 11 digit number regardless of real-world validity
- Automated UI tests exist for the contact form but are not scheduled or CI-integrated
- Mobile testing currently limited to Chrome DevTools emulation — physical device testing in progress
- TC-003 step 3 expected result needs updating to reflect post-fix behavior

---

## 9. Future Improvements

- [ ] Complete physical device testing on contact form and core navigation
- [ ] Add basic SQL queries to verify database writes after form submission
- [ ] Expand manual test cases to cover navigation and media playback pages
- [ ] Set up GitHub Actions to run Postman collections automatically on push to `main`